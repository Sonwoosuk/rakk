(function () {
  "use strict";

  // 모든 페이지 로드 시 "로그인" 텍스트를 갖는 링크를 탐색하여 이벤트를 연동합니다.
  document.addEventListener("DOMContentLoaded", () => {
    injectMobileLoginLink();
    initAuthState();
  });

  // 모바일용 로그인 링크 동적 주입 및 바인딩
  function injectMobileLoginLink() {
    const nav = document.getElementById("nav");
    if (!nav) return;
    
    // 이미 모바일 유틸이 있으면 중복 주입 방지
    if (nav.querySelector(".nav__mobile-util")) return;

    const mobileUtil = document.createElement("div");
    mobileUtil.className = "nav__mobile-util";
    mobileUtil.innerHTML = `
      <a href="#" class="mobile-util-link" id="mobileLoginBtn">로그인</a>
      <span class="mobile-util-divider">|</span>
      <a href="#" class="mobile-util-link">언어 (KR)</a>
    `;
    
    nav.appendChild(mobileUtil);

    const mobileLoginBtn = mobileUtil.querySelector("#mobileLoginBtn");
    if (mobileLoginBtn) {
      mobileLoginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        
        // 모바일 메뉴 닫기 처리 (열려있다면 닫아주기)
        const header = document.getElementById("header");
        const navToggle = document.getElementById("navToggle");
        if (nav && navToggle && header) {
          nav.classList.remove("is-open");
          navToggle.classList.remove("is-open");
          header.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
        }
        
        showLoginModal();
      });
    }
  }

  // AJAX 혹은 페이지 전환 등으로 헤더가 갱신되는 상황을 대비해 바인딩 함수 제공
  function bindLoginEvents() {
    const loginLinks = document.querySelectorAll(".util__link");
    loginLinks.forEach(link => {
      if (link.textContent.trim() === "로그인") {
        link.onclick = (e) => {
          e.preventDefault();
          showLoginModal();
        };
      }
    });
  }

  function showLoginModal() {
    const existingModal = document.getElementById("rkjLoginModal");
    if (existingModal) existingModal.remove();

    const modal = document.createElement("div");
    modal.id = "rkjLoginModal";

    const style = document.createElement("style");
    style.id = "rkjLoginModalStyle";
    style.textContent = `
      #rkjLoginModal {
        font-family: var(--font-body);
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(43, 26, 19, 0.6);
        backdrop-filter: blur(4px);
        opacity: 0;
        transition: opacity 0.4s ease;
      }
      #rkjLoginModal.is-visible {
        opacity: 1;
      }
      .rkj-login-container {
        display: flex;
        width: 90%;
        max-width: 900px;
        height: 550px;
        background: #FFFFFF;
        border-radius: 16px;
        overflow: hidden;
        position: relative;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
        transform: translateY(20px) scale(0.95);
        transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
      }
      #rkjLoginModal.is-visible .rkj-login-container {
        transform: translateY(0) scale(1);
      }
      .rkj-login-close {
        position: absolute;
        top: 20px;
        right: 20px;
        background: transparent;
        border: none;
        color: #E2DDD5;
        cursor: pointer;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
        transition: color 0.3s, transform 0.2s;
      }
      .rkj-login-close:hover {
        color: #FFFFFF;
        transform: scale(1.1);
      }
      .rkj-login-left {
        flex: 1;
        background: #4E5A3E;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        text-align: center;
        color: #FFFFFF;
      }
      .rkj-login-logo {
        width: 180px;
        height: auto;
        margin-bottom: 30px;
        filter: brightness(0) invert(1) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.25));
        opacity: 0;
        transform: translateY(15px);
        transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1),
                    transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      #rkjLoginModal.is-visible .rkj-login-logo {
        opacity: 1;
        transform: translateY(0);
        transition-delay: 0.1s;
      }
      .rkj-login-slogan {
        font-family: var(--font-body);
        font-size: 16px;
        line-height: 2.0;
        color: #E2DDD5;
        font-weight: 300;
      }
      .slogan-line {
        display: block;
        opacity: 0;
        filter: blur(10px);
        transform: translateY(15px);
        transition: opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1),
                    filter 1.4s cubic-bezier(0.16, 1, 0.3, 1),
                    transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
      #rkjLoginModal.is-visible .slogan-line.line-1 {
        opacity: 1;
        filter: blur(0);
        transform: translateY(0);
        transition-delay: 0.4s;
      }
      #rkjLoginModal.is-visible .slogan-line.line-2 {
        opacity: 1;
        filter: blur(0);
        transform: translateY(0);
        transition-delay: 0.8s;
      }
      .rkj-login-right {
        flex: 1;
        position: relative;
        background-image: url('images/login.01.jpg');
        background-size: cover;
        background-position: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 40px;
      }
      .rkj-login-right::before {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(43, 26, 19, 0.75);
        z-index: 1;
      }
      .rkj-login-right > * {
        position: relative;
        z-index: 2;
      }
      .rkj-login-title {
        font-family: var(--font-heading);
        font-size: 26px;
        font-weight: 500;
        color: #FFFFFF;
        margin-bottom: 30px;
        letter-spacing: 0.1em;
      }
      .rkj-login-form {
        width: 100%;
        max-width: 280px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .rkj-input-group {
        width: 100%;
        margin-bottom: 12px;
      }
      .rkj-login-input {
        width: 100%;
        height: 46px;
        border: 1px solid #B09A78;
        background: rgba(255, 251, 245, 0.9);
        border-radius: 23px;
        padding: 0 20px;
        font-size: 14px;
        color: #2B1A13;
        outline: none;
        box-sizing: border-box;
        transition: border-color 0.3s, background-color 0.3s;
      }
      .rkj-login-input:focus {
        border-color: #FFFFFF;
        background-color: #FFFFFF;
      }
      .rkj-login-submit {
        width: 100%;
        height: 46px;
        background: #B09A78;
        color: #FFFFFF;
        border: none;
        border-radius: 23px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.1s;
        margin-top: 10px;
        letter-spacing: 0.05em;
      }
      .rkj-login-submit:hover {
        background-color: #968160;
      }
      .rkj-login-submit:active {
        transform: scale(0.98);
      }
      .rkj-login-links {
        margin-top: 22px;
        font-size: 13px;
        color: #C8C2B8;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .rkj-login-links a {
        color: #C8C2B8;
        text-decoration: none;
        transition: color 0.3s;
      }
      .rkj-login-links a:hover {
        color: #FFFFFF;
      }
      .rkj-link-divider {
        color: #7A6953;
        font-size: 10px;
      }
      .rkj-social-login {
        margin-top: 35px;
        text-align: center;
        width: 100%;
        max-width: 280px;
      }
      .rkj-social-title {
        font-size: 12px;
        color: #B09A78;
        letter-spacing: 0.1em;
        margin-bottom: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }
      .rkj-social-title::before,
      .rkj-social-title::after {
        content: '';
        flex: 1;
        height: 1px;
        background: rgba(176, 154, 120, 0.3);
      }
      .rkj-social-buttons {
        display: flex;
        justify-content: center;
        gap: 18px;
      }
      .social-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0;
        transition: transform 0.2s, filter 0.2s;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
      }
      .social-btn:hover {
        transform: translateY(-2px);
        filter: brightness(1.05);
      }
      .social-btn.google {
        background: #FFFFFF url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="%234285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="%2334A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="%23FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="%23EA4335"/></svg>') no-repeat center;
        background-size: 20px;
      }
      .social-btn.kakao {
        background: #FEE500 url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg"><path d="M12 3c-5.52 0-10 3.48-10 7.78 0 2.76 1.83 5.18 4.6 6.51-.19.69-.69 2.51-.79 2.89-.13.48.17.47.36.35.15-.09 2.37-1.61 3.32-2.26 1.25.32 2.56.5 3.89.5 5.52 0 10-3.48 10-7.78s-4.48-7.78-10-7.78z" fill="%233C1E1E"/></svg>') no-repeat center;
        background-size: 22px;
      }
      .social-btn.naver {
        background: #03C75A url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M16.17 12.01L7.54 3H2v18h5.83v-9.01l8.63 9.01H22V3h-5.83v9.01z" fill="%23FFFFFF"/></svg>') no-repeat center;
        background-size: 16px;
      }

      @media (max-width: 900px) {
        .rkj-login-container {
          flex-direction: column;
          height: auto;
          max-width: 380px;
          width: 95%;
        }
        .rkj-login-left {
          padding: 35px 20px;
        }
        .rkj-login-logo {
          width: 140px;
          margin-bottom: 20px;
        }
        .rkj-login-slogan {
          font-size: 14px;
        }
        .rkj-login-right {
          padding: 40px 20px;
        }
        .rkj-login-title {
          font-size: 22px;
          margin-bottom: 20px;
        }
        .rkj-login-close {
          color: #E2DDD5;
        }
      }
    `;
    document.head.appendChild(style);

    modal.innerHTML = `
      <div class="rkj-login-container">
        <button class="rkj-login-close" id="rkjLoginCloseBtn" aria-label="닫기">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div class="rkj-login-left">
          <img src="logo.png" class="rkj-login-logo" alt="락고재 로고" />
          <p class="rkj-login-slogan">
            <span class="slogan-line line-1">전통의 품격과 현대의 안락함이 조화로운 공간,</span>
            <span class="slogan-line line-2">락고재에서의 시간을 다시 만나보세요.</span>
          </p>
        </div>
        <div class="rkj-login-right">
          <h3 class="rkj-login-title">로그인</h3>
          <form class="rkj-login-form" id="rkjLoginForm">
            <div class="rkj-input-group">
              <input type="email" placeholder="이메일 주소" class="rkj-login-input" required />
            </div>
            <div class="rkj-input-group">
              <input type="password" placeholder="비밀번호" class="rkj-login-input" required />
            </div>
            <button type="submit" class="rkj-login-submit">로그인</button>
          </form>
          
          <div class="rkj-login-links">
            <a href="#" id="rkjRegisterLink">회원가입</a>
            <span class="rkj-link-divider">|</span>
            <a href="#">비밀번호 찾기</a>
          </div>

          <div class="rkj-social-login">
            <div class="rkj-social-title">간편 로그인</div>
            <div class="rkj-social-buttons">
              <button class="social-btn google" aria-label="구글 로그인">Google</button>
              <button class="social-btn kakao" aria-label="카카오 로그인">Kakao</button>
              <button class="social-btn naver" aria-label="네이버 로그인">Naver</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // 트랜지션을 위한 클래스 부여
    setTimeout(() => {
      modal.classList.add("is-visible");
    }, 10);

    // 이벤트 핸들러 바인딩
    const closeBtn = modal.querySelector("#rkjLoginCloseBtn");
    function closeModal() {
      modal.classList.remove("is-visible");
      setTimeout(() => {
        modal.remove();
        style.remove();
      }, 400);
    }

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    const form = modal.querySelector("#rkjLoginForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("로그인 API 연동이 준비 중입니다.");
      closeModal();
    });

    // 회원가입 링크 클릭 시 안내
    const registerLink = modal.querySelector("#rkjRegisterLink");
    if (registerLink) {
      registerLink.addEventListener("click", (e) => {
        e.preventDefault();
        alert("회원가입 서비스가 준비 중입니다.");
      });
    }

    // Google 로그인 (Firebase)
    const googleBtn = modal.querySelector(".social-btn.google");
    if (googleBtn) {
      googleBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        if (!window.rkjAuth) {
          alert("Firebase 설정이 필요합니다.\nfirebase-config.js에서 프로젝트 정보를 입력해 주세요.");
          return;
        }
        try {
          const provider = new firebase.auth.GoogleAuthProvider();
          await window.rkjAuth.signInWithPopup(provider);
          closeModal();
        } catch (err) {
          if (err.code !== "auth/popup-closed-by-user") {
            alert("구글 로그인 오류: " + err.message);
          }
        }
      });
    }

    // 카카오 / 네이버 (준비 중)
    modal.querySelectorAll(".social-btn.kakao, .social-btn.naver").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        alert(btn.getAttribute("aria-label") + " 연동이 준비 중입니다.");
      });
    });
  }

  // Firebase 인증 상태 관리
  function initAuthState() {
    if (!window.rkjAuth) {
      bindLoginEvents();
      return;
    }
    let loginBound = false;
    window.rkjAuth.onAuthStateChanged((user) => {
      if (user) {
        // 로그인 상태
        const name = (user.displayName || "회원").split(" ")[0] + "님";
        document.querySelectorAll(".util__link").forEach(link => {
          if (link.textContent.trim() === "로그인" || link.dataset.rkjLogin === "true") {
            link.dataset.rkjLogin = "true";
            link.textContent = name;
            link.onclick = (e) => {
              e.preventDefault();
              if (window.openMypageModal) window.openMypageModal(user);
            };
          }
        });
        const mobileBtn = document.getElementById("mobileLoginBtn");
        if (mobileBtn) {
          mobileBtn.textContent = "마이페이지";
          mobileBtn.onclick = (e) => {
            e.preventDefault();
            if (window.openMypageModal) window.openMypageModal(user);
          };
        }
      } else {
        // 로그아웃 상태
        document.querySelectorAll(".util__link").forEach(link => {
          if (link.dataset.rkjLogin === "true") {
            link.textContent = "로그인";
            link.dataset.rkjLogin = "";
            link.onclick = null;
          }
        });
        const mobileBtn = document.getElementById("mobileLoginBtn");
        if (mobileBtn) {
          mobileBtn.textContent = "로그인";
          mobileBtn.onclick = null;
        }
        if (!loginBound) {
          loginBound = true;
          bindLoginEvents();
        }
      }
    });
  }

  // 외부 전역 변수로 노출하여 인라인 스크립트 등에서도 강제 트리거 가능하게 함
  window.showRakkojaeLoginModal = showLoginModal;

})();
