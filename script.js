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
        date: new Date(2026, 3, 25),  // 행사일 (month는 0부터 시작)
        time: '오전 11:30',
        place: '플로렌스 오목교점',
        hallName: '튜울립홀'
    },
    
    // 주소 정보
    address: {
        full: '인천 계양대로 164',
        car: '계양 IC 이용',
        bus: ['64번 - 경인교대역 하차', '30번 - 작전역 하차 15분 도보'],
        subway: '인천 1호선 경인교대역 2번 출구'
    },
    
    // 계좌 정보
    accounts: {
        father: { bank: '국민', account: '000-0000-000000', name: '정헌규' },
        mother: { bank: '신한', account: '000-000-000000', name: '박미래' }
    }
};

// 행사일 설정 (외부에서도 참조 가능)
const dDayDate = eventConfig.event.date;

// 성장 일기 데이터 (2025.04.28 부터 1개월 단위)
const growthData = [
    { date: '2025.04.28', title: '처음 세상에 태어난 날', img: 'growth_0.jpg' },
    { date: '2025.05.28', title: '생후 1개월', img: 'growth_1.jpg' },
    { date: '2025.06.28', title: '생후 2개월', img: 'growth_2.jpg' },
    { date: dDayDate.toISOString().split('T')[0].replace(/-/g, '.'), title: '첫 돌', img: 'growth_3.jpg' }
];

// 갤러리 이미지 데이터 (총 10장)
const galleryPhotos = [
    'gal_1.jpg', 'gal_2.jpg', 'gal_3.jpg', 'gal_4.jpg', 'gal_5.jpg',
    'gal_6.jpg', 'gal_7.jpg', 'gal_8.jpg', 'gal_9.jpg', 'gal_10.jpg'
];

// 방명록 초기 데이터
const initialComments = [
    { name: '할머니', text: eventConfig.babyName + '아 첫 생일을 축하해!', date: '2025.07.01' },
    { name: '삼촌', text: eventConfig.babyName + '이의 생일 너무 축하하고~ 건강하고 밝게 잘 자라렴!', date: '2025.07.02' }
];

// --- 초기화 ---
document.addEventListener('DOMContentLoaded', () => {
    initializeEvent();
    buildCalendar();
    calcDday();
    buildGrowth();
    buildGalleryPreview();
    renderComments();
});

// 이벤트 정보로 HTML 업데이트
function initializeEvent() {
    // 메인 섹션
    document.querySelector('.baby-name').textContent = eventConfig.babyName;
    document.querySelectorAll('.baby-image').forEach(el => {
        el.src = eventConfig.babyImage;
    });
    
    // 행사 정보
    const eventDate = eventConfig.event.date;
    const dateStr = `${eventDate.getFullYear()}.${String(eventDate.getMonth()).padStart(2,'0')}.${String(eventDate.getDate()).padStart(2,'0')}`;
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][eventDate.getDay()];
    document.querySelector('.event-time').textContent = `${dateStr} (${dayOfWeek}) ${eventConfig.event.time}`;
    
    // 장소
    const placeEl = document.querySelector('.event-place');
    placeEl.innerHTML = `${eventConfig.event.place}<br>${eventConfig.event.hallName}`;
    
    // 부모명
    const parentStr = `아빠 ${eventConfig.parents.father.name} <span class="dot">·</span> 엄마 ${eventConfig.parents.mother.name}`;
    document.querySelectorAll('.parents-name, .parents-sign').forEach(el => {
        el.innerHTML = parentStr;
    });
    
    // 캘린더 정보
    document.querySelector('.calendar-date').textContent = `${dateStr} ${dayOfWeek}요일 ${eventConfig.event.time}`;
    document.querySelector('.calendar-place').textContent = eventConfig.event.place;
    
    // 지도 정보
    document.querySelector('.map-info dt:first-of-type').nextElementSibling.textContent = eventConfig.address.full;
    const mapInfoDls = document.querySelectorAll('.map-info dt');
    mapInfoDls.forEach((dt, idx) => {
        const dd = dt.nextElementSibling;
        if (dt.textContent === '자가용 이용시') dd.textContent = eventConfig.address.car;
        if (dt.textContent === '버스 이용시') dd.innerHTML = eventConfig.address.bus.join('<br>');
        if (dt.textContent === '지하철 이용시') dd.textContent = eventConfig.address.subway;
    });
    
    // 방명록 제목
    document.querySelector('#section-comments .section-title').textContent = eventConfig.babyName + '의 생일을 축하해주세요!';
    
    // 계좌 정보
    const fatherAccEl = document.getElementById('father-acc');
    fatherAccEl.querySelector('p').innerHTML = `${eventConfig.parents.father.name}<br><strong>${eventConfig.accounts.father.bank} ${eventConfig.accounts.father.account}</strong>`;
    fatherAccEl.querySelector('button').onclick = () => copyText(eventConfig.accounts.father.account.replace('-', ''));
    
    const motherAccEl = document.getElementById('mother-acc');
    motherAccEl.querySelector('p').innerHTML = `${eventConfig.parents.mother.name}<br><strong>${eventConfig.accounts.mother.bank} ${eventConfig.accounts.mother.account}</strong>`;
    motherAccEl.querySelector('button').onclick = () => copyText(eventConfig.accounts.mother.account.replace('-', ''));
    
    // 연락처 모달
    const contactRows = document.querySelectorAll('.contact-row');
    const fatherContact = contactRows[0];
    const motherContact = contactRows[1];
    
    fatherContact.querySelector('span').textContent = `아빠 ${eventConfig.parents.father.name}`;
    fatherContact.querySelectorAll('button')[0].onclick = () => location.href = `tel:${eventConfig.parents.father.phone}`;
    fatherContact.querySelectorAll('button')[1].onclick = () => location.href = `sms:${eventConfig.parents.father.phone}`;
    
    motherContact.querySelector('span').textContent = `엄마 ${eventConfig.parents.mother.name}`;
    motherContact.querySelectorAll('button')[0].onclick = () => location.href = `tel:${eventConfig.parents.mother.phone}`;
    motherContact.querySelectorAll('button')[1].onclick = () => location.href = `sms:${eventConfig.parents.mother.phone}`;
}

// --- 기능 구현 ---

// 모달 열기/닫기
function openModal(id) { document.getElementById(id).style.display = 'block'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

// 계좌 아코디언 토글
function toggleAccount(id) {
    const el = document.getElementById(id);
    el.style.display = (el.style.display === 'block') ? 'none' : 'block';
}

// 텍스트 복사 (계좌, 링크 등)
function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("복사되었습니다.");
    });
}

// 달력 그리기
function buildCalendar() {
    const grid = document.getElementById('calendar-grid');
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    let html = '';
    
    // 요일 헤더
    days.forEach(d => {
        let cls = 'cal-day';
        if (d === '일') cls += ' sun';
        if (d === '토') cls += ' sat';
        html += `<div class="${cls}"><strong>${d}</strong></div>`;
    });

    // 2025년 7월 기준 달력 계산
    const year = dDayDate.getFullYear();
    const month = dDayDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const eventDate = dDayDate.getDate();

    // 빈 칸
    for (let i = 0; i < firstDay; i++) {
        html += `<div class="cal-day"></div>`;
    }
    // 날짜
    for (let i = 1; i <= lastDate; i++) {
        let cls = 'cal-day';
        if (i === eventDate) cls += ' dday'; // 디데이 강조
        html += `<div class="${cls}">${i}</div>`;
    }
    grid.innerHTML = html;
}

// 디데이 계산
function calcDday() {
    const today = new Date();
    today.setHours(0,0,0,0);
    const timeDiff = dDayDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    const textEl = document.getElementById('d-day-text');
    const baby = eventConfig.babyName;
    if (daysDiff > 0) {
        textEl.innerHTML = `${baby}❤의 첫번째 생일이 <span>${daysDiff}일</span> 남았습니다.`;
    } else if (daysDiff === 0) {
        textEl.innerHTML = `오늘은 ${baby}❤의 <span>첫번째 생일</span>입니다!`;
    } else {
        textEl.innerHTML = `${baby}❤의 생일이 지났습니다. 감사합니다.`;
    }
}

// 성장일기 생성
function buildGrowth() {
    const container = document.getElementById('growth-timeline');
    let html = '';
    growthData.forEach((item, index) => {
        // 번갈아가며 이미지 위치 조정 (CSS로 해도 되지만 직관적으로)
        html += `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <img src="${item.img}" alt="${item.title}" class="timeline-img">
                <div class="timeline-info">
                    <p class="date">${item.date}</p>
                    <p class="title">${item.title}</p>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// 갤러리 미리보기 (6장) 생성
function buildGalleryPreview() {
    const container = document.getElementById('gallery-preview');
    let html = '';
    for (let i = 0; i < 6; i++) {
        html += `<img src="${galleryPhotos[i]}" alt="갤러리사진" onclick="openGalleryModal(${i})">`;
    }
    container.innerHTML = html;
}

// --- 갤러리 슬라이더 로직 ---
let currentSlide = 0;

function openGalleryModal(index = 0) {
    currentSlide = index;
    updateSlider();
    openModal('galleryModal');
}

function changeSlide(step) {
    currentSlide += step;
    if (currentSlide < 0) currentSlide = galleryPhotos.length - 1;
    if (currentSlide >= galleryPhotos.length) currentSlide = 0;
    updateSlider();
}

function updateSlider() {
    document.getElementById('slider-img').src = galleryPhotos[currentSlide];
    document.getElementById('slider-counter').innerText = `${currentSlide + 1} / ${galleryPhotos.length}`;
}

// --- 방명록(댓글) 로직 ---
function renderComments() {
    const container = document.getElementById('comment-list');
    let html = '';
    initialComments.forEach(c => {
        html += `
            <div class="comment-item">
                <div class="comment-head">
                    <strong>From. ${c.name}</strong>
                    <span>${c.date}</span>
                </div>
                <div class="comment-body">${c.text}</div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function addComment() {
    const name = document.getElementById('guest-name').value;
    const msg = document.getElementById('guest-msg').value;
    
    if(!name || !msg) {
        alert("이름과 메시지를 모두 입력해주세요.");
        return;
    }

    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`;

    // 배열 맨 앞에 추가
    initialComments.unshift({ name: name, text: msg, date: dateStr });
    renderComments();
    
    // 폼 초기화 및 모달 닫기
    document.getElementById('guest-name').value = '';
    document.getElementById('guest-msg').value = '';
    closeModal('commentModal');
}