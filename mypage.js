(function () {
  'use strict';

  var PROPERTY_LABELS = {
    kiwa:    '락고재 기와본관',
    choga:   '락고재 초가별관',
    seoul:   '락고재 서울 본관',
    bukchon: '북촌빈관 by 락고재'
  };

  var CSS = [
    '#rkjMypageModal{',
      'font-family:var(--font-body,"Pretendard",sans-serif);',
      'position:fixed;inset:0;z-index:99999;',
      'display:none;align-items:center;justify-content:center;',
      'background:rgba(43,26,19,0.6);backdrop-filter:blur(4px);',
      'opacity:0;transition:opacity .35s ease;',
    '}',
    '#rkjMypageModal.is-visible{opacity:1;}',
    '.rkj-mp-panel{',
      'width:90%;max-width:500px;max-height:85vh;overflow-y:auto;',
      'background:#fff;border-radius:16px;padding:40px 36px;',
      'position:relative;',
      'box-shadow:0 25px 60px rgba(0,0,0,.25);',
      'transform:translateY(20px) scale(.97);',
      'transition:transform .35s cubic-bezier(.25,1,.5,1);',
      'scrollbar-width:thin;',
    '}',
    '#rkjMypageModal.is-visible .rkj-mp-panel{transform:translateY(0) scale(1);}',
    '.rkj-mp-close{',
      'position:absolute;top:18px;right:18px;',
      'background:transparent;border:none;cursor:pointer;',
      'color:#9c8c7a;padding:4px;display:flex;align-items:center;',
      'transition:color .2s;',
    '}',
    '.rkj-mp-close:hover{color:#2b1a13;}',
    '.rkj-mp-profile{display:flex;align-items:center;gap:16px;margin-bottom:24px;}',
    '.rkj-mp-avatar{',
      'width:54px;height:54px;border-radius:50%;',
      'background:#e8e0d6;display:flex;align-items:center;justify-content:center;',
      'font-size:21px;font-weight:600;color:#6b5742;',
      'overflow:hidden;flex-shrink:0;',
    '}',
    '.rkj-mp-avatar img{width:100%;height:100%;object-fit:cover;}',
    '.rkj-mp-userinfo{flex:1;min-width:0;}',
    '.rkj-mp-name{font-size:16px;font-weight:600;color:#2b1a13;margin:0 0 3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
    '.rkj-mp-email{font-size:12px;color:#9c8c7a;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
    '.rkj-mp-logout{',
      'flex-shrink:0;background:transparent;border:1px solid #c8b89e;',
      'color:#6b5742;font-size:13px;padding:6px 16px;border-radius:20px;',
      'cursor:pointer;transition:background .2s,color .2s;',
    '}',
    '.rkj-mp-logout:hover{background:#f5efe8;color:#2b1a13;}',
    '.rkj-mp-hr{border:none;border-top:1px solid #ede6dc;margin:0 0 24px;}',
    '.rkj-mp-section-title{font-size:12px;letter-spacing:.1em;color:#9c8c7a;font-weight:500;margin:0 0 16px;text-transform:uppercase;}',
    '.rkj-bk-empty{text-align:center;color:#b0a090;font-size:14px;padding:32px 0;margin:0;}',
    '.rkj-bk-card{border:1px solid #ede6dc;border-radius:10px;padding:16px 18px;margin-bottom:12px;}',
    '.rkj-bk-card:last-child{margin-bottom:0;}',
    '.rkj-bk-property{font-size:15px;font-weight:600;color:#2b1a13;margin:0 0 8px;}',
    '.rkj-bk-dates{display:flex;align-items:center;gap:8px;font-size:13px;color:#6b5742;margin-bottom:6px;flex-wrap:wrap;}',
    '.rkj-bk-sep{color:#c0b0a0;}',
    '.rkj-bk-meta{font-size:12px;color:#9c8c7a;margin:0;}',
    '.rkj-bk-status{',
      'display:inline-block;margin-top:10px;',
      'font-size:11px;font-weight:600;letter-spacing:.08em;',
      'padding:3px 10px;border-radius:12px;',
      'background:#e8f0e0;color:#4e6a35;',
    '}',
    '@media(max-width:600px){',
      '.rkj-mp-panel{padding:32px 20px;}',
      '.rkj-mp-profile{flex-wrap:wrap;}',
    '}'
  ].join('');

  function injectStyles() {
    if (document.getElementById('rkjMypageStyle')) return;
    var s = document.createElement('style');
    s.id = 'rkjMypageStyle';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function buildModal() {
    injectStyles();
    var el = document.createElement('div');
    el.id = 'rkjMypageModal';
    el.innerHTML =
      '<div class="rkj-mp-panel" role="dialog" aria-modal="true" aria-label="마이페이지">' +
        '<button class="rkj-mp-close" id="rkjMpClose" aria-label="닫기">' +
          '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8">' +
            '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
          '</svg>' +
        '</button>' +
        '<div class="rkj-mp-profile">' +
          '<div class="rkj-mp-avatar" id="rkjMpAvatar"></div>' +
          '<div class="rkj-mp-userinfo">' +
            '<p class="rkj-mp-name" id="rkjMpName">—</p>' +
            '<p class="rkj-mp-email" id="rkjMpEmail">—</p>' +
          '</div>' +
          '<button class="rkj-mp-logout" id="rkjMpLogout">로그아웃</button>' +
        '</div>' +
        '<hr class="rkj-mp-hr">' +
        '<p class="rkj-mp-section-title">예약 내역</p>' +
        '<div id="rkjMpBookings"><p class="rkj-bk-empty">불러오는 중…</p></div>' +
      '</div>';
    document.body.appendChild(el);

    document.getElementById('rkjMpClose').addEventListener('click', closeMypageModal);
    el.addEventListener('click', function (e) { if (e.target === el) closeMypageModal(); });
    document.getElementById('rkjMpLogout').addEventListener('click', function () {
      if (!window.rkjAuth) return;
      if (!confirm('로그아웃 하시겠습니까?')) return;
      window.rkjAuth.signOut();
      closeMypageModal();
    });
  }

  function openMypageModal(user) {
    if (!document.getElementById('rkjMypageModal')) buildModal();

    document.getElementById('rkjMpName').textContent  = user.displayName || '회원';
    document.getElementById('rkjMpEmail').textContent = user.email || '';
    var av = document.getElementById('rkjMpAvatar');
    if (av) {
      av.innerHTML = user.photoURL
        ? '<img src="' + user.photoURL + '" alt="">'
        : (user.displayName || 'U').charAt(0).toUpperCase();
    }

    loadBookings(user.uid);

    var modal = document.getElementById('rkjMypageModal');
    modal.style.display = 'flex';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { modal.classList.add('is-visible'); });
    });
    document.body.style.overflow = 'hidden';

    document._rkjMpEsc = function (e) { if (e.key === 'Escape') closeMypageModal(); };
    document.addEventListener('keydown', document._rkjMpEsc);
  }

  function closeMypageModal() {
    var modal = document.getElementById('rkjMypageModal');
    if (!modal) return;
    modal.classList.remove('is-visible');
    setTimeout(function () { modal.style.display = 'none'; }, 350);
    document.body.style.overflow = '';
    if (document._rkjMpEsc) document.removeEventListener('keydown', document._rkjMpEsc);
  }

  function loadBookings(uid) {
    var listEl = document.getElementById('rkjMpBookings');
    if (!listEl) return;

    if (!window.rkjDb) {
      listEl.innerHTML = '<p class="rkj-bk-empty">Firestore가 연결되지 않았습니다.<br>아래 안내를 따라 설정해 주세요.</p>';
      return;
    }

    window.rkjDb
      .collection('bookings')
      .where('userId', '==', uid)
      .get()
      .then(function (snapshot) {
        if (snapshot.empty) {
          listEl.innerHTML = '<p class="rkj-bk-empty">예약 내역이 없습니다.</p>';
          return;
        }
        var html = '';
        snapshot.forEach(function (doc) { html += renderCard(doc.data()); });
        listEl.innerHTML = html;
      })
      .catch(function (err) {
        listEl.innerHTML = '<p class="rkj-bk-empty">예약을 불러오지 못했습니다.</p>';
        console.error('[MyPage]', err);
      });
  }

  function renderCard(d) {
    var prop = PROPERTY_LABELS[d.property] || d.property || '락고재';
    var meta = [];
    if (d.guests)           meta.push('인원 ' + d.guests + '명');
    if (d.roomTypeName)     meta.push(d.roomTypeName);
    if (d.dining === 'yes') meta.push('다이닝 포함');
    return (
      '<div class="rkj-bk-card">' +
        '<p class="rkj-bk-property">' + prop + '</p>' +
        '<div class="rkj-bk-dates">' +
          '<span>체크인 <strong>' + (d.checkIn || '—') + '</strong></span>' +
          '<span class="rkj-bk-sep">→</span>' +
          '<span>체크아웃 <strong>' + (d.checkOut || '—') + '</strong></span>' +
        '</div>' +
        (meta.length ? '<p class="rkj-bk-meta">' + meta.join('  ·  ') + '</p>' : '') +
        '<span class="rkj-bk-status">예약 완료</span>' +
      '</div>'
    );
  }

  window.openMypageModal  = openMypageModal;
  window.closeMypageModal = closeMypageModal;
})();
