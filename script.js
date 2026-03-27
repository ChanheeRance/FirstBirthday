// ====================================
// ⭐⭐⭐ 이곳에서 모든 정보를 수정하세요 ⭐⭐⭐
// ====================================
const eventConfig = {
    // 기본 정보
    babyName: '정찬희',           
    babyImage: './images/main_1.jpg',   // 경로 수정됨
    
    // 부모 정보
    parents: {
        father: { name: '정헌규', phone: '010-2325-4861' },
        mother: { name: '박미래', phone: '010-5186-5538' }
    },
    
    // 행사 정보
    event: {
        date: new Date(2026, 3, 25),  // 2026년 4월 25일
        time: '오전 11:30',
        place: '플로렌스 오목교점',
        hallName: '튜울립홀'
    },
    
    // 주소 정보 (업데이트됨)
    address: {
        full: '서울 영등포구 영등포로 33 목동비즈타워 8층',
        car: '목동비즈타워 내 주차장 이용',
        bus: [
            '관악고등학교(오목교역 방면) - 640, 650, 5012, 5616, 6211, 6625, 6628, 6629, 6630, 6640B', 
            '관악고등학교(양평신동아아파트 방면) - 640, 650, 5012, 6211, 6625, 6628, 6629, 6630, 6640A'
        ],
        subway: '5호선 양평역 2번출구 도보 5분'
    },
    
    // 계좌 정보
    accounts: {
        father: { bank: '국민', account: '000-0000-000000', name: '정헌규' },
        mother: { bank: '신한', account: '000-000-000000', name: '박미래' }
    }
};

const dDayDate = eventConfig.event.date;

// 성장 일기 데이터 (경로 수정됨)
const growthData = [
    { date: '2025.04.28', title: '처음 세상에 태어난 날', img: './images/20260219_155011.jpg' },
    { date: '2025.08.28', title: '백일 잔치', img: './images/main_1.jpg' },
    { date: '2026.04.25', title: '첫 돌', img: './images/20260219_155011.jpg' }
];

// 갤러리 이미지 데이터 (경로 수정됨)
const galleryPhotos = [
    './images/main_1.jpg', './images/20260219_155011.jpg', './images/main_1.jpg', 
    './images/20260219_155011.jpg', './images/main_1.jpg', './images/20260219_155011.jpg'
];

// 방명록 초기 데이터 (날짜 2026년으로 조정)
const initialComments = [
    { name: '할머니', text: eventConfig.babyName + '아 첫 생일을 축하해!', date: '2026.04.01' },
    { name: '삼촌', text: eventConfig.babyName + '이의 생일 너무 축하하고~ 건강하고 밝게 잘 자라렴!', date: '2026.04.02' }
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

function initializeEvent() {
    document.querySelector('.baby-name').textContent = eventConfig.babyName;
    document.querySelectorAll('.main-image').forEach(el => {
        el.src = eventConfig.babyImage;
    });
    
    const eventDate = eventConfig.event.date;
    const dateStr = `${eventDate.getFullYear()}.${String(eventDate.getMonth()+1).padStart(2,'0')}.${String(eventDate.getDate()).padStart(2,'0')}`;
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][eventDate.getDay()];
    document.querySelector('.event-time').textContent = `${dateStr} (${dayOfWeek}) ${eventConfig.event.time}`;
    
    const placeEl = document.querySelector('.event-place');
    placeEl.innerHTML = `${eventConfig.event.place}<br>${eventConfig.event.hallName}`;
    
    const parentStr = `아빠 ${eventConfig.parents.father.name} <span class="dot">·</span> 엄마 ${eventConfig.parents.mother.name}`;
    document.querySelectorAll('.parents-name, .parents-sign').forEach(el => {
        el.innerHTML = parentStr;
    });
    
    document.querySelector('.calendar-date').textContent = `${dateStr} ${dayOfWeek}요일 ${eventConfig.event.time}`;
    document.querySelector('.calendar-place').textContent = eventConfig.event.place;
    
    document.querySelector('#section-comments .section-title').textContent = eventConfig.babyName + '의 생일을 축하해주세요!';
    
    const fatherAccEl = document.getElementById('father-acc');
    fatherAccEl.querySelector('p').innerHTML = `${eventConfig.parents.father.name}<br><strong>${eventConfig.accounts.father.bank} ${eventConfig.accounts.father.account}</strong>`;
    fatherAccEl.querySelector('button').onclick = () => copyText(eventConfig.accounts.father.account.replace('-', ''));
    
    const motherAccEl = document.getElementById('mother-acc');
    motherAccEl.querySelector('p').innerHTML = `${eventConfig.parents.mother.name}<br><strong>${eventConfig.accounts.mother.bank} ${eventConfig.accounts.mother.account}</strong>`;
    motherAccEl.querySelector('button').onclick = () => copyText(eventConfig.accounts.mother.account.replace('-', ''));
}

function openModal(id) { document.getElementById(id).style.display = 'block'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function toggleAccount(id) {
    const el = document.getElementById(id);
    el.style.display = (el.style.display === 'block') ? 'none' : 'block';
}
function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("복사되었습니다.");
    });
}

function buildCalendar() {
    const grid = document.getElementById('calendar-grid');
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    let html = '';
    
    days.forEach(d => {
        let cls = 'cal-day';
        if (d === '일') cls += ' sun';
        if (d === '토') cls += ' sat';
        html += `<div class="${cls}"><strong>${d}</strong></div>`;
    });

    const year = dDayDate.getFullYear();
    const month = dDayDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const eventDate = dDayDate.getDate();

    for (let i = 0; i < firstDay; i++) { html += `<div class="cal-day"></div>`; }
    for (let i = 1; i <= lastDate; i++) {
        let cls = 'cal-day';
        if (i === eventDate) cls += ' dday';
        html += `<div class="${cls}">${i}</div>`;
    }
    grid.innerHTML = html;
}

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

// 애플 스타일 성장일기 생성
function buildGrowth() {
    const container = document.getElementById('growth-slider');
    let html = '';
    growthData.forEach((item) => {
        html += `
            <div class="growth-card">
                <img src="${item.img}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/300x220?text=Image'">
                <div class="growth-card-info">
                    <p class="date">${item.date}</p>
                    <p class="title">${item.title}</p>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function buildGalleryPreview() {
    const container = document.getElementById('gallery-preview');
    let html = '';
    for (let i = 0; i < 6; i++) {
        if(galleryPhotos[i]) {
            html += `<img src="${galleryPhotos[i]}" alt="갤러리사진" onerror="this.src='https://via.placeholder.com/150'" onclick="openGalleryModal(${i})">`;
        }
    }
    container.innerHTML = html;
}

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

// XSS 방지용 이스케이프 함수
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

function renderComments() {
    const container = document.getElementById('comment-list');
    let html = '';
    initialComments.forEach(c => {
        html += `
            <div class="comment-item">
                <div class="comment-head">
                    <strong>From. ${escapeHTML(c.name)}</strong>
                    <span>${c.date}</span>
                </div>
                <div class="comment-body">${escapeHTML(c.text)}</div>
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

    initialComments.unshift({ name: name, text: msg, date: dateStr });
    renderComments();
    
    document.getElementById('guest-name').value = '';
    document.getElementById('guest-msg').value = '';
    closeModal('commentModal');
}

// ====================================
// 모달 외부(어두운 배경) 클릭 시 닫기 기능
// ====================================
window.addEventListener('click', function(event) {
    // 클릭한 요소가 'modal' 클래스를 가진 어두운 배경 자체일 경우
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});