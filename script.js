/* =========================================================
   Intro Overlay — 세션 첫 방문 시 1회 표시
========================================================= */
(function () {
  var hero = document.getElementById('hero');

  /* 재방문: 인트로 완전 스킵, 히어로 즉시 표시 */
  if (sessionStorage.getItem('rk-intro-shown')) {
    var introEl = document.getElementById('intro');
    if (introEl) introEl.classList.add('intro--done');
    requestAnimationFrame(function () {
      if (hero) hero.classList.add('is-visible');
    });
    return;
  }

  var intro    = document.getElementById('intro');
  if (!intro) return;

  var logo     = document.getElementById('intro-logo');
  var lineWrap = document.getElementById('intro-line-wrap');
  var tagline  = document.getElementById('intro-tagline');

  document.body.classList.add('intro-active');
  document.body.style.overflow = 'hidden';

  /* Phase 1 : 로고 Fade In  (0 → 800ms) */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      logo.classList.add('is-visible');
    });
  });

  /* Phase 2 : 선 애니메이션 + 태그라인  (900 → 1700ms) */
  setTimeout(function () {
    lineWrap.classList.add('is-visible');
    requestAnimationFrame(function () {
      lineWrap.classList.add('is-animated');
    });
    setTimeout(function () {
      tagline.classList.add('is-visible');
    }, 150);
  }, 900);

  /* Phase 3 : 퇴장  (2600ms~) — 충분히 읽고 나서 */
  setTimeout(function () {
    intro.classList.add('intro--exit');
    document.body.classList.remove('intro-active');
    if (hero) hero.classList.add('is-visible');
  }, 2600);

  /* 완전 숨김 (3700ms) */
  setTimeout(function () {
    intro.classList.add('intro--done');
    document.body.style.overflow = '';
    sessionStorage.setItem('rk-intro-shown', '1');
  }, 3700);
})();

(function () {
  "use strict";

  /* ---------- 헤더 스크롤 상태 ---------- */
  const header = document.getElementById("header");
  const heroSection = document.getElementById("hero");
  const storySection = document.getElementById("storySection");
  const floatingTopBtn = document.getElementById("floatingTopBtn");
  const SCROLL_THRESHOLD = 40;

  // 어두운 배경 섹션 목록 (헤더가 이 위에 있으면 → 밝은 텍스트)
  const darkSections = [heroSection, storySection];

  function onScroll() {
    const scrollY = window.scrollY;
    header.classList.toggle("is-scrolled", scrollY > SCROLL_THRESHOLD);

    if (scrollY > SCROLL_THRESHOLD) {
      const headerH = header.offsetHeight;

      // 헤더가 어두운 섹션 위에 있는지 확인
      const overDark = darkSections.some(function (sec) {
        if (!sec) return false;
        const r = sec.getBoundingClientRect();
        return r.top < headerH && r.bottom > 0;
      });

      // is-past-hero = "밝은 배경 위" → 어두운 텍스트
      header.classList.toggle("is-past-hero", !overDark);
    } else {
      header.classList.remove("is-past-hero");
    }

    // floating top button toggle (스크롤 진행률이 50%를 넘을 때 노출)
    if (floatingTopBtn) {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const threshold = scrollHeight / 2;
      if (scrollY > threshold) {
        floatingTopBtn.classList.add("is-visible");
      } else {
        floatingTopBtn.classList.remove("is-visible");
      }
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 모바일 메뉴 ---------- */
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

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

  /* 모바일 드롭다운 아코디언 토글 */
  var dropdownTriggers = nav.querySelectorAll(".nav-dropdown-trigger");
  dropdownTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function (e) {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        var parentLi = trigger.closest(".nav-item-dropdown");
        parentLi.classList.toggle("is-open");
      }
    });
  });

  nav.querySelectorAll("a:not(.nav-dropdown-trigger)").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      header.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Hero 슬라이드 (가로 무한 밀림 및 지연 로드) ---------- */
  const track = document.getElementById("heroSlides");
  const realSlides = Array.from(track.children);
  const TOTAL = realSlides.length;

  // 첫 번째 슬라이드(1번)와 마지막 슬라이드(7번, 복제되어 맨 앞에 위치)의 이미지를 즉시 로드
  const loadImmediate = [0, TOTAL - 1];
  loadImmediate.forEach(function (idx) {
    const slide = realSlides[idx];
    if (slide) {
      const media = slide.querySelector('.hero__media');
      if (media && media.dataset.src) {
        media.style.backgroundImage = 'url(' + media.dataset.src + ')';
        media.classList.add('has-image');
      }
    }
  });

  // 무한 루프용 복제: [마지막 복제, 0..n, 첫 복제]
  const firstClone = realSlides[0].cloneNode(true);
  const lastClone = realSlides[TOTAL - 1].cloneNode(true);
  firstClone.setAttribute("aria-hidden", "true");
  lastClone.setAttribute("aria-hidden", "true");
  track.appendChild(firstClone);
  track.insertBefore(lastClone, realSlides[0]);

  // 슬라이드 이미지를 필요할 때만 로드하는 함수
  function loadSlideImage(idx) {
    var allSlides = Array.from(track.children);
    var slide = allSlides[idx];
    if (!slide) return;
    var media = slide.querySelector('.hero__media');
    if (media && media.dataset.src && !media.style.backgroundImage) {
      media.style.backgroundImage = 'url(' + media.dataset.src + ')';
      media.classList.add('has-image');
    }
  }

  // 이미지가 연결된 슬라이드는 안내 라벨 자동 숨김 (복제 포함)
  document.querySelectorAll(".placeholder").forEach(function (el) {
    const bg = el.style.backgroundImage || getComputedStyle(el).backgroundImage;
    if (bg && bg !== "none") el.classList.add("has-image");
  });

  const elCurrent = document.getElementById("slideCurrent");
  const elTotal = document.getElementById("slideTotal");
  const elProgress = document.getElementById("slideProgress");
  const btnPrev = document.getElementById("slidePrev");
  const btnNext = document.getElementById("slideNext");

  const INTERVAL = 6000;   // 자동 전환 간격
  const DURATION = 1000;   // 이동 시간 (style.css .hero__slides transition과 동일)
  let pos = 1;             // 실제 첫 슬라이드 위치 (앞에 복제 1장)
  let timer = null;
  let locked = false;
  let lockFallback = null;

  const pad = (n) => String(n + 1).padStart(2, "0");

  function place(animated) {
    track.style.transition = animated
      ? "transform " + DURATION + "ms cubic-bezier(0.4, 0, 0.2, 1)"
      : "none";
    track.style.transform = "translateX(" + (-pos * 100) + "%)";
  }

  function updateIndicator() {
    const real = ((pos - 1) % TOTAL + TOTAL) % TOTAL;
    elCurrent.textContent = pad(real);

    elProgress.style.transition = "none";
    elProgress.style.width = "0%";
    void elProgress.offsetWidth;
    elProgress.style.transition = "width " + INTERVAL + "ms linear";
    elProgress.style.width = "100%";
  }

  function unlock() {
    locked = false;
    clearTimeout(lockFallback);
  }

  function go(dir) {
    if (locked) return;
    locked = true;
    pos += dir;
    place(true);
    updateIndicator();
    restart();
    loadSlideImage(pos + 1);
    loadSlideImage(pos - 1);
    // transitionend 미발동 대비 폴백 — DURATION + 150ms 후 강제 해제
    clearTimeout(lockFallback);
    lockFallback = setTimeout(function () {
      if (pos === TOTAL + 1 || pos === 0) {
        track.style.visibility = "hidden";
        if (pos === TOTAL + 1) { pos = 1; }
        if (pos === 0)         { pos = TOTAL; }
        place(false);
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            track.style.visibility = "";
            unlock();
          });
        });
      } else {
        unlock();
      }
    }, DURATION + 150);
  }

  // 복제 끝에 닿으면 애니메이션 없이 실제 위치로 점프
  // propertyName 체크로 자식 요소 transition 오발동 차단
  track.addEventListener("transitionend", function (e) {
    if (e.target !== track || e.propertyName !== "transform") return;
    clearTimeout(lockFallback);
    if (pos === TOTAL + 1 || pos === 0) {
      // 점프 전 track을 잠깐 숨겨서 플리커 제거
      track.style.visibility = "hidden";
      if (pos === TOTAL + 1) { pos = 1; }
      if (pos === 0)         { pos = TOTAL; }
      place(false);
      // 두 프레임 후 복원 (레이아웃 + 페인트 완료 보장)
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          track.style.visibility = "";
          unlock();
        });
      });
    } else {
      requestAnimationFrame(function () { unlock(); });
    }
  });

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => go(1), INTERVAL);
  }

  btnPrev.addEventListener("click", () => go(-1));
  btnNext.addEventListener("click", () => go(1));

  // --- 드래그(스와이프) 기능 추가 ---
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let dragStartTime = 0;

  function getPositionX(e) {
    return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
  }

  function dragStart(e) {
    if (locked) return;
    isDragging = true;
    startX = getPositionX(e);
    currentX = startX;
    dragStartTime = Date.now();
    track.classList.add("is-dragging");
    clearInterval(timer); // 드래그 중 자동 전환 중지
    track.style.transition = "none";
  }

  function dragMove(e) {
    if (!isDragging) return;
    const x = getPositionX(e);
    const diffX = x - startX;
    currentX = x;
    
    // 모바일 터치 시 좌우 스크롤 의도라면 브라우저 기본 세로 스크롤 방지
    if (e.type === "touchmove" && Math.abs(diffX) > 10) {
      if (e.cancelable) e.preventDefault();
    }
    
    const diffPercent = (diffX / window.innerWidth) * 100;
    track.style.transform = "translateX(" + (-pos * 100 + diffPercent) + "%)";
  }

  function dragEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove("is-dragging");

    const diffX = currentX - startX;
    const dragDuration = Date.now() - dragStartTime;

    // 15% 이상 이동했거나 짧은 시간 내 빠른 스와이프 시 슬라이드 전환
    const threshold = window.innerWidth * 0.15;
    const isFastSwipe = dragDuration < 300 && Math.abs(diffX) > 50;

    if (Math.abs(diffX) > threshold || isFastSwipe) {
      if (diffX > 0) {
        go(-1);
      } else {
        go(1);
      }
    } else {
      // 제자리 복귀
      place(true);
      restart();
    }
  }

  track.addEventListener("mousedown", dragStart);
  track.addEventListener("touchstart", dragStart, { passive: true });
  track.addEventListener("mousemove", dragMove, { passive: false });
  track.addEventListener("touchmove", dragMove, { passive: false });
  track.addEventListener("mouseup", dragEnd);
  track.addEventListener("mouseleave", dragEnd);
  track.addEventListener("touchend", dragEnd);
  // 드래그 시 이미지나 텍스트 선택 등 기본 동작 방지
  track.addEventListener("dragstart", (e) => e.preventDefault());
  // ---------------------------------

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) clearInterval(timer);
    else restart();
  });

  elTotal.textContent = pad(TOTAL - 1);
  place(false);
  updateIndicator();
  restart();
  // 페이지 유휴 시점에 나머지 히어로 이미지 백그라운드 로드 (requestIdleCallback)
  if ('requestIdleCallback' in window) {
    requestIdleCallback(function () {
      var allSlides = Array.from(track.children);
      allSlides.forEach(function (_, idx) { loadSlideImage(idx); });
    }, { timeout: 3000 });
  } else {
    setTimeout(function () {
      var allSlides = Array.from(track.children);
      allSlides.forEach(function (_, idx) { loadSlideImage(idx); });
    }, 2000);
  }

  /* ---------- Story 슬라이더 (슬롯 기반 위치 전환) ---------- */
  var storyStage    = document.getElementById('storyStage');
  var storyPrevBtn  = document.getElementById('storyPrev');
  var storyNextBtn  = document.getElementById('storyNext');

  // 이미지 목록
  var STORY_IMAGES = [
    'images/story-01-l.jpg',
    'images/story-01-m.jpg',
    'images/story-01-r.jpg'
  ];

  var IMG_TOTAL     = STORY_IMAGES.length;
  var storyIdx      = 0;          // 현재 "left" 슬롯에 보이는 이미지 인덱스
  var storyLocked   = false;

  // 슬롯 순서 (왼→오): 다음/이전 시 한 칸씩 이동
  var SLOTS = ['off-left', 'left', 'main', 'right', 'off-right'];

  // 현재 화면에 있는 래퍼 관리 (슬롯명 → DOM 요소)
  var activeWraps = {};

  // 이미지 래퍼 생성
  function createWrap(imgSrc, pos) {
    var wrap = document.createElement('div');
    wrap.className = 'story-img-wrap';
    wrap.setAttribute('data-pos', pos);
    var img = document.createElement('img');
    img.className = 'story-img';
    img.src = imgSrc;
    img.alt = '';
    wrap.appendChild(img);
    storyStage.appendChild(wrap);
    return wrap;
  }

  // 순환 인덱스
  function circIdx(i) {
    return ((i % IMG_TOTAL) + IMG_TOTAL) % IMG_TOTAL;
  }

  // 초기 배치: left, main, right
  function initStory() {
    activeWraps['left']  = createWrap(STORY_IMAGES[circIdx(storyIdx)],     'left');
    activeWraps['main']  = createWrap(STORY_IMAGES[circIdx(storyIdx + 1)], 'main');
    activeWraps['right'] = createWrap(STORY_IMAGES[circIdx(storyIdx + 2)], 'right');
  }

  // 다음 (→)
  function storyNext() {
    if (storyLocked) return;
    storyLocked = true;

    // 새 이미지를 off-right에 생성
    var newIdx = circIdx(storyIdx + 3);
    var newWrap = createWrap(STORY_IMAGES[newIdx], 'off-right');

    // 레이아웃 강제 리플로우 (off-right에서 시작 위치 잡기)
    void newWrap.offsetWidth;

    // 각 래퍼를 한 칸 왼쪽으로 이동
    if (activeWraps['left'])  activeWraps['left'].setAttribute('data-pos', 'off-left');
    if (activeWraps['main'])  activeWraps['main'].setAttribute('data-pos', 'left');
    if (activeWraps['right']) activeWraps['right'].setAttribute('data-pos', 'main');
    newWrap.setAttribute('data-pos', 'right');

    // 퇴장하는 래퍼 참조 저장
    var exitWrap = activeWraps['left'];

    // activeWraps 갱신
    activeWraps['left']  = activeWraps['main'];
    activeWraps['main']  = activeWraps['right'];
    activeWraps['right'] = newWrap;

    storyIdx = circIdx(storyIdx + 1);

    // 애니메이션 끝나면 퇴장 래퍼 제거
    setTimeout(function () {
      if (exitWrap && exitWrap.parentNode) exitWrap.parentNode.removeChild(exitWrap);
      storyLocked = false;
    }, 950);
  }

  // 이전 (←)
  function storyPrev() {
    if (storyLocked) return;
    storyLocked = true;

    // 새 이미지를 off-left에 생성
    var newIdx = circIdx(storyIdx - 1);
    var newWrap = createWrap(STORY_IMAGES[newIdx], 'off-left');

    void newWrap.offsetWidth;

    // 각 래퍼를 한 칸 오른쪽으로 이동
    if (activeWraps['right']) activeWraps['right'].setAttribute('data-pos', 'off-right');
    if (activeWraps['main'])  activeWraps['main'].setAttribute('data-pos', 'right');
    if (activeWraps['left'])  activeWraps['left'].setAttribute('data-pos', 'main');
    newWrap.setAttribute('data-pos', 'left');

    var exitWrap = activeWraps['right'];

    activeWraps['right'] = activeWraps['main'];
    activeWraps['main']  = activeWraps['left'];
    activeWraps['left']  = newWrap;

    storyIdx = circIdx(storyIdx - 1);

    setTimeout(function () {
      if (exitWrap && exitWrap.parentNode) exitWrap.parentNode.removeChild(exitWrap);
      storyLocked = false;
    }, 950);
  }

  var STORY_INTERVAL = 3000; // 3초 간격으로 자동 전환
  var storyTimer = null;

  function startStoryAutoPlay() {
    stopStoryAutoPlay();
    storyTimer = setInterval(function () {
      storyNext();
    }, STORY_INTERVAL);
  }

  function stopStoryAutoPlay() {
    if (storyTimer) {
      clearInterval(storyTimer);
      storyTimer = null;
    }
  }

  if (storyPrevBtn) {
    storyPrevBtn.addEventListener('click', function () {
      storyPrev();
      startStoryAutoPlay(); // 수동 조작 시 타이머 재설정
    });
  }
  if (storyNextBtn) {
    storyNextBtn.addEventListener('click', function () {
      storyNext();
      startStoryAutoPlay(); // 수동 조작 시 타이머 재설정
    });
  }

  // 브라우저 탭 가시성 변화 감지하여 자동 재생 조절
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      stopStoryAutoPlay();
    } else {
      startStoryAutoPlay();
    }
  });

  // 초기 자동 재생 활성화
  startStoryAutoPlay();

  /* ---------- Story 슬라이더 지연 초기화 (IntersectionObserver) ---------- */
  if (storySection && storyStage && "IntersectionObserver" in window) {
    var storyObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          initStory();
          storyObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: "0px 0px 400px 0px"
    });
    storyObserver.observe(storySection);
  } else {
    initStory();
  }

  /* ---------- 스크롤 애니메이션 및 서브 네비게이션 감지 (IntersectionObserver) ---------- */
  var collectionSections = document.querySelectorAll('.hotel-intro-section');
  var sideNav = document.getElementById('collectionSideNav');
  var sideNavItems = document.querySelectorAll('.side-nav-item');
  var currentActiveId = ''; // 활성화된 섹션 ID 캐싱용

  // 애니메이션 효과를 줄 섹션들 목록
  var revealSections = document.querySelectorAll(
    '.hotel-intro-section, .collection-title-section, .dining-section, .moments-section, .map-section'
  );

  if (revealSections.length > 0 && 'IntersectionObserver' in window) {
    // ── 1. 각 섹션 진입 시 콘텐츠 슬라이드 모션 (is-visible 추가/제거) ──
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, {
      threshold: 0.1
    });

    revealSections.forEach(function (sec) {
      sectionObserver.observe(sec);
    });

    // ── 2. 사이드 네비게이션 노출 및 활성 항목 강조 (ScrollSpy) ──
    // 모든 주요 섹션을 감시하여 해당 섹션이 화면 중앙에 들어올 때 사이드바의 노출 여부와 활성화 상태를 명확히 제어합니다.
    var allSections = document.querySelectorAll(
      '#hero, #marqueeSection, #storySection, .collection-title-section, #collectionKiwa, #collectionChoga, #collectionBukchon, #collectionLounge, .dining-section, .moments-section, .map-section, .footer'
    );

    var sideNavObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var targetId = entry.target.id || entry.target.className.split(' ')[0];
          
          if (targetId === 'collectionChoga' || targetId === 'collectionBukchon' || targetId === 'collectionLounge') {
            // 사이드 네비게이션 활성화
            if (sideNav) {
              var wasVisible = sideNav.classList.contains('is-visible');
              sideNav.classList.add('is-visible');
              
              // 처음 켜질 때 밀려 나오는 애니메이션
              if (!wasVisible) {
                sideNav.classList.remove('is-animating');
                void sideNav.offsetWidth;
                sideNav.classList.add('is-animating');
              }
            }

            if (targetId !== currentActiveId) {
              currentActiveId = targetId;
              
              // 사이드바 항목 활성화
              sideNavItems.forEach(function (item) {
                if (item.getAttribute('data-target') === targetId) {
                  item.classList.add('is-active');
                } else {
                  item.classList.remove('is-active');
                }
              });

              // 개별 한자 활성화 클래스 토글 (전체 리로드 대신 글자만 스르륵 등장)
              var charRak = sideNav ? sideNav.querySelector('.char-rak') : null;
              var charKo  = sideNav ? sideNav.querySelector('.char-ko') : null;
              var charJa  = sideNav ? sideNav.querySelector('.char-ja') : null;

              if (charRak && charKo && charJa) {
                if (targetId === 'collectionChoga') {
                  charRak.classList.add('is-active');
                  charKo.classList.remove('is-active');
                  charJa.classList.remove('is-active');
                } else if (targetId === 'collectionBukchon') {
                  charRak.classList.add('is-active');
                  charKo.classList.add('is-active');
                  charJa.classList.remove('is-active');
                } else if (targetId === 'collectionLounge') {
                  charRak.classList.add('is-active');
                  charKo.classList.add('is-active');
                  charJa.classList.add('is-active');
                }
              }
            }
          } else {
            // 그 외 컬렉션 영역이 아닌 섹션들 (Hero, Story, Dining, Moments, Map, Footer 등) 진입 시 사이드바를 완전히 숨김
            if (sideNav) {
              sideNav.classList.remove('is-visible');
              sideNav.classList.remove('is-animating');
            }
            currentActiveId = '';
          }
        }
      });
    }, {
      rootMargin: "-25% 0px -25% 0px", // 화면의 상하 25% 영역을 제외한 중앙 감지 영역 생성
      threshold: 0
    });

    allSections.forEach(function (sec) {
      if (sec) sideNavObserver.observe(sec);
    });
  } else {
    // 폴백 브라우저 대응
    revealSections.forEach(function (sec) {
      sec.classList.add('is-visible');
    });
    if (sideNav) sideNav.classList.add('is-visible');
  }

  // ── 3. 사이드바 클릭 시 해당 섹션으로 부드러운 스크롤 이동 ──
  sideNavItems.forEach(function (item) {
    var link = item.querySelector('a');
    if (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var targetId = item.getAttribute('data-target');
        var targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    }
  });

  /* ---------- 오시는 길 (지도 API 연동 및 탭 제어) ---------- */
  function initKakaoMap() {
    var mapWrapper   = document.getElementById("mapWrapper");
    var mapContainer = document.getElementById("map");

      if (!mapContainer || mapWrapper.classList.contains("map-is-loaded")) {
        return; // 이미 로딩되었거나 컨테이너가 없으면 중단
      }

      // 서울(북촌 본관) & 안동(하회 한옥 호텔) 좌표 설정
      var coords = {
        seoul: new kakao.maps.LatLng(37.5802, 126.9858),
        andong: new kakao.maps.LatLng(36.5385, 128.5147)
      };

      var mapOptions = {
        center: coords.seoul,
        level: 3
      };

      var map = new kakao.maps.Map(mapContainer, mapOptions);

      // 지점 마커 + 말풍선 생성
      function makeInfoWindow(label) {
        return new kakao.maps.InfoWindow({
          content: '<div style="padding:6px 12px;font-family:Pretendard,sans-serif;font-size:13px;font-weight:600;white-space:nowrap;">' + label + '</div>',
          removable: false
        });
      }

      var markers = {
        seoul: new kakao.maps.Marker({ position: coords.seoul, map: map, title: "락고재 서울" }),
        andong: new kakao.maps.Marker({ position: coords.andong, map: map, title: "락고재 안동" })
      };
      var infoWindows = {
        seoul: makeInfoWindow("락고재 서울 본관"),
        andong: makeInfoWindow("락고재 안동 하회")
      };
      infoWindows.seoul.open(map, markers.seoul);

      // 지도 로드가 성공하면 플레이스홀더 페이드아웃 클래스 추가
      mapWrapper.classList.add("map-is-loaded");

      var activeBranch = "seoul";
      window.updateMapBranch = function (branch) {
        if (coords[branch]) {
          // 이전 말풍선 닫기
          Object.keys(infoWindows).forEach(function(k) { infoWindows[k].close(); });
          activeBranch = branch;
          map.setLevel(branch === "andong" ? 4 : 3);
          map.panTo(coords[branch]);
          infoWindows[branch].open(map, markers[branch]);
        }
      };

      window.addEventListener("resize", function () {
        map.setCenter(coords[activeBranch]);
      });
  }


  /* ---------- 오시는 길: Kakao Maps 초기화 ---------- */
  if (typeof kakao !== 'undefined' && kakao.maps) {
    initKakaoMap();
  }

  var mapTabBtns = document.querySelectorAll('.map-tab-btn');
  mapTabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var branch = this.getAttribute('data-branch');
      mapTabBtns.forEach(function (b) { b.classList.remove('is-active'); });
      this.classList.add('is-active');
      document.querySelectorAll('.map-info-card').forEach(function (c) { c.classList.remove('is-active'); });
      var card = document.getElementById('card-' + branch);
      if (card) card.classList.add('is-active');
      if (window.updateMapBranch) window.updateMapBranch(branch);
    });
  });

  /* ---------- 푸터 기능 (탑버튼 및 자회사 이동) ---------- */

  var floatingTopBtnEl = document.getElementById("floatingTopBtn");
  if (floatingTopBtnEl) {
    floatingTopBtnEl.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  var affiliateSelect = document.getElementById("affiliateSelect");
  if (affiliateSelect) {
    affiliateSelect.addEventListener("change", function () {
      var url = this.value;
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
        this.selectedIndex = 0; // 선택 초기화
      }
    });
  }

  /* ---------- Hero 텍스트 등장 애니메이션 (IntersectionObserver) ---------- */
  if (heroSection && "IntersectionObserver" in window) {
    var heroObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          heroSection.classList.add("is-visible");
        } else {
          heroSection.classList.remove("is-visible");
        }
      });
    }, {
      threshold: 0.05
    });
    heroObserver.observe(heroSection);
  } else if (heroSection) {
    heroSection.classList.add("is-visible");
  }

  /* ---------- 이미지 레이지 로딩 (IntersectionObserver) ---------- */
  var lazyImages = document.querySelectorAll("img.lazy-img");
  if ("IntersectionObserver" in window) {
    var lazyImageObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var lazyImage = entry.target;
          if (lazyImage.dataset.src) {
            lazyImage.addEventListener("load", function onImgLoad() {
              lazyImage.classList.add("lazy-loaded");
              lazyImage.removeEventListener("load", onImgLoad);
            });
            lazyImage.src = lazyImage.dataset.src;
            if (lazyImage.complete) {
              lazyImage.classList.add("lazy-loaded");
            }
            lazyImage.classList.remove("lazy-img");
          }
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    }, {
      rootMargin: "0px 0px 400px 0px"
    });

    lazyImages.forEach(function (lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    lazyImages.forEach(function (lazyImage) {
      if (lazyImage.dataset.src) {
        lazyImage.src = lazyImage.dataset.src;
        lazyImage.classList.add("lazy-loaded");
        lazyImage.classList.remove("lazy-img");
      }
    });
  }

  /* ---------- 탑버튼 달항아리 이미지 배경 동적 제거 (Canvas 이용) ---------- */
  var jarImg = document.querySelector(".floating-top-btn__jar");
  if (jarImg) {
    var handleJarBg = function () {
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      
      // 이미지의 원래 해상도(natural size)를 기준으로 캔버스 크기 매칭
      canvas.width = jarImg.naturalWidth || jarImg.width;
      canvas.height = jarImg.naturalHeight || jarImg.height;

      if (canvas.width > 0 && canvas.height > 0) {
        ctx.drawImage(jarImg, 0, 0);
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imgData.data;

        // 모든 픽셀을 순회하며 흰색 계열의 배경(RGB > 240)을 투명하게(alpha = 0) 변환
        for (var i = 0; i < data.length; i += 4) {
          var r = data[i];
          var g = data[i + 1];
          var b = data[i + 2];
          
          if (r > 240 && g > 240 && b > 240) {
            data[i + 3] = 0; // Alpha 채널 투명화
          }
        }
        ctx.putImageData(imgData, 0, 0);
        
        // 투명 처리된 새로운 이미지 데이터를 데이터 URL로 추출하여 이미지 src로 변경
        jarImg.src = canvas.toDataURL("image/png");
      }
    };

    // 캐시 등으로 이미지가 이미 로드 완료되어 있는 경우 바로 처리, 아니면 load 이벤트 바인딩
    if (jarImg.complete) {
      handleJarBg();
    } else {
      jarImg.addEventListener("load", handleJarBg);
    }
  }

})();