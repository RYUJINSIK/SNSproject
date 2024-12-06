describe("게시글 작성/수정 테스트", () => {
  beforeEach(() => {
    // Supabase 로그인 수행
    cy.visit("/login"); // 로그인 페이지로 이동

    // 로그인 폼 입력
    cy.get("input#email").type("petopia@test.com");
    cy.get("input#password").type("!@wlstlr95");
    cy.get('button[type="submit"]').click();

    // 로그인 성공 후 홈 페이지로 이동했는지 확인
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
  });

  it("새 게시글 작성 성공", () => {
    // 게시글 작성 페이지로 이동
    cy.visit("/posts/write");

    // 게시글 내용 입력
    cy.get("textarea#description").type("이것은 새 게시글입니다.");

    // 이미지 업로드
    const fileName = "example.jpg"; // 테스트용 이미지 파일 이름
    cy.fixture(fileName, "base64").then((fileContent) => {
      cy.get('input[type="file"]').selectFile(
        { contents: Cypress.Buffer.from(fileContent), fileName },
        { force: true }
      );
    });

    // 해시태그 추가
    cy.get("input#hashtags").type("#테스트{enter}").type("#Cypress{enter}");

    // 폼 제출
    cy.get('button[type="submit"]').click();

    // 성공적으로 홈 페이지로 리다이렉트 확인
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
  });

  it("게시글 수정 성공 (내용 덮어쓰기)", () => {
    // 게시글 수정 페이지로 이동 (postId=1)
    cy.visit("/posts/write?postId=1");

    cy.get("textarea#description").clear();
    cy.get("textarea#description").type("수정기능 테스트입니다."); // 게시글내용 수정

    // 해시태그 수정(추가)
    cy.get("input#hashtags").type("#수정테스트태그{enter}");

    // 폼 제출
    cy.get('button[type="submit"]').click();

    // 성공적으로 홈 페이지로 리다이렉트 확인
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
  });

  it("필수 필드 누락으로 작성 실패", () => {
    // 게시글 작성 페이지로 이동
    cy.visit("/posts/write");

    // 폼 제출 (내용 없이)
    cy.get('button[type="submit"]').click();

    // 오류 메시지 확인
    cy.contains("이 필드는 필수입니다.").should("be.visible");
  });

  it("이미지 업로드 제한 확인 (최대 5개)", () => {
    // 게시글 작성 페이지로 이동
    cy.visit("/posts/write");

    const fileName = "example.jpg";

    for (let i = 0; i < 6; i++) {
      cy.fixture(fileName, "base64").then((fileContent) => {
        cy.get('input[type="file"]').selectFile(
          { contents: Cypress.Buffer.from(fileContent), fileName },
          { force: true }
        );
      });
    }

    // 경고 메시지 확인
    cy.on("window:alert", (text) => {
      expect(text).to.contains("최대 5개의 이미지만 선택할 수 있습니다.");
    });
  });
});
