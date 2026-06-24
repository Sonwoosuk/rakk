(function () {
  "use strict";

  /* =========================================================
     1. Timeline Slider & Landmark Sync Controller
  ========================================================= */
  const viewport = document.querySelector(".timeline-slider-viewport");
  const track = document.getElementById("timelineCardsTrack");
  const cards = Array.from(track.children);
  const totalCards = cards.length;
  
  const btnPrev = document.getElementById("timelinePrevBtn");
  const btnNext = document.getElementById("timelineNextBtn");

  // 키워드 요소 매칭 맵
  const keywords = {
    andong: document.getElementById("kw-andong"),
    bukchon: document.getElementById("kw-bukchon"),
    culture: document.getElementById("kw-culture")
  };

  // 최초 로드 시 시안과 동일하게 "안동" 카드(index: 1)가 중앙에 위치하도록 함
  let currentIndex = 1;
  let isScrolling = false;

  // 카드 이동 및 뷰포트 정중앙 정렬 함수
  function updateSlider() {
    if (!track || !viewport || cards.length === 0) return;

    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
    
    // 1. 디바이스 해상도별 카드 이동 간격(Interval) 설정 (카드 높이, 마진 0이므로 높이와 동일)
    // 데스크톱: height 270px
    // 태블릿: height 240px
    // 모바일: height 200px
    let cardInterval = 270;
    if (isMobile) {
      cardInterval = 200;
    } else if (isTablet) {
      cardInterval = 240;
    }

    // 2. 동적 Padding-Top 계산: 첫 번째 카드가 뷰포트 중앙에 위치하도록 계산
    const viewportHeight = viewport.offsetHeight;
    const activeCardHeight = cards[currentIndex].offsetHeight || (isMobile ? 200 : isTablet ? 240 : 270);
    const paddingTop = (viewportHeight - activeCardHeight) / 2;
    
    track.style.paddingTop = paddingTop + "px";
    track.style.paddingBottom = paddingTop + "px"; // 균형을 위해 바텀 패딩도 추가

    // 3. 트랙 이동 오프셋 계산 (translateY)
    const offset = -currentIndex * cardInterval;
    track.style.transform = `translateY(${offset}px)`;

    // 4. 모든 카드의 활성화 상태 업데이트
    cards.forEach((card, idx) => {
      if (idx === currentIndex) {
        card.classList.add("is-active");
      } else {
        card.classList.remove("is-active");
      }
    });

    // 5. 중앙 키워드(랜드마크) 활성화 동기화
    const activeLandmark = cards[currentIndex].dataset.landmark;
    
    Object.keys(keywords).forEach((key) => {
      const kwNode = keywords[key];
      if (kwNode) {
        if (key === activeLandmark) {
          kwNode.classList.add("is-active");
        } else {
          kwNode.classList.remove("is-active");
        }
      }
    });

    // 6. 순환 슬라이더이므로 버튼 항상 활성화
    if (btnPrev) btnPrev.style.opacity = "1";
    if (btnNext) btnNext.style.opacity = "1";
  }

  // 슬라이드 이동 함수 (순환)
  function moveSlider(direction) {
    const newIndex = (currentIndex + direction + totalCards) % totalCards;
    const isWrapping = (currentIndex === 0 && direction === -1) ||
                       (currentIndex === totalCards - 1 && direction === 1);

    if (isWrapping) {
      // 끝-시작 순환 시 transition 끊어서 겹침 방지
      track.style.transition = "none";
      currentIndex = newIndex;
      updateSlider();
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          track.style.transition = "";
        });
      });
    } else {
      currentIndex = newIndex;
      updateSlider();
    }
  }

  // 마우스 휠 스냅 스크롤링
  function handleWheel(e) {
    e.preventDefault();
    if (isScrolling) return;

    isScrolling = true;
    const direction = e.deltaY > 0 ? 1 : -1;
    moveSlider(direction);

    // 휠 스크롤 연사 제어를 위한 800ms 지연
    setTimeout(() => {
      isScrolling = false;
    }, 800);
  }

  // 모바일 터치 스와이프 스냅 스크롤링
  let touchStartY = 0;
  let touchEndY = 0;

  function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > 40) {
      const direction = diff > 0 ? 1 : -1;
      moveSlider(direction);
    }
  }

  // 이벤트 바인딩
  if (viewport) {
    viewport.addEventListener("wheel", handleWheel, { passive: false });
    viewport.addEventListener("touchstart", handleTouchStart, { passive: true });
    viewport.addEventListener("touchend", handleTouchEnd, { passive: true });
  }

  if (btnPrev) btnPrev.addEventListener("click", () => moveSlider(-1));
  if (btnNext) btnNext.addEventListener("click", () => moveSlider(1));

  // 창 크기 변경 시 중앙 정렬 실시간 재보정
  window.addEventListener("resize", () => {
    updateSlider();
  });


  /* =========================================================
     2. Minimal Video Player Controller
  ========================================================= */
  const video = document.getElementById("historyVideo");
  const playPauseBtn = document.getElementById("videoPlayPauseBtn");
  const progressBar = document.getElementById("videoProgressBar");
  const progressFill = document.getElementById("videoProgressFill");

  if (video) {
    // 1. 재생/정지 토글 기능
    function togglePlay() {
      if (video.paused) {
        video.play();
        if (playPauseBtn) playPauseBtn.querySelector(".btn-text").textContent = "||";
      } else {
        video.pause();
        if (playPauseBtn) playPauseBtn.querySelector(".btn-text").textContent = "▶";
      }
    }

    if (playPauseBtn) {
      playPauseBtn.addEventListener("click", togglePlay);
    }

    // 2. 비디오 재생 진행률 바 연동
    video.addEventListener("timeupdate", () => {
      if (progressFill && video.duration) {
        const percent = (video.currentTime / video.duration) * 100;
        progressFill.style.width = percent + "%";
      }
    });

    // 3. 진행 바 클릭 시 재생 시점 이동 (Seeking)
    if (progressBar) {
      progressBar.addEventListener("click", (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;
        video.currentTime = percentage * video.duration;
      });
    }

    // 4. 자동 재생(Autoplay) 중 정지 상태 방어 대응
    video.play().then(() => {
      if (playPauseBtn) playPauseBtn.querySelector(".btn-text").textContent = "||";
    }).catch(() => {
      if (playPauseBtn) playPauseBtn.querySelector(".btn-text").textContent = "▶";
    });
  }


  /* =========================================================
     3. Initialization
  ========================================================= */
  // 기본 첫 번째 슬라이드(안동) 로드 시 자동 갱신
  setTimeout(() => {
    updateSlider();
  }, 100);


  /* =========================================================
     3-1. 모바일 전용: 키워드(북촌/안동/컬쳐) 탭 → 해당 슬라이드로 점프
  ========================================================= */
  const landmarkIndexMap = { bukchon: 0, andong: 1, culture: 2 };

  Object.entries(landmarkIndexMap).forEach(([landmark, idx]) => {
    const kwEl = keywords[landmark];
    if (!kwEl) return;
    kwEl.addEventListener("click", function () {
      if (window.innerWidth > 768) return;
      currentIndex = idx;
      updateSlider();
    });
  });





  /* =========================================================
     5. Header Scroll State + Floating Top Button + Nav Toggle
        (script.js는 index.html 전용이라 history.html에서 크래시남 — 여기서 직접 처리)
  ========================================================= */
  const header = document.getElementById("header");
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
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      floatingTopBtn.classList.toggle("is-visible", scrollY > scrollHeight / 2);
    }, { passive: true });

    floatingTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // navToggle은 script.js가 크래시 전에 이미 등록 — 중복 등록 시 toggle이 2번 실행되어 취소됨


  /* =========================================================
     5. Intersection Observer for Blur Reveal Entrance Animations
  ========================================================= */
  const revealElements = document.querySelectorAll(".reveal-element");
  
  if (revealElements.length > 0 && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // 요소가 한 번 등장하면 다시 트랜지션되지 않도록 관찰을 해제함
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null, // 브라우저 뷰포트 기준
      rootMargin: "0px 0px -12% 0px", // 화면 바닥 12% 위로 진입할 때 트리거
      threshold: 0.08 // 요소의 8%가 보이기 시작할 때 실행
    });

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  }

})();
