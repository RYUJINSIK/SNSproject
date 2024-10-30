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
<ul>
<li>1️⃣ 낙관적 업데이트</li>
<p>- 사용자경험 개선을 위해 좋아요 기능에 낙관적 업데이트 적용<p>
</ul>
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

---

### 🧙 기술적 의사결정

- **`Next.js`** - Next.js는 React 기반의 프레임워크로, 서버 사이드 렌더링(SSR)과 정적 사이트 생성(SSG)을 지원하여 SEO에 유리하고 성능을 최적화할 수 있습니다. API Routes를 활용해 백엔드 서버 없이도 간단한 API를 구축할 수 있으며, 파일 기반 라우팅을 통해 구조화된 프로젝트 관리가 가능합니다. 이러한 특성 덕분에 Next.js는 빠른 렌더링과 SEO 최적화를 요구하는 프로젝트에 적합한 선택이었습니다.
- **`Supabase`** - Supabase는 오픈 소스 Firebase 대안으로, PostgreSQL을 기반으로 한 실시간 데이터베이스와 인증, 스토리지 기능을 제공합니다. 특히, Supabase Realtime 기능을 통해 데이터베이스의 변화를 클라이언트에 실시간으로 반영할 수 있어 채팅이나 알림 기능에 유리합니다. 또한, 내장된 인증 기능을 활용해 OAuth를 간편하게 구현할 수 있어 사용자 관리를 효과적으로 지원합니다.
- **`Yarn`** - Yarn은 패키지 관리 속도와 안정성에서 큰 장점이 있습니다. 설치 시 캐시를 사용해 이전에 다운로드한 패키지를 재사용하여 빠른 설치가 가능하고, `yarn.lock` 파일을 통해 의존성의 정확한 버전을 기록하여 팀 간 일관성을 유지할 수 있습니다. 이를 통해 대규모 프로젝트에서도 안정적인 빌드와 문제 해결이 가능합니다.
- **`Tailwind CSS`** - Tailwind CSS는 유틸리티 기반의 CSS 프레임워크로, 미리 정의된 클래스를 활용해 빠르게 스타일을 적용할 수 있습니다. 컴포넌트 스타일을 구성할 때도 직관적이고 재사용이 쉬워 협업 시 일관된 스타일을 유지할 수 있으며, 커스터마이징도 용이해 빠르게 원하는 UI를 구현할 수 있습니다.
- **`Shadcn UI`** - Shadcn UI는 Tailwind CSS를 기반으로 하는 UI 컴포넌트 라이브러리로, 반응형 UI 구축에 최적화되어 있어 일관성 있는 디자인을 손쉽게 구현할 수 있습니다. Tailwind CSS와의 높은 호환성 덕분에 스타일 커스터마이징이 자유롭고, 개발 생산성을 고려해 선택했습니다.
- **`React Hook Form`** - React Hook Form은 폼 데이터를 관리하고 유효성을 검사하는 데 있어 성능이 우수하며, 코드량을 줄여주고 가독성을 높여주는 라이브러리입니다. 비제어 컴포넌트를 활용해 렌더링 최적화를 돕고, 유효성 검사를 간편하게 설정할 수 있어 사용자 입력의 정확성을 보장합니다.
- **`Zustand`** - Zustand는 경량 상태 관리 라이브러리로, Redux보다 간결한 구문을 통해 상태 관리를 쉽게 구현할 수 있습니다. 불필요한 리렌더링을 방지하고 직관적인 API를 제공하여 성능에 최적화되어 있으며, 프로젝트 규모가 커져도 코드 가독성을 유지할 수 있어 선택했습니다.

### 🔨 기술 스택

### **Frontend**

- Language : JavaScript (ES6)
- Framework : Next.js
- Server / Database : Supabase
- State Management : Zustand
- Build Tool : AWS Amplify
- Package Manager : yarn
- UI Library : Tailwind CSS

---
