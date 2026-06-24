// 카카오맵 초기화
// developers.kakao.com → 내 애플리케이션 → 앱 키 → JavaScript 키를
// 각 페이지 <head>의 kakao maps SDK script appkey= 에 입력해 주세요.

document.addEventListener('DOMContentLoaded', function () {
  var mapDiv = document.getElementById('locationMap');
  if (!mapDiv) return;

  if (typeof kakao === 'undefined' || !kakao.maps) {
    mapDiv.style.display = 'flex';
    mapDiv.style.alignItems = 'center';
    mapDiv.style.justifyContent = 'center';
    mapDiv.style.background = '#f0ede8';
    mapDiv.style.color = '#888';
    mapDiv.style.fontSize = '14px';
    mapDiv.textContent = 'Kakao Maps API 키를 입력해 주세요 (developers.kakao.com)';
    return;
  }

  var lat  = parseFloat(mapDiv.dataset.lat);
  var lng  = parseFloat(mapDiv.dataset.lng);
  var name = mapDiv.dataset.name || '';

  var map = new kakao.maps.Map(mapDiv, {
    center: new kakao.maps.LatLng(lat, lng),
    level: 3
  });

  var markerPos = new kakao.maps.LatLng(lat, lng);
  var marker = new kakao.maps.Marker({ position: markerPos, map: map });

  if (name) {
    var infoWindow = new kakao.maps.InfoWindow({
      content: '<div style="padding:8px 14px;font-family:Pretendard,sans-serif;font-size:13px;font-weight:600;white-space:nowrap;">' + name + '</div>',
      removable: false
    });
    infoWindow.open(map, marker);
  }
});
