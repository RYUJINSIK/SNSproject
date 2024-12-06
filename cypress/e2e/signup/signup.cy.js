describe("회원가입 페이지 테스트 (API Mocking)", () => {
  beforeEach(() => {
    // 회원가입 페이지로 이동
    cy.visit("/signup");
  });

  it("회원가입 성공 (Mocked API)", () => {
    // 회원가입 요청을 가로채고 성공 응답을 반환
    cy.intercept("POST", "/auth/v1/signup", {
      statusCode: 200,
      body: {
        user: { id: "12345", email: "testuser@example.com" },
        session: { access_token: "mocked_token" },
      },
    }).as("signUpRequest");

    // 유효한 데이터 입력
    cy.get("#email").type("testuser@example.com");
    cy.get("#password").type("ValidPassword123!");
    cy.get("#confirmPassword").type("ValidPassword123!");
    cy.get("#username").type("testuser");
    cy.get("#profile_message").type("안녕하세요! 저는 테스트 사용자입니다.");

    // 폼 제출
    cy.get('button[type="submit"]').click();

    // 요청이 올바르게 전송되었는지 확인
    cy.wait("@signUpRequest")
      .its("request.body")
      .should((body) => {
        expect(body.email).to.equal("testuser@example.com");
      });

    // 성공적으로 로그인 페이지로 리다이렉트 확인
    cy.url().should("include", "/login");
  });

  it("중복된 닉네임으로 회원가입 실패 (Mocked API)", () => {
    // 닉네임 중복 체크 요청을 가로채고 실패 응답 반환
    cy.intercept("POST", "/auth/v1/signup", {
      statusCode: 200,
      body: { error: { message: "이미 사용 중인 닉네임입니다." } },
    }).as("signUpRequest");

    // 중복된 닉네임 입력
    cy.get("#email").type("anotheruser@example.com");
    cy.get("#password").type("AnotherPassword123!");
    cy.get("#confirmPassword").type("AnotherPassword123!");
    cy.get("#username").type("usertest");

    // 폼 제출
    cy.get('button[type="submit"]').click();

    // 오류 메시지 확인
    cy.contains("이미 사용 중인 닉네임입니다.").should("be.visible");
  });

  it("비밀번호 불일치로 회원가입 실패 (클라이언트 사이드 검증)", () => {
    // 비밀번호와 비밀번호 확인 불일치 입력
    cy.get("#email").type("mismatch@example.com");
    cy.get("#password").type("MismatchPassword123!");
    cy.get("#confirmPassword").type("DifferentPassword123!");
    cy.get("#username").type("mismatchuser");

    // 폼 제출
    cy.get('button[type="submit"]').click();

    // 클라이언트 측 오류 메시지 확인
    cy.contains("비밀번호가 일치하지 않습니다.").should("be.visible");
  });
});
