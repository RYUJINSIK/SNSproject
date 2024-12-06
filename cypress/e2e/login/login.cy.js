describe("로그인 페이지 테스트", () => {
  beforeEach(() => {
    cy.visit("/login"); // 로그인 페이지로 이동
  });

  it("정상적인 이메일과 비밀번호로 로그인 성공", () => {
    // 이메일 입력
    cy.get("#email").type("petopia@test.com");

    // 비밀번호 입력
    cy.get("#password").type("!@wlstlr95");

    // 로그인 버튼 클릭
    cy.get('button[type="submit"]').click();

    // 홈 페이지로 리다이렉트 확인 (예: "/")
    cy.url().should("eq", `${Cypress.config().baseUrl}/`);
  });

  it("잘못된 이메일 또는 비밀번호로 로그인 실패", () => {
    // 이메일 입력
    cy.get("#email").type("wrong@example.com");

    // 비밀번호 입력
    cy.get("#password").type("wrongpassword");

    // 로그인 버튼 클릭
    cy.get('button[type="submit"]').click();

    // 에러 메시지 확인
    cy.contains(
      "등록되지 않은 이메일 혹은 비밀번호를 잘못 입력했습니다."
    ).should("be.visible");
  });
});
