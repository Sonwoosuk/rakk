(function () {
  "use strict";



  /* =========================================================
     모바일 메뉴
  ========================================================= */
  const header = document.getElementById("header");
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  if (header && navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      header.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
      if (!open) {
        nav.querySelectorAll(".nav-item-dropdown.is-open").forEach(function (el) {
          el.classList.remove("is-open");
        });
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

  /* =========================================================
     헤더 스크롤 상태 + 플로팅 탑버튼
  ========================================================= */
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

  /* =========================================================
     자회사 드롭다운
  ========================================================= */
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

  /* =========================================================
     프리미엄 어메니티 슬라이더
  ========================================================= */
  const amenityTrack  = document.getElementById("amenityTrack");
  const amenityNextBtn = document.getElementById("amenityNextBtn");
  const amenityPrevBtn = document.getElementById("amenityPrevBtn");

  if (amenityTrack && amenityNextBtn && amenityPrevBtn) {
    const slides = Array.from(amenityTrack.querySelectorAll(".amenity-slide"));
    let isReversed = false;

    function swapAmenitySlider() {
      isReversed = !isReversed;
      slides[0].classList.toggle("is-main", !isReversed);
      slides[0].classList.toggle("is-sub",  isReversed);
      slides[1].classList.toggle("is-sub",  !isReversed);
      slides[1].classList.toggle("is-main", isReversed);
      amenityNextBtn.style.display = isReversed ? "none" : "flex";
      amenityPrevBtn.style.display = isReversed ? "flex" : "none";
    }

    amenityNextBtn.addEventListener("click", swapAmenitySlider);
    amenityPrevBtn.addEventListener("click", swapAmenitySlider);
    amenityNextBtn.style.display = "flex";
    amenityPrevBtn.style.display = "none";
  }

  /* =========================================================
     다이닝 슬라이더
  ========================================================= */
  const diningTrack   = document.getElementById("diningTrack");
  const diningNextBtn = document.getElementById("diningNextBtn");
  const diningPrevBtn = document.getElementById("diningPrevBtn");

  if (diningTrack && diningNextBtn && diningPrevBtn) {
    const diningSlides = Array.from(diningTrack.querySelectorAll(".dining-slide"));
    let diningIsReversed = false;

    function swapDiningSlider() {
      diningIsReversed = !diningIsReversed;
      diningSlides[0].classList.toggle("is-main", !diningIsReversed);
      diningSlides[0].classList.toggle("is-sub",  diningIsReversed);
      diningSlides[1].classList.toggle("is-sub",  !diningIsReversed);
      diningSlides[1].classList.toggle("is-main", diningIsReversed);
      diningNextBtn.style.display = diningIsReversed ? "none" : "flex";
      diningPrevBtn.style.display = diningIsReversed ? "flex" : "none";
    }

    diningNextBtn.addEventListener("click", swapDiningSlider);
    diningPrevBtn.addEventListener("click", swapDiningSlider);
    diningNextBtn.style.display = "flex";
    diningPrevBtn.style.display = "none";
  }

  /* =========================================================
     서울 본관 객실 섹션 스크롤 스파이 & Fixed 엘리먼트 제어
  ========================================================= */
  const roomsSection  = document.getElementById("seoulRoomsSection");
  const roomsSideNav  = document.getElementById("roomsSideNav");
  const roomsBookBtn  = document.getElementById("roomsBookBtn");
  const roomItems     = document.querySelectorAll(".room-article");
  const sideNavItems  = document.querySelectorAll(".rooms-side-nav .side-nav-item");
  const hanjaBuk  = document.querySelector(".char-buk");
  const hanjaChon = document.querySelector(".char-chon");

  if (roomsSection && "IntersectionObserver" in window) {

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (roomsSideNav) {
            const wasVisible = roomsSideNav.classList.contains("is-visible");
            roomsSideNav.classList.add("is-visible");
            if (!wasVisible) {
              roomsSideNav.classList.remove("is-animating");
              void roomsSideNav.offsetWidth;
              roomsSideNav.classList.add("is-animating");
              if (hanjaBuk)  hanjaBuk.classList.add("is-active");
              if (hanjaChon) hanjaChon.classList.add("is-active");
            }
          }
          if (roomsBookBtn) roomsBookBtn.classList.add("is-visible");
        } else {
          if (roomsSideNav) {
            roomsSideNav.classList.remove("is-visible");
            roomsSideNav.classList.remove("is-animating");
          }
          if (roomsBookBtn) roomsBookBtn.classList.remove("is-visible");
        }
      });
    }, { rootMargin: "-25% 0px -25% 0px", threshold: 0 });

    sectionObserver.observe(roomsSection);

    const roomObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetId = entry.target.id;
          sideNavItems.forEach(item => {
            item.classList.toggle("is-active", item.getAttribute("data-target") === targetId);
          });
        }
      });
    }, { rootMargin: "-40% 0px -40% 0px", threshold: 0 });

    roomItems.forEach(room => roomObserver.observe(room));

    sideNavItems.forEach(item => {
      const link = item.querySelector("a");
      if (link) {
        link.addEventListener("click", e => {
          e.preventDefault();
          const targetRoom = document.getElementById(item.getAttribute("data-target"));
          if (targetRoom) targetRoom.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      }
    });
  }

  /* =========================================================
     객실 예약 바 UI (Custom Select & Flatpickr)
  ========================================================= */
  const customSelects = document.querySelectorAll(".custom-select-wrapper");
  customSelects.forEach(wrapper => {
    const trigger     = wrapper.querySelector(".custom-select-trigger");
    const textSpan    = wrapper.querySelector(".res-text");
    const options     = wrapper.querySelectorAll(".custom-option");
    const hiddenInput = wrapper.querySelector(".res-hidden-input");

    if (trigger) {
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = wrapper.classList.contains("is-open");
        document.querySelectorAll(".custom-select-wrapper").forEach(w => w.classList.remove("is-open"));
        if (!isOpen) wrapper.classList.add("is-open");
      });
    }

    options.forEach(option => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();
        if (textSpan) {
          textSpan.textContent = option.textContent;
          textSpan.style.color = '#3D4A2F';
          textSpan.style.fontWeight = '600';
        }
        if (hiddenInput) hiddenInput.value    = option.getAttribute("data-value");
        wrapper.classList.remove("is-open");
      });
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".custom-select-wrapper").forEach(w => w.classList.remove("is-open"));
  });

  if (typeof flatpickr !== "undefined") {
    flatpickr(".res-input[type='date']", {
      locale: "ko",
      minDate: "today",
      dateFormat: "Y-m-d",
      disableMobile: "true",
      onChange: function(selectedDates, dateStr, instance) {
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
     Reveal 애니메이션
  ========================================================= */
  const revealItems = document.querySelectorAll(".reveal-item");
  if ("IntersectionObserver" in window && revealItems.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealItems.forEach(item => revealObserver.observe(item));
  }

  /* =========================================================
     예약 검색 폼 제출 제어 (커스텀 팝업 창)
  ========================================================= */
  const resForm = document.querySelector(".res-bar");
  if (resForm) {
    resForm.addEventListener("submit", function (e) {
      e.preventDefault();
      
      const dateInputs = resForm.querySelectorAll(".res-input");
      const checkInDate = dateInputs[0] ? dateInputs[0].value : "";
      const checkOutDate = dateInputs[1] ? dateInputs[1].value : "";
      const guestsInput = resForm.querySelector("input[name='guests']");
      const guestsVal = guestsInput ? guestsInput.value : "";
      
      if (!checkInDate || !checkOutDate) {
        alert("체크인 및 체크아웃 날짜를 선택해주세요.");
        return;
      }
      
      if (!guestsVal) {
        alert("인원을 선택해주세요.");
        return;
      }

      showCustomModal(checkInDate, checkOutDate, guestsVal);
    });
  }

  function showCustomModal(checkIn, checkOut, guests) {
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

    modal.innerHTML = `
      <div class="rkj-modal-content">
        <img src="logo.png" class="rkj-modal-logo" alt="락고재 로고" />
        <div class="rkj-modal-hanja">樂古齋</div>
        <h3 class="rkj-modal-title">예약이 완료되었습니다</h3>
        <div class="rkj-modal-details">
          일정: <strong>${formatDate(checkIn)} ~ ${formatDate(checkOut)}</strong><br>
          인원: <strong>${guests}명</strong>
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
