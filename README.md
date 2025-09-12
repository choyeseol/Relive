# 독후감 - Relive

간편하게 독후감을 작성하고 관리할 수 있는 Ionic + PWA 웹앱입니다.

## 🚀 기능

- 독후감 작성 및 편집
- 5점 평점 시스템
- 태그 시스템
- 검색 기능
- 로컬 스토리지 저장
- 독후감 통계

## 🛠️ 기술 스택

- **Frontend**: Vue 3 + Ionic Vue
- **PWA**: Service Worker + Web App Manifest
- **빌드 도구**: Vite
- **배포**: Vercel

## 📦 설치 및 실행

### 개발 환경

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 미리보기
npm run preview
```

### PWA 테스트

1. 개발 서버 실행 후 브라우저에서 접속
2. 모바일 기기나 개발자 도구의 모바일 뷰 사용
3. "앱으로 설치하기" 버튼 클릭하여 PWA 설치 테스트

## 📱 PWA 설치

이 앱은 PWA(Progressive Web App)로 제작되어 모바일에서 네이티브 앱처럼 사용할 수 있습니다.

### 설치 방법

1. 모바일 브라우저에서 앱 접속
2. "앱으로 설치하기" 버튼 클릭
3. 브라우저 설치 프롬프트에서 "설치" 선택
4. 홈 화면에 앱 아이콘 생성 완료

### PWA 요구사항

- HTTPS 연결 (로컬 개발 시 localhost 허용)
- Service Worker 등록
- Web App Manifest 설정
- beforeinstallprompt 이벤트 지원

## 🏗️ 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── InstallPrompt.vue
│   └── BookReviewCard.vue
├── pages/              # 페이지 컴포넌트
│   ├── HomePage.vue
│   ├── AddReviewPage.vue
│   └── ReviewDetailPage.vue
├── stores/             # 상태 관리
│   └── bookReviewStore.ts
├── services/           # API 및 외부 서비스
│   └── storageService.ts
├── types/              # TypeScript 타입 정의
│   └── bookReview.ts
├── utils/              # 유틸리티 함수
│   └── dateUtils.ts
├── composables/        # Vue 컴포저블
│   └── usePWA.ts
└── assets/             # 정적 자산
```