// ====================================
// ⭐⭐⭐ 이곳에서 모든 정보를 수정하세요 ⭐⭐⭐
// ====================================
const eventConfig = {
    // 기본 정보
    babyName: '정찬희',           // 아기 이름
    babyImage: 'baby_main.jpg',   // 아기 메인 사진
    
    // 부모 정보
    parents: {
        father: { name: '정헌규', phone: '010-2325-4861' },
        mother: { name: '박미래', phone: '010-5186-5538' }
    },
    
    // 행사 정보
    event: {
        date: new Date(2026, 3, 25),  // 2026년 4월 25일 (JS에서 월은 0부터 시작하므로 3 입력)
        time: '오전 11:30',
        place: '플로렌스 오목교점',
        hallName: '튜울립홀'
    },
    
    // 주소 정보
    address: {
        full: '서울 영등포구 영등포로 33 목동비즈타워 8층',
        car: '목동비즈타워 내 주차장 이용', // ※ 자가용 안내는 임의로 작성했습니다. 필요시 수정해 주세요.
        bus: [
            '관악고등학교(오목교역 방면) - 640, 650, 5012, 5616, 6211, 6625, 6628, 6629, 6630, 6640B', 
            '관악고등학교(양평신동아아파트 방면) - 640, 650, 5012, 6211, 6625, 6628, 6629, 6630, 6640A'
        ],
        subway: '5호선 양평역 2번출구 도보 5분'
    },
    
    // 계좌 정보 (기존 데이터 유지)
    accounts: {
        father: { bank: '국민', account: '000-0000-000000', name: '정헌규' },
        mother: { bank: '신한', account: '000-000-000000', name: '박미래' }
    }
};

// ====================================
// 네이버 다이나믹 지도 렌더링
// ====================================
function initNaverMap() {
    // 플로렌스 오목교점의 대략적인 위도(lat), 경도(lng) 
    // (만약 위치가 조금 어긋난다면 구글맵 등을 통해 정확한 위경도를 찾아 숫자를 수정해 주세요)
    var targetPosition = new naver.maps.LatLng(37.522851, 126.885859);

    var mapOptions = {
        center: targetPosition, // 지도 중심 좌표
        zoom: 16,               // 확대 비율 (숫자가 클수록 확대됨)
        minZoom: 10,
        zoomControl: true,      // 줌 컨트롤러 표시
        zoomControlOptions: {
            position: naver.maps.Position.TOP_RIGHT
        }
    };

    // 지도 생성 ('map'은 HTML의 id 속성값)
    var map = new naver.maps.Map('map', mapOptions);

    // 목적지에 마커(핀) 추가
    var marker = new naver.maps.Marker({
        position: targetPosition,
        map: map
    });
}

// 기존 DOMContentLoaded 이벤트 리스너에 initNaverMap() 추가
document.addEventListener('DOMContentLoaded', () => {
    initializeEvent();
    buildCalendar();
    calcDday();
    buildGrowth();
    buildGalleryPreview();
    renderComments();
    
    // 네이버 지도 초기화 함수 실행
    if (typeof naver !== 'undefined') {
        initNaverMap();
    }
});
// [수정] 성장일기 생성 (애플 스타일 가로 카드 스와이프)
function buildGrowth() {
    const container = document.getElementById('growth-slider');
    let html = '';
    
    // 성장 데이터 배열을 순회하며 카드 생성
    growthData.forEach((item) => {
        html += `
            <div class="growth-card">
                <img src="./images/${item.img}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/300x220?text=Image'">
                <div class="growth-card-info">
                    <p class="date">${item.date}</p>
                    <p class="title">${item.title}</p>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}