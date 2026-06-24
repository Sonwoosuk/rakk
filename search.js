(function () {
  "use strict";

  // 검색 데이터 리스트
  var SEARCH_DATA = [
    {
      title: "락고재 하회 한옥 호텔 - 기와 본관",
      desc: "유네스코 세계문화유산 안동 하회마을에 위치한 고즈넉한 기와 한옥 호텔",
      url: "kiwa.html",
      keywords: ["안동", "하회마을", "기와", "본관", "호텔", "숙소", "andong", "kiwa"]
    },
    {
      title: "락고재 하회 한옥 호텔 - 초가 별관",
      desc: "초가집의 정겨움과 현대적인 편안함이 어우러진 프라이빗 별관",
      url: "choga.html",
      keywords: ["안동", "하회마을", "초가", "별관", "호텔", "숙소", "choga"]
    },
    {
      title: "락고재 서울 본관",
      desc: "서울 북촌 한옥마을의 전통 명가, 130년 역사의 정취를 품은 한옥 스테이",
      url: "seoul.html",
      keywords: ["서울", "북촌", "본관", "한옥마을", "가회동", "seoul"]
    },
    {
      title: "북촌빈관 by 락고재",
      desc: "북촌 한옥마을의 절경을 감상할 수 있는 명상과 쉼의 공간",
      url: "bukchon.html",
      keywords: ["북촌빈관", "서울", "북촌", "한옥마을", "명상", "bukchon"]
    },
    {
      title: "락고재 컬쳐 라운지",
      desc: "한국 전통 미학과 차, 공예, 풍류를 즐기는 한옥 문화 복합 공간",
      url: "culture.html",
      keywords: ["컬쳐", "라운지", "문화", "차", "공예", "예술", "culture", "lounge"]
    },
    {
      title: "락고재 100년 (브랜드 히스토리)",
      desc: "옛것을 누리는 맑고 편안한 마음, 락고재 브랜드의 역사 이야기",
      url: "history.html",
      keywords: ["역사", "100년", "스토리", "브랜드", "히스토리", "history", "story"]
    },
    {
      title: "머무름을 위한 배려 (투숙객 서비스)",
      desc: "락고재 한옥 호텔의 투숙객을 위한 정성어린 웰니스와 브랙퍼스트 서비스",
      url: "service.html",
      keywords: ["서비스", "웰니스", "조식", "배려", "식사", "머무름", "service"]
    },
    {
      title: "락고재 파인 다이닝",
      desc: "한옥의 고즈넉한 정취 속에서 한국 고유의 맛과 풍류를 즐기는 파인 다이닝",
      url: "dining.html",
      keywords: ["다이닝", "식사", "음식", "요리", "코스", "파인다이닝", "dining"]
    },
    {
      title: "락고재 문화재단",
      desc: "한국 전통 한옥의 보존 and 무형문화재 전승을 위한 락고재의 노력",
      url: "index.html#marqueeSection",
      keywords: ["재단", "문화재단", "보존", "무형문화재", "foundation"]
    }
  ];

  // 검색 힌트 맵핑
  var SUGGESTIONS = {
    "락고": "락고재 한옥스테이는 어떠신지요?",
    "한옥": "한옥스테이 예약을 원하시나요?",
    "안동": "안동 하회마을 기와본관/초가별관으로 가보세요",
    "북촌": "북촌빈관 by 락고재에서 쉬어가세요",
    "서울": "서울 본관에서 전통 정취를 느껴보세요",
    "초가": "초가 별관의 정겨움을 경험해보세요",
    "다도": "다도 체험과 우리차 수업은 어떠신지요?",
    "전통": "전통주 시음과 규방 공예를 즐겨보세요",
    "역사": "역사 깊은 락고재 100년 브랜드 스토리를 만나보세요",
    "체험": "체험 예약을 통해 우리 차와 전통주를 배워보세요",
    "다이닝": "락고재 파인 다이닝 예약을 원하시나요?",
    "식사": "한옥에서의 품격 있는 식사를 즐겨보세요"
  };

  var searchBar    = document.getElementById("headerSearchBar");
  var searchInput  = document.getElementById("headerSearchInput");
  var searchClose  = document.getElementById("headerSearchClose");
  var searchBtn    = document.querySelector(".util__search");
  var searchHint   = document.getElementById("headerSearchHint");
  var resultsContainer = null;

  if (searchBar) {
    resultsContainer = document.createElement("div");
    resultsContainer.className = "header-search-results";
    resultsContainer.id = "headerSearchResults";
    searchBar.appendChild(resultsContainer);
  }

  function openSearch() {
    if (!searchBar) return;
    searchBar.classList.add("is-open");
    searchBar.setAttribute("aria-hidden", "false");
    var headerEl = document.getElementById("header");
    if (headerEl) headerEl.classList.add("search-is-open");
    if (searchInput) {
      setTimeout(function () { searchInput.focus(); }, 420);
    }
  }

  function closeSearch() {
    if (!searchBar) return;
    searchBar.classList.remove("is-open");
    searchBar.setAttribute("aria-hidden", "true");
    var headerEl = document.getElementById("header");
    if (headerEl) headerEl.classList.remove("search-is-open");
    if (searchInput) searchInput.value = "";
    if (searchHint) searchHint.textContent = "";
    if (resultsContainer) {
      resultsContainer.classList.remove("is-active");
      resultsContainer.innerHTML = "";
    }
  }

  if (searchBtn)   searchBtn.addEventListener("click", openSearch);
  if (searchClose) searchClose.addEventListener("click", closeSearch);

  document.addEventListener("click", function (e) {
    var headerEl = document.getElementById("header");
    if (!headerEl) return;
    if (e.target.closest(".util__search")) {
      headerEl.classList.add("search-is-open");
    }
    if (e.target.closest("#headerSearchClose")) {
      headerEl.classList.remove("search-is-open");
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var headerEl = document.getElementById("header");
      if (headerEl) headerEl.classList.remove("search-is-open");
      if (searchBar && searchBar.classList.contains("is-open")) {
        closeSearch();
      }
    }
  });

  if (searchInput && resultsContainer) {
    searchInput.addEventListener("input", function () {
      var query = searchInput.value.trim().toLowerCase();
      
      // 힌트 찾기 및 표시
      var hintText = "";
      if (query.length >= 1) {
        var suggestion = Object.values(SUGGESTIONS).find(function (val) {
          return val.toLowerCase().startsWith(query);
        });
        if (suggestion) {
          // 사용자가 입력한 내용을 그대로 앞에 두고 뒷부분만 자동완성 텍스트에서 떼어와 덧붙임
          hintText = searchInput.value + suggestion.substring(query.length);
        }
      }
      if (searchHint) {
        searchHint.textContent = hintText;
      }

      if (!query) {
        resultsContainer.classList.remove("is-active");
        resultsContainer.innerHTML = "";
        return;
      }

      var matches = SEARCH_DATA.filter(function (item) {
        var inTitle = item.title.toLowerCase().indexOf(query) !== -1;
        var inDesc = item.desc.toLowerCase().indexOf(query) !== -1;
        var inKeywords = item.keywords.some(function (kw) {
          return kw.toLowerCase().indexOf(query) !== -1;
        });
        return inTitle || inDesc || inKeywords;
      });

      if (matches.length > 0) {
        var html = "";
        matches.forEach(function (item) {
          html += '<div class="search-result-item">' +
                  '  <a href="' + item.url + '">' +
                  '    <span class="search-result-title">' + item.title + '</span>' +
                  '    <span class="search-result-desc">' + item.desc + '</span>' +
                  '  </a>' +
                  '</div>';
        });
        resultsContainer.innerHTML = html;
        resultsContainer.classList.add("is-active");
      } else {
        resultsContainer.innerHTML = '<div class="search-no-result">검색 결과가 없습니다.</div>';
        resultsContainer.classList.add("is-active");
      }
    });

    // Tab 또는 ArrowRight 키 누를 때 힌트 텍스트 자동 완성 제어
    searchInput.addEventListener("keydown", function (e) {
      var query = searchInput.value.trim().toLowerCase();
      if (query.length >= 1 && searchHint && searchHint.textContent) {
        if (e.key === "Tab" || e.key === "ArrowRight") {
          // 커서가 텍스트 맨 끝에 위치해 있을 때 자동완성 처리
          if (searchInput.selectionStart === searchInput.value.length) {
            e.preventDefault();
            searchInput.value = searchHint.textContent;
            searchHint.textContent = "";
            // 인풋 값 변경에 따른 실시간 결과 업데이트
            searchInput.dispatchEvent(new Event("input"));
          }
        }
      }
    });
  }

})();
