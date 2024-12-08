# 🐶 PETOPIA

> 반려동물을 좋아하는, 반려동물과 함께하는 모든 사람들을 위한 SNS
> 

## 📌 프로젝트 소개

📅 프로젝트 기간 : 2024.08.19 ~ 2024.09.20

![소개이미지.png](https://github.com/user-attachments/assets/18549475-e778-428d-b455-689e73cc1c3c)

🐶 귀여운 동물친구들을 자랑해보세요 !  <br/>
🐱 다른 반려인들과 소통해보세요 !<br/>

### 🧬 Database ERD

![ERD.png](https://github.com/user-attachments/assets/3ceab669-f516-44f0-9902-96caa93da534)

### 💡 주요 기능 소개

<details>
<summary>👥 [사용자] 회원 가입</summary>
<div markdown="1">
<h4>💡 서비스 이용을 위한 사용자 회원가입</h4>
<img src="https://github.com/user-attachments/assets/d80f3c95-e339-499a-af30-9a42cdf37a2f" width="80%">
</div>
</details>

<details>
<summary>🔐 [사용자] 로그인 / 로그아웃</summary>
<div markdown="1">
<h4>💡 Supabase Authentication를 사용한 로그인</h4>
<img src="https://github.com/user-attachments/assets/117a6e94-78f6-4450-afcb-4ef0cd31b513" >
<ul>
<li>1️⃣ 회원가입시 작성한 이메일, 패스워드로 로그인 </li>
<li>2️⃣ 로그인시 JWT Token 발행</li>
<li>3️⃣ 발행된 토큰과 로그인한 유저정보는 Zustand에 보관하여 인증시 사용</li>
</ul>
</div>
</details>

<details>
<summary>🪪 [사용자] 게시글 작성 , 수정</summary>
<div markdown="1">
<h4>💡 로그인 한 회원은 SNS 피드 글 작성 및 수정가능</h4>
<img src="https://github.com/user-attachments/assets/9bd80f4a-5e5e-4536-b93b-a597ce92d4d2" >
<img src="https://github.com/user-attachments/assets/86ee4984-b792-41e8-8102-f66035f4c848" >
</div>
</details>

<details>
<summary>❤️ 게시글 좋아요기능</summary>
<div markdown="1">
<h4>💡 다른사람이 올린 피드를 구경하며 좋아요 가능</h4>
<img src="https://github.com/user-attachments/assets/b0f26587-24f2-4b71-82ac-b4be6a578539" >
<ul>
<li>1️⃣ 낙관적 업데이트</li>
<p>- 사용자경험 개선을 위해 좋아요 기능에 낙관적 업데이트 적용<p>
</ul>
</div>
</details>

<details>
<summary>✍️ 게시글 댓글기능</summary>
<div markdown="1">
<h4>💡 피드를 구경하며 댓글로 소통 가능</h4>
<img src="https://github.com/user-attachments/assets/b93e55c3-9545-468d-b720-abb6e9a8d6f5" >
</div>
</details>

<details>
<summary>🛠️ 프로필 수정기능</summary>
<div markdown="1">
<h4>💡 사용자 프로필 수정기능</h4>
<img src="https://github.com/user-attachments/assets/f9cdd427-520a-4cf1-a291-a3b0d0349a87" width="80%">
<ul>
<li>1️⃣ 개인정보 수정</li>
<p>- 수정 가능 범위 : 닉네임(중복방지) , 간단소개글 <p>
</ul>
</div>
</details>

<details>
<summary>👍 팔로우 & 팔로잉기능</summary>
<div markdown="1">
<h4>💡 유저간 관계를 맺기 위한 팔로우 & 팔로잉 기능</h4>
<img src="https://github.com/user-attachments/assets/50caf4ce-1433-4bae-bfa6-e97aee1e302a" width="80%">
</div>
</details>

<details>
<summary>💬 채팅기능</summary>
<div markdown="1">
<h4>💡 관계를 맺은 사이에 가능한 실시간 채팅기능</h4>
<img src="https://github.com/user-attachments/assets/0457c4c6-a64f-4442-bb74-3110d2679c15">
</div>
</details>

### 🧑🏻‍💻 E2E 테스트 적용
<details>

<summary>🧪 회원가입 페이지 테스트 </summary>

<div markdown="1">

<h4>🎬 테스트 시나리오 </h4>

<p>초기 상태: 회원가입 페이지에 접속.</p>

<p> ● 회원가입 성공 (API Mocking)</p>

1. 이메일, 비밀번호, 비밀번호 확인, 닉네임, 프로필 메시지 입력란에 유효한 값 입력.
2. Mock API를 통해 회원가입 요청가로채기.
3. 요청이  성공 응답을 반환하면 로그인 페이지로 리다이렉트.
4. 요청의 `body` 데이터 확인: 올바른 이메일전달 여부.

<p> ● 중복된 닉네임으로 회원가입 실패 (API Mocking)</p>

1. 이메일, 비밀번호, 비밀번호 확인, 닉네임 입력란에 중복된 닉네임 입력.
2. Mock API를 통해 회원가입 요청 실패 응답 반환.
3. 응답 데이터에 포함된 에러 메시지 표시 확인: "이미 사용 중인 닉네임입니다."

<p> ● 비밀번호 불일치로 회원가입 실패 (클라이언트 검증)</p>

1. 이메일, 비밀번호, 비밀번호 확인, 닉네임 입력란에 유효한 값을 입력하되, 비밀번호와 비밀번호 확인 불일치 입력.
2. 폼 제출 시 클라이언트 검증 로직 동작.
3. 사용자에게 에러 메시지 표시: "비밀번호가 일치하지 않습니다."

<details>

<summary>테스트 코드 / 테스트 수행화면</summary>

```jsx
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

```

![회원가입테스트gif](https://github.com/user-attachments/assets/d8fc57bf-d1d7-4a80-917d-220b6ebd4660)

</details>

</ul>

</div>

</details>

<details>

<summary>🧪 로그인 페이지 테스트 </summary>

<div markdown="1">

<h4>🎬 테스트 시나리오 </h4>

<p>초기 상태: 로그인 페이지에 접속.</p>

<p> ● 정상적인 이메일과 비밀번호로 로그인 성공</p>

1. 이메일 입력란에 유효한 이메일 입력.
2. 비밀번호 입력란에 올바른 비밀번호 입력.
3. 로그인 버튼 클릭.
4. 요청이 성공하면 홈 화면으로 리다이렉트.
5. URL 확인 및 홈 화면에서 주요 요소 표시 여부 확인.

<details>

<summary>테스트 코드 / 테스트 수행화면</summary>

```jsx
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
```

![로그인테스트gif](https://github.com/user-attachments/assets/ca18dc32-20fe-46f7-82aa-7edb7936b66c)

</details>

</ul>

</div>

</details>

---

### 🧙 기술적 의사결정

- **`Supabase`** - Firebase와 비교했을 때, Firebase는 NoSQL 기반으로 실시간 데이터베이스와 간단한 데이터 구조에서는 유리하지만, Supabase는 PostgreSQL 기반으로 관계형 데이터베이스를 지원해 복잡한 데이터 관계를 효과적으로 처리할 수 있습니다. 이는 사용자와 게시물 간 관계를 설정하거나, 복잡한 데이터 쿼리를 실행해야 했던 이번 프로젝트에서 특히 중요한 요소였습니다. 또한, Supabase Realtime 기능을 활용하여 데이터 변경 사항을 실시간으로 클라이언트에 반영할 수 있었으며, 내장된 OAuth 인증 기능 덕분에 사용자 관리를 간편하고 안정적으로 구현할 수 있었습니다.
- **`tailwind CSS`** - 빠르게 UI를 구성하고, 프로젝트 디자인을 일관되게 유지할 수 있는 방법이 필요했습니다. tailwind CSS는 유틸리티 클래스 기반으로 스타일을 간편하게 적용할 수 있어 개발 속도를 크게 향상시켰습니다. 클래스 이름만으로 스타일을 정의할 수 있어 프로젝트 전반에서 디자인을 쉽게 수정하고 유지할 수 있었고, 커스터마이징이 용이해 프로젝트의 디자인 요구사항에 맞춰 빠르게 조정할 수 있었습니다.
- **`shadcn/ui`** - UI 컴포넌트를 일관되게 구현하면서 개발 속도를 높이고자 shadcn/ui를 선택했습니다. shadcn/ui는 tailwind CSS와의 높은 호환성을 자랑하며, 기본적인 UI 컴포넌트를 제공해 추가적인 스타일링 작업을 최소화할 수 있었습니다. 이를 통해 UI 디자인을 손쉽게 구성하면서도 프로젝트 전반에 일관된 스타일을 유지할 수 있었습니다.
- **`React Hook Form`** - 사용자 입력 데이터를 처리하면서 성능 최적화와 간단한 코드 구현이 요구되었습니다. React Hook Form은 비제어 컴포넌트를 기반으로 렌더링 최적화를 지원해 대규모 폼에서도 성능 저하 없이 유효성 검사를 처리할 수 있었습니다. 또한, 직관적인 API 덕분에 유지보수가 용이했습니다.
- **`Zustand`** - 프로젝트에서는 경량 상태 관리와 간결한 코드 유지보수가 중요했습니다. Redux는 기능이 강력하지만, 프로젝트의 요구사항에 비해 다소 복잡했기 때문에 Zustand를 선택했습니다. Zustand는 직관적인 API를 통해 상태를 쉽게 관리할 수 있었으며, 불필요한 리렌더링을 방지해 성능도 최적화할 수 있었습니다.

### 🔨 기술 스택

### **Frontend**

- Language : JavaScript (ES6)
- Framework : Next.js
- Server / Database : Supabase
- State Management : Zustand
- Build Tool : AWS Amplify
- Package Manager : yarn
- UI Library : Tailwind CSS

### 🧨 트러블 슈팅


<details>  

<summary>🧨 불필요한 API 호출에 따른 최적화</summary>
 
<div markdown="1">

<h4>❓문제 상황 </h4>

<p>마이페이지 - 프로필수정 기능중 닉네임 입력시 한글자씩 입력할때마다 중복체크를 수행하고 중복체크통과(중복된 닉네임이 없음)시에는 쿼리결과가 0건이라 서비스상에 문제는 없지만 api호출 오류처럼 보이는 상황이 발생</p>

<ul>

<li>원인</li>

<p>- 닉네임 입력시 연결해둔 함수에서 계속해서 중복체크(supabase database 조회) 수행</p>

<p>- 기능상에 문제는 없으나 불필요한 호출이 많아 최적화가 필요하다고 판단</p>

<li>해결 방법</li>

<p>- lodash/debounce를 사용하여 checkUsernameAvailability 함수를 디바운스 처리. 이렇게 하면 사용자가 타이핑을 멈춘 후 500ms 후에만 실제 체크가 이루어짐.</p>

<p>1. 닉네임이 3자 미만일 경우 데이터베이스 조회를 하지 않고 바로 사용 불가능으로 처리.</p>

<p>2. 현재 사용자의 닉네임과 동일한 경우 체크를 스킵.</p>

<p>3. 사용자에게 더 자세한 피드백을 제공 (닉네임 길이가 부족한 경우 등).</p>

<details>

<summary>관련 코드</summary>

<b>Before</b>
```jsx

  const checkUsernameAvailability = async () => {
    if (username === profileData.username) return;
  
    setIsChecking(true);
    const { data, error } = await supabase
      .from("user")
      .select("username")
      .eq("username", username)
      .neq("email", profileData.email)
      .single();
  
    setIsUsernameAvailable(!data);
    setIsChecking(false);
  };

```
<b>After</b>
```jsx

  const checkUsernameAvailability = useCallback(
    debounce(async (newUsername) => {
      if (newUsername === profileData.username) {
        setIsUsernameAvailable(true);
        return;
      }

      if (newUsername.length < 3) {
        setIsUsernameAvailable(false);
        return;
      }

      setIsChecking(true);
      const { data, error } = await supabase
        .from("user")
        .select("username")
        .eq("username", newUsername)
        .neq("email", profileData.email)
        .single();

      setIsUsernameAvailable(!data);
      setIsChecking(false);
    }, 500),
    [profileData.username, profileData.email]
  );

```

</details>
 
</ul>
 
</div>
 
</details>

---
