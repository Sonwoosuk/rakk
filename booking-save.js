(function () {
  'use strict';

  var PROPERTY_MAP = {
    'kiwa.html':    'kiwa',
    'choga.html':   'choga',
    'seoul.html':   'seoul',
    'bukchon.html': 'bukchon'
  };

  var ROOM_LABELS = {
    all:   '전체 객실',
    room1: '나루재 2베드룸 스위트',
    room2: '프리미엄 스위트',
    room3: '패밀리 스위트',
    room4: '디럭스 스위트',
    room5: '스탠다드 스위트',
    room6: '주니어 스위트',
    room7: '무궁화',
    room8: '슈페리어 룸',
    room9: '스탠다드 룸'
  };

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('.res-bar');
    if (!form) return;

    var pageName = (location.pathname.split('/').pop() || '').replace(/\?.*$/, '') || 'kiwa.html';
    var property = PROPERTY_MAP[pageName] || 'kiwa';

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var user = window.rkjAuth ? window.rkjAuth.currentUser : null;
      if (!user) {
        alert('예약을 저장하려면 로그인이 필요합니다.');
        if (window.showRakkojaeLoginModal) window.showRakkojaeLoginModal();
        return;
      }

      if (!window.rkjDb) {
        alert('예약 저장 서비스를 사용하려면 Firestore 설정이 필요합니다.');
        return;
      }

      var dateInputs = form.querySelectorAll('input[type="date"]');
      var checkIn   = dateInputs[0] ? dateInputs[0].value : '';
      var checkOut  = dateInputs[1] ? dateInputs[1].value : '';
      var guestsEl  = form.querySelector('input[name="guests"]');
      var roomEl    = form.querySelector('input[name="roomType"]');
      var diningEl  = form.querySelector('input[name="dining"]');

      if (!checkIn && !checkOut) {
        alert('체크인 / 체크아웃 날짜를 선택해 주세요.');
        return;
      }

      var roomType = roomEl ? roomEl.value : '';
      var booking = {
        userId:       user.uid,
        property:     property,
        checkIn:      checkIn,
        checkOut:     checkOut,
        guests:       guestsEl && guestsEl.value ? parseInt(guestsEl.value) : null,
        roomType:     roomType || null,
        roomTypeName: ROOM_LABELS[roomType] || null,
        dining:       diningEl ? diningEl.value : null,
        createdAt:    new Date().toISOString(),
        status:       'confirmed'
      };

      var btn = form.querySelector('.res-submit-btn');
      if (btn) { btn.disabled = true; btn.textContent = '저장 중…'; }

      window.rkjDb
        .collection('bookings')
        .add(booking)
        .then(function () {
          if (btn) { btn.disabled = false; btn.textContent = '예약 검색'; }
          alert('예약이 저장되었습니다!\n마이페이지에서 예약 내역을 확인하실 수 있습니다.');
        })
        .catch(function (err) {
          if (btn) { btn.disabled = false; btn.textContent = '예약 검색'; }
          alert('오류가 발생했습니다: ' + err.message);
          console.error('[BookingSave]', err);
        });
    });
  });
})();
