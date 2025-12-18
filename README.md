# Balance Service Web

이 프로젝트는 [Vite](https://vitejs.dev/)를 사용하여 부트스트랩된 React 애플리케이션입니다.

## 🚀 주요 기술 스택

- **Framework**: [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **UI Library**: [Mantine](https://mantine.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand), [TanStack Query](https://tanstack.com/query/v5)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Routing**: [React Router DOM](https://reactrouter.com/)

## 🏁 시작하기

### 1. 의존성 설치

프로젝트를 로컬에서 실행하기 전에 필요한 의존성을 설치해야 합니다.

```bash
npm install
```

### 2. 개발 서버 실행

다음 명령어를 사용하여 개발 서버를 시작합니다.

```bash
npm run start
```

애플리케이션은 `http://localhost:5173` (또는 다른 포트)에서 실행됩니다.

## 📜 사용 가능한 스크립트

- `npm run start`: 개발 모드에서 애플리케이션을 실행합니다.
- `npm run build`: 프로덕션용으로 앱을 빌드합니다.
- `npm run lint`: ESLint를 사용하여 코드 스타일을 확인하고 문제를 찾습니다.
- `npm run preview`: 프로덕션 빌드를 로컬에서 미리 봅니다.

## 📁 폴더 구조

```
/
├── public/      # 정적 에셋 (이미지, 폰트 등)
├── src/         # 소스 코드
│   ├── assets/      # 컴포넌트에서 사용하는 에셋
│   ├── components/  # 재사용 가능한 UI 컴포넌트
│   ├── constants/   # 공통 상수
│   ├── context/     # React Context
│   ├── elements/    # 페이지 구성 요소
│   ├── hooks/       # 커스텀 훅
│   ├── layout/      # 페이지 레이아웃 컴포넌트
│   ├── routes/      # 라우팅 설정
│   ├── service/     # API 호출 및 비즈니스 로직
│   ├── store/       # Zustand 스토어
│   └── utils/       # 유틸리티 함수
├── .gitignore
├── package.json
└── README.md
```
