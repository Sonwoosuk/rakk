(function () {
  "use strict";



  /* 헤더 스크롤 상태 */
  const header = document.getElementById("header");
  if (header) {
    window.addEventListener("scroll", function () {
      const y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 40);
      header.classList.toggle("is-past-hero", y > 40);
    }, { passive: true });
  }

  /* 네비게이션 토글 */
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  if (navToggle && nav) {
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

    nav.querySelectorAll(".nav-item-dropdown .nav-dropdown-trigger").forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        if (window.innerWidth > 1024) return;
        e.preventDefault();
        const item = trigger.closest(".nav-item-dropdown");
        const wasOpen = item.classList.contains("is-open");
        nav.querySelectorAll(".nav-item-dropdown.is-open").forEach(function (el) {
          el.classList.remove("is-open");
        });
        if (!wasOpen) item.classList.add("is-open");
      });
    });
  }

  /* 플로팅 상단 버튼 */
  const floatingTopBtn = document.getElementById("floatingTopBtn");
  if (floatingTopBtn) {
    window.addEventListener("scroll", function () {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      floatingTopBtn.classList.toggle("is-visible", scrollY > scrollHeight / 2);
    }, { passive: true });

    floatingTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* 자회사 드롭다운 */
  const affiliateSelect = document.getElementById("affiliateSelect");
  if (affiliateSelect) {
    affiliateSelect.addEventListener("change", function () {
      const url = affiliateSelect.value;
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      affiliateSelect.value = "";
    });
  }

  /* =========================================================
     Scroll Reveal (사라락 나타나며 블러 해제 어트랙션)
  ========================================================= */
  const revealItems = document.querySelectorAll('.reveal-item');
  let revealQueue = [];
  let revealTimer = null;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        revealQueue.push(entry.target);
        observer.unobserve(entry.target);
      }
    });

    // 큐에 쌓인 항목들을 순차적으로 딜레이를 주어 나타나게 함
    if (revealQueue.length > 0 && !revealTimer) {
      revealTimer = setTimeout(() => {
        // 화면의 위에서부터 아래 순서대로 애니메이션 적용
        revealQueue.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
        
        revealQueue.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('is-revealed');
          }, index * 150); // 150ms 간격으로 스르륵 나타남
        });
        
        revealQueue = [];
        revealTimer = null;
      }, 50); // 50ms 동안 모아서 한 번에 처리 (동시에 보이는 요소들)
    }
  }, {
    rootMargin: "0px 0px -15% 0px", // 화면 하단 15% 진입 시 트리거
    threshold: 0
  });

  revealItems.forEach(item => {
    revealObserver.observe(item);
  });

})();
