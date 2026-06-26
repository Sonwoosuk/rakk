# 락고재 한옥 스테이

락고재의 공식 웹사이트 소스코드입니다.  
빌드 도구 없이 HTML / CSS / Vanilla JS로 만든 정적 사이트이며, GitHub Pages로 배포합니다.

**과거와 현대의 조화를 표현한 락고재 리뉴얼 사이트→ [sonwoosuk.github.io/rrak](https://sonwoosuk.github.io/rrak)**

---

## 구성

메인 홈(`index.html`)을 포함해 총 9개 페이지로 이루어져 있습니다.

- `history.html` — 락고재 100년
- `kiwa.html` — 기와본관
- `choga.html` — 초가별관
- `seoul.html` — 락고재 서울 본관
- `bukchon.html` — 북촌빈관 by 락고재
- `service.html` — 머무름을 위한 배려
- `culture.html` — 컬쳐 라운지
- `dining.html` — 한식 다이닝

각 페이지는 같은 이름의 `.css` / `.js` 파일과 쌍을 이룹니다.

---

## 주요 기능

- 첫 방문 시 브랜드 인트로 애니메이션 (재방문 시 자동 스킵)
- 히어로 이미지 자동 슬라이드
- 헤더 키워드 검색
- Google 로그인 및 마이페이지
- Firebase Firestore 기반 예약 저장
- 카카오맵 지점 위치 안내
- 언어 전환 (한/영)

---

## 파일 구조

```
rrak/
├── index.html            메인 홈
├── history.html          락고재 100년
├── kiwa.html             기와본관
├── choga.html            초가별관
├── seoul.html            서울 본관
├── bukchon.html          북촌빈관
├── service.html          머무름을 위한 배려
├── culture.html          컬쳐 라운지
├── dining.html           한식 다이닝
│
├── style.css             전역 스타일
├── root.css              CSS 변수 (컬러·타이포)
├── reservation.css       예약 UI 스타일
├── [page].css            페이지별 스타일
│
├── script.js             공통 스크립트
├── firebase-config.js    Firebase 초기화
├── kakao-maps.js         카카오맵
├── login.js              인증·로그인
├── mypage.js             마이페이지
├── booking-save.js       예약 저장
├── search.js             검색
├── translate.js          언어 전환
├── [page].js             페이지별 스크립트
│
└── images/               이미지 에셋
```

---

## 사용 기술

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FF6F00?style=flat-square&logo=firebase&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=flat-square&logo=github&logoColor=white)

- Firebase Authentication — Google 로그인
- Firebase Firestore — 예약 내역 저장
- Kakao Maps JavaScript API — 지점 위치 지도

---

## 로컬에서 열기

별도 설치 없이 `index.html`을 브라우저에서 바로 열면 됩니다.  
VS Code Live Server 확장을 쓰면 편합니다.
