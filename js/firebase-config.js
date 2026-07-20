// ============================================================
//  Firebase 설정
//  아래 값을 Firebase 콘솔(console.firebase.google.com)에서
//  복사한 내 프로젝트 설정으로 교체해 주세요.
//
//  순서:
//  1. console.firebase.google.com → 프로젝트 만들기
//  2. Authentication → 로그인 방법 → Google 사용 설정
//  3. 프로젝트 설정(⚙) → 내 앱 → 웹 앱 추가 → 아래 config 복사
//  4. Authentication → Settings → 승인된 도메인에 내 도메인 추가
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyCJng-cLp8Ve2zaq-u6uIKz9WN-NQo2AW0",
  authDomain: "rakk-5d603.firebaseapp.com",
  projectId: "rakk-5d603",
  storageBucket: "rakk-5d603.firebasestorage.app",
  messagingSenderId: "505278969229",
  appId: "1:505278969229:web:c49e796a3e2b983906f9c4"
};

firebase.initializeApp(firebaseConfig);
window.rkjAuth = firebase.auth();
if (typeof firebase.firestore === 'function') {
  window.rkjDb = firebase.firestore();
}
