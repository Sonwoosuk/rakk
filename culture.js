(function () {
  "use strict";



  /* 모바일 메뉴 */
  const header    = document.getElementById("header");
  const navToggle = document.getElementById("navToggle");
  const nav       = document.getElementById("nav");

  if (header && navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      header.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
      if (!open) {
        nav.querySelectorAll(".nav-item-dropdown.is-open").forEach(el => el.classList.remove("is-open"));
      }
    });

    nav.querySelectorAll(".nav-dropdown-trigger").forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          trigger.closest(".nav-item-dropdown").classList.toggle("is-open");
        }
      });
    });

    nav.querySelectorAll("a:not(.nav-dropdown-trigger)").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        header.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "메뉴 열기");
      });
    });
  }

  /* 헤더 스크롤 + 플로팅 탑버튼 */
  const floatingTopBtn = document.getElementById("floatingTopBtn");

  if (header) {
    window.addEventListener("scroll", function () {
      const scrollY = window.scrollY;
      header.classList.toggle("is-scrolled", scrollY > 40);
      header.classList.toggle("is-past-hero", scrollY > 40);
    }, { passive: true });
  }

  if (floatingTopBtn) {
    window.addEventListener("scroll", function () {
      const scrollY   = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      floatingTopBtn.classList.toggle("is-visible", scrollY > maxScroll / 2);
    }, { passive: true });

    floatingTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* 자회사 드롭다운 */
  const affiliateSelect = document.getElementById("affiliateSelect");
  if (affiliateSelect) {
    affiliateSelect.addEventListener("change", function () {
      const url = this.value;
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
        this.selectedIndex = 0;
      }
    });
  }

  /* Reveal 애니메이션 */
  const revealItems = document.querySelectorAll(".reveal-item");
  if ("IntersectionObserver" in window && revealItems.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealItems.forEach(item => revealObserver.observe(item));
  }

  /* =========================================================
     체험 예약 바 UI 업데이트 (Custom Select & Flatpickr)
  ========================================================= */
  
  // 1. Custom Select 로직
  const customSelects = document.querySelectorAll('.custom-select-wrapper');
  customSelects.forEach(wrapper => {
    const trigger = wrapper.querySelector('.custom-select-trigger');
    const textSpan = wrapper.querySelector('.res-text');
    const options = wrapper.querySelectorAll('.custom-option');
    const hiddenInput = wrapper.querySelector('.res-hidden-input');

    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation(); // 클릭 이벤트 전파 방지
        const isOpen = wrapper.classList.contains('is-open');
        
        // 다른 열려있는 드롭다운 모두 닫기
        document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('is-open'));
        
        if (!isOpen) {
          wrapper.classList.add('is-open');
        }
      });
    }

    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = option.getAttribute('data-value');
        const text = option.textContent;

        textSpan.textContent = text;
        textSpan.style.color = '#3D4A2F';
        textSpan.style.fontWeight = '600';
        
        if (hiddenInput) {
          hiddenInput.value = value;
        }

        wrapper.classList.remove('is-open');
      });
    });
  });

  // 바깥 클릭 시 모든 드롭다운 닫기
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select-wrapper')) {
      document.querySelectorAll('.custom-select-wrapper').forEach(w => w.classList.remove('is-open'));
    }
  });

  // 2. Flatpickr 달력 연동 (체험일)
  if (typeof flatpickr !== 'undefined') {
    flatpickr(".res-input[type='date']", {
      locale: "ko",
      minDate: "today",
      dateFormat: "Y-m-d",
      disableMobile: "true",
      onChange: function(selectedDates, dateStr, instance) {
        // 달력에서 날짜를 선택하면 화면의 텍스트를 업데이트
        const textSpan = instance.element.closest('.res-item').querySelector('.res-text');
        if (textSpan) {
          textSpan.textContent = dateStr;
          textSpan.style.color = '#3D4A2F';
          textSpan.style.fontWeight = '600';
        }
      }
    });
  }

  /* =========================================================
     체험 예약 폼 제출 제어 (커스텀 팝업 창)
   ========================================================= */
  const resForm = document.querySelector(".res-bar");
  if (resForm) {
    resForm.addEventListener("submit", function (e) {
      e.preventDefault();
      
      const dateInput = resForm.querySelector(".res-input");
      const dateVal = dateInput ? dateInput.value : "";
      
      const guestsInput = resForm.querySelector("input[name='guests']");
      const guestsVal = guestsInput ? guestsInput.value : "";
      
      const programInput = resForm.querySelector("input[name='program']");
      const programVal = programInput ? programInput.value : "";
      
      if (!dateVal) {
        alert("체험 날짜를 선택해주세요.");
        return;
      }
      
      if (!guestsVal) {
        alert("인원을 선택해주세요.");
        return;
      }

      if (!programVal) {
        alert("프로그램을 선택해주세요.");
        return;
      }

      showCustomModal(dateVal, guestsVal, programVal);
    });
  }

  function showCustomModal(date, guests, program) {
    const existingModal = document.getElementById("rkjReserveModal");
    if (existingModal) existingModal.remove();

    const modal = document.createElement("div");
    modal.id = "rkjReserveModal";
    
    const style = document.createElement("style");
    style.id = "rkjReserveModalStyle";
    style.textContent = `
      #rkjReserveModal {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(43, 26, 19, 0.6);
        backdrop-filter: blur(4px);
        opacity: 0;
        transition: opacity 0.4s ease;
      }
      #rkjReserveModal.is-visible {
        opacity: 1;
      }
      .rkj-modal-content {
        background: #FFF5E6;
        border: 1px solid #B09A78;
        border-radius: 12px;
        width: 90%;
        max-width: 440px;
        padding: 40px 30px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        text-align: center;
        transform: translateY(20px) scale(0.95);
        transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
      }
      #rkjReserveModal.is-visible .rkj-modal-content {
        transform: translateY(0) scale(1);
      }
      .rkj-modal-logo {
        width: 120px;
        height: auto;
        margin: 0 auto 20px;
        display: block;
      }
      .rkj-modal-hanja {
        font-family: "Noto Serif TC", serif;
        font-size: 20px;
        color: #7B4B20;
        letter-spacing: 0.2em;
        margin-bottom: 12px;
      }
      .rkj-modal-title {
        font-family: "MaruBuri", serif;
        font-size: 22px;
        font-weight: 700;
        color: #2B1A13;
        margin-bottom: 24px;
      }
      .rkj-modal-details {
        background: #FFFBF5;
        border: 1px solid rgba(176, 154, 120, 0.2);
        border-radius: 8px;
        padding: 18px 14px;
        margin-bottom: 28px;
        font-family: "Pretendard", sans-serif;
        font-size: 15px;
        line-height: 1.7;
        color: #5A4636;
        text-align: left;
      }
      .rkj-modal-details strong {
        color: #3D4A2F;
      }
      .rkj-modal-btn {
        width: 100%;
        height: 48px;
        background: #3D4A2F;
        color: #FFFFFF;
        font-family: "Pretendard", sans-serif;
        font-size: 15px;
        font-weight: 500;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.3s ease;
      }
      .rkj-modal-btn:hover {
        background: #2E3A24;
      }
    `;
    document.head.appendChild(style);

    function formatDate(dateStr) {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        return `${parts[0]}년 ${parseInt(parts[1])}월 ${parseInt(parts[2])}일`;
      }
      return dateStr;
    }

    const programNames = {
      hanbok: "한복 체험",
      gayageum: "가야금 체험",
      tea: "우리차 수업",
      liquor: "우리 술 시음",
      gyubang: "전통 규방 클래스",
      art: "아트 프로그램"
    };
    const programName = programNames[program] || program;
    const guestsText = guests === "5" ? "5명 이상" : `${guests}명`;

    modal.innerHTML = `
      <div class="rkj-modal-content">
        <img src="logo.png" class="rkj-modal-logo" alt="락고재 로고" />
        <div class="rkj-modal-hanja">樂古齋</div>
        <h3 class="rkj-modal-title">예약이 완료되었습니다</h3>
        <div class="rkj-modal-details">
          체험 종류: <strong>${programName}</strong><br>
          체험일: <strong>${formatDate(date)}</strong><br>
          인원: <strong>${guestsText}</strong>
        </div>
        <button class="rkj-modal-btn" id="rkjModalCloseBtn">확인</button>
      </div>
    `;

    document.body.appendChild(modal);

    setTimeout(() => {
      modal.classList.add("is-visible");
    }, 10);

    const closeBtn = modal.querySelector("#rkjModalCloseBtn");
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
  }

})();
