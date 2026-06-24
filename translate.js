/* =========================================================
   Google 번역 위젯 연동 (한 / 영 / 일 / 중)
   - 헤더의 "언어" 버튼(.util__lang)을 누르면 언어 메뉴가 뜨고,
     선택한 언어로 페이지 전체가 번역됩니다.
   - 원문 언어는 한국어(ko)
   ========================================================= */
(function () {
  "use strict";

  var PAGE_LANG = "ko";
  var LANGS = [
    { code: "ko",    label: "한국어" },
    { code: "en",    label: "English" },
    { code: "ja",    label: "日本語" },
    { code: "zh-CN", label: "中文" }
  ];

  /* ---- 한자(장식용)는 번역 제외 ---- */
  function markNoTranslate() {
    // class 이름에 "hanja" 가 들어간 요소는 모두 원문(한자) 유지
    document.querySelectorAll('[class*="hanja"]').forEach(function (el) {
      el.setAttribute("translate", "no");
      el.classList.add("notranslate");
    });
  }

  /* ---- Google 번역 위젯 로드 ---- */
  function injectGoogleTranslate() {
    if (document.getElementById("google_translate_element")) return;

    var holder = document.createElement("div");
    holder.id = "google_translate_element";
    holder.style.display = "none";
    document.body.appendChild(holder);

    window.googleTranslateElementInit = function () {
      /* eslint-disable no-undef */
      new google.translate.TranslateElement(
        {
          pageLanguage: PAGE_LANG,
          includedLanguages: "en,ja,zh-CN",
          autoDisplay: false
        },
        "google_translate_element"
      );
    };

    var s = document.createElement("script");
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(s);
  }

  /* ---- 번역용 쿠키 제어 ---- */
  function cookieDomains() {
    var host = location.hostname;
    // file://, localhost 등에서는 host 가 비어 있거나 도메인 설정이 막히므로 path-only 도 함께 기록
    return ["", host, "." + host];
  }

  function setLang(code) {
    var domains = cookieDomains();
    if (code === PAGE_LANG) {
      // 원문(한국어)로 복귀 → 쿠키 삭제
      domains.forEach(function (d) {
        var c = "googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        if (d) c += ";domain=" + d;
        document.cookie = c;
      });
    } else {
      var pair = "/" + PAGE_LANG + "/" + code;
      domains.forEach(function (d) {
        var c = "googtrans=" + pair + ";path=/";
        if (d) c += ";domain=" + d;
        document.cookie = c;
      });
    }
    location.reload();
  }

  function currentLang() {
    var m = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
    return m ? decodeURIComponent(m[1]) : PAGE_LANG;
  }

  /* ---- 구글 기본 배너/UI 숨김 ---- */
  function injectStyle() {
    if (document.getElementById("rkjTranslateStyle")) return;
    var css = [
      /* 구글 상단 배너 (클래스 버전이 여러 가지라 모두 차단) */
      ".goog-te-banner-frame,.goog-te-banner-frame.skiptranslate{display:none!important;}",
      ".VIpgJd-ZVi9od-aZ2wEe-wOHMyf,.VIpgJd-ZVi9od-aZ2wEe-OiiCO{display:none!important;}",
      "iframe.skiptranslate,.skiptranslate iframe{display:none!important;visibility:hidden!important;}",
      ".goog-te-gadget,.goog-te-gadget-simple{display:none!important;}",
      /* 배너 때문에 본문이 아래로 밀리는 현상 방지 */
      "body{top:0!important;position:static!important;}",
      "html.translated-ltr body,html.translated-rtl body{top:0!important;}",
      /* 번역된 단어 위에 뜨는 말풍선/하이라이트 제거 */
      "#goog-gt-tt,.goog-te-balloon-frame,.jfk-bubble{display:none!important;}",
      ".goog-text-highlight{background:none!important;box-shadow:none!important;}",
      /* 번역 시 헤더 메뉴가 줄바꿈되어 세로로 깨지는 현상 방지 */
      "html.translated-ltr .header__inner,html.translated-rtl .header__inner{flex-wrap:nowrap!important;gap:20px!important;}",
      "html.translated-ltr .nav__list,html.translated-rtl .nav__list{flex-wrap:nowrap!important;gap:22px!important;}",
      "html.translated-ltr .nav__list li,html.translated-rtl .nav__list li{flex-shrink:0!important;}",
      "html.translated-ltr .nav__list a,html.translated-ltr .nav-submenu li a,html.translated-ltr .util__link,html.translated-ltr .util__lang,html.translated-rtl .nav__list a,html.translated-rtl .nav-submenu li a,html.translated-rtl .util__link,html.translated-rtl .util__lang{white-space:nowrap!important;}",
      /* 번역 시 메뉴가 넓어져 로고가 찌그러지는 현상 방지 */
      "html.translated-ltr .header__logo,html.translated-rtl .header__logo{flex-shrink:0!important;}",
      "html.translated-ltr .nav__list a,html.translated-rtl .nav__list a{font-size:14px!important;}",
      /* 커스텀 언어 메뉴 */
      ".rkj-lang-menu{position:absolute;z-index:9999;min-width:140px;background:#fff;",
      "border:1px solid #e3ddd2;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.12);",
      "padding:6px;margin:0;list-style:none;font-size:14px;}",
      ".rkj-lang-menu li{margin:0;}",
      ".rkj-lang-menu button{display:flex;align-items:center;justify-content:space-between;",
      "width:100%;padding:9px 12px;border:0;background:none;cursor:pointer;border-radius:6px;",
      "color:#3a342b;font:inherit;text-align:left;}",
      ".rkj-lang-menu button:hover{background:#f5f1e9;}",
      ".rkj-lang-menu button[aria-current='true']{font-weight:700;color:#8a6d3b;}"
    ].join("");
    var style = document.createElement("style");
    style.id = "rkjTranslateStyle";
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ---- 커스텀 언어 메뉴 ---- */
  var menuEl = null;

  function closeMenu() {
    if (menuEl) {
      menuEl.remove();
      menuEl = null;
      document.removeEventListener("click", onDocClick, true);
    }
  }

  function onDocClick(e) {
    if (menuEl && !menuEl.contains(e.target) && !e.target.closest(".util__lang")) {
      closeMenu();
    }
  }

  function openMenu(anchor) {
    closeMenu();
    var cur = currentLang();
    var ul = document.createElement("ul");
    ul.className = "rkj-lang-menu";

    LANGS.forEach(function (l) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = l.label;
      if (l.code === cur) {
        btn.setAttribute("aria-current", "true");
        var mark = document.createElement("span");
        mark.textContent = "✓";
        btn.appendChild(mark);
      }
      btn.addEventListener("click", function () {
        closeMenu();
        setLang(l.code);
      });
      li.appendChild(btn);
      ul.appendChild(li);
    });

    document.body.appendChild(ul);
    var r = anchor.getBoundingClientRect();
    ul.style.top = (window.scrollY + r.bottom + 8) + "px";
    var left = window.scrollX + r.right - ul.offsetWidth;
    if (left < 8) left = window.scrollX + r.left;
    ul.style.left = left + "px";

    menuEl = ul;
    setTimeout(function () {
      document.addEventListener("click", onDocClick, true);
    }, 0);
  }

  /* ---- 언어 버튼 연결 ---- */
  function bindLangButtons() {
    document.querySelectorAll(".util__lang").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        if (menuEl) {
          closeMenu();
        } else {
          openMenu(link);
        }
      });
    });
  }

  function init() {
    injectStyle();
    markNoTranslate();
    injectGoogleTranslate();
    bindLangButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
