# 락고재 한옥 스테이

락고재의 공식 웹사이트 소스코드입니다.  
빌드 도구 없이 HTML / CSS / Vanilla JS로 만든 정적 사이트이며, GitHub Pages로 배포합니다.

**→ [sonwoosuk.github.io/rrak](https://sonwoosuk.github.io/rrak)**

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

## 사용 기술

- Firebase Authentication — Google 로그인
- Firebase Firestore — 예약 내역 저장
- Kakao Maps JavaScript API — 지점 위치 지도
- Pretendard, Cormorant Garamond (CDN, 비렌더블로킹 로드)

---

## 로컬에서 열기

별도 설치 없이 `index.html`을 브라우저에서 바로 열면 됩니다.  
VS Code Live Server 확장을 쓰면 편합니다.

Firebase 기능(로그인, 예약)은 `firebase-config.js`에 본인 프로젝트 설정을 넣어야 동작합니다.
