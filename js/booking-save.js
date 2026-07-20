(function () {
  'use strict';

  // 페이지별 예약 종류 매핑
  var PAGE_CONFIG = {
    'kiwa.html':    { type: 'stay',    property: 'kiwa' },
    'choga.html':   { type: 'stay',    property: 'choga' },
    'seoul.html':   { type: 'stay',    property: 'seoul' },
    'bukchon.html': { type: 'stay',    property: 'bukchon' },
    'dining.html':  { type: 'dining',  property: 'dining' },
    'culture.html': { type: 'culture', property: 'culture' }
  };

  // 숙소별 객실 라벨
  var ROOM_LABELS = {
    kiwa: {
      all: '전체 객실', room1: '나루재 2베드룸 스위트', room2: '프리미엄 스위트',
      room3: '패밀리 스위트', room4: '디럭스 스위트', room5: '스탠다드 스위트',
      room6: '주니어 스위트', room7: '무궁화', room8: '슈페리어 룸', room9: '스탠다드 룸'
    },
    choga:   { all: '전체 객실', room1: '건넌방', room2: '안방', room3: '사랑채', room4: '독채 (별채)' },
    seoul:   { all: '전체 객실', room1: '안방', room2: '건넌방', room3: '정자방', room4: '별채', room5: '대문채' },
    bukchon: { all: '전체 객실', room1: '안방', room2: '건넌방', room3: '사랑방' }
  };

  var TIME_LABELS = {
    'lunch-12': '점심 12:00', 'lunch-13': '점심 13:30',
    'dinner-18': '저녁 18:00', 'dinner-19': '저녁 19:30'
  };

  var COURSE_LABELS = {
    signature: '수운잡방 반가 헤리티지 코스',
    seasonal:  '계절 수운잡방 특선 코스'
  };

  var PROGRAM_LABELS = {
    hanbok: '한복 체험', gayageum: '가야금 체험', tea: '우리차 수업',
    liquor: '우리 술 시음', gyubang: '전통 규방 클래스', art: '아트 프로그램'
  };

  function fieldValue(form, name) {
    var el = form.querySelector('input[name="' + name + '"]');
    return el ? el.value : '';
  }

  // 예약 데이터 수집. 필수값이 비어 있으면 null 반환
  // (페이지 스크립트가 자체 안내 알림을 띄우도록 둔다)
  function collectBooking(form, cfg) {
    var booking = {
      type:      cfg.type,
      property:  cfg.property,
      createdAt: new Date().toISOString(),
      status:    'confirmed'
    };
    var guests = fieldValue(form, 'guests');
    if (!guests) return null;
    booking.guests = parseInt(guests, 10) || guests;

    if (cfg.type === 'stay') {
      // flatpickr가 input type을 text로 바꾸므로 .res-input 클래스로 찾는다
      var dateInputs = form.querySelectorAll('.res-input');
      var checkIn  = dateInputs[0] ? dateInputs[0].value : '';
      var checkOut = dateInputs[1] ? dateInputs[1].value : '';
      if (!checkIn || !checkOut) return null;
      booking.checkIn  = checkIn;
      booking.checkOut = checkOut;
      var roomType = fieldValue(form, 'roomType');
      booking.roomType = roomType || null;
      booking.roomTypeName =
        (ROOM_LABELS[cfg.property] && ROOM_LABELS[cfg.property][roomType]) || null;
      booking.dining = fieldValue(form, 'dining') || null;
    } else if (cfg.type === 'dining') {
      var dDate   = fieldValue(form, 'date');
      var dTime   = fieldValue(form, 'time');
      var dCourse = fieldValue(form, 'course');
      if (!dDate || !dTime || !dCourse) return null;
      booking.date       = dDate;
      booking.time       = dTime;
      booking.timeName   = TIME_LABELS[dTime] || dTime;
      booking.course     = dCourse;
      booking.courseName = COURSE_LABELS[dCourse] || dCourse;
    } else if (cfg.type === 'culture') {
      var cDate    = fieldValue(form, 'date');
      var cProgram = fieldValue(form, 'program');
      if (!cDate || !cProgram) return null;
      booking.date        = cDate;
      booking.program     = cProgram;
      booking.programName = PROGRAM_LABELS[cProgram] || cProgram;
    }
    return booking;
  }

  var pageName = (location.pathname.split('/').pop() || '').replace(/\?.*$/, '') || 'index.html';
  var cfg = PAGE_CONFIG[pageName];
  if (!cfg) return;

  // 캡처 단계(document)에서 등록해 페이지 스크립트의 submit 핸들러보다 먼저 실행
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || !form.classList || !form.classList.contains('res-bar')) return;

    e.preventDefault();

    var booking = collectBooking(form, cfg);
    if (!booking) return; // 필수값 누락 → 페이지 스크립트의 안내 알림에 맡김

    var user = window.rkjAuth ? window.rkjAuth.currentUser : null;
    if (!user) {
      // 로그인 전에는 "예약 완료" 모달이 뜨지 않도록 페이지 핸들러 차단
      e.stopImmediatePropagation();
      e.stopPropagation();
      alert('예약하려면 로그인이 필요합니다.');
      if (window.showRakkojaeLoginModal) window.showRakkojaeLoginModal();
      return;
    }

    if (!window.rkjDb) {
      e.stopImmediatePropagation();
      e.stopPropagation();
      alert('예약 저장 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    booking.userId    = user.uid;
    booking.userEmail = user.email || null;

    window.rkjDb
      .collection('bookings')
      .add(booking)
      .catch(function (err) {
        alert('예약 저장 중 오류가 발생했습니다: ' + err.message);
        console.error('[BookingSave]', err);
      });
    // 성공 시 별도 알림 없음 — 페이지의 "예약 완료" 모달이 확인 역할을 한다
  }, true);
})();
