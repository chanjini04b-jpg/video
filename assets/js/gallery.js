// 갤러리 미디어 목록 (이미지/비디오 파일명만 수정해서 사용)
const mediaList = [
    // 이미지 예시
        // 이미지 예시 (이미지 파일 추가 시 아래에 입력)
        // { type: 'image', src: 'assets/images/photo1.jpg', alt: '풍경1' },
        // { type: 'image', src: 'assets/images/photo2.jpg', alt: '풍경2' },
        // { type: 'image', src: 'assets/images/photo3.jpg', alt: '풍경3' },
        // 실제 비디오 파일
        { type: 'video', src: 'assets/video/video1.mp4', thumb: '', alt: '비디오1' },
        { type: 'video', src: 'assets/video/video2.mp4', thumb: '', alt: '비디오2' },
];

const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalContent = modal.querySelector('.modal-content');
const closeBtn = modal.querySelector('.close');
const leftArrow = modal.querySelector('.arrow.left');
const rightArrow = modal.querySelector('.arrow.right');
const filterBtns = document.querySelectorAll('.filter-nav button');

let currentIndex = 0;
let filteredList = [...mediaList];

function renderGallery(list) {
    gallery.innerHTML = '';
    list.forEach((media, idx) => {
        const card = document.createElement('div');
        card.className = 'media-card';
        card.tabIndex = 0;
        card.setAttribute('data-idx', idx);
        if (media.type === 'image') {
            const img = document.createElement('img');
            img.src = media.src;
            img.alt = media.alt;
            card.appendChild(img);
        } else if (media.type === 'video') {
            const thumb = document.createElement('img');
            thumb.src = media.thumb || 'assets/images/video-thumb-default.jpg';
            thumb.alt = media.alt;
            card.appendChild(thumb);
            const playIcon = document.createElement('span');
            playIcon.className = 'play-icon';
            playIcon.innerHTML = '&#9654;';
            card.appendChild(playIcon);
        }
        card.addEventListener('click', () => openModal(idx));
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') openModal(idx);
        });
        gallery.appendChild(card);
    });
}

function openModal(idx) {
    currentIndex = idx;
    showModalMedia();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}
function closeModal() {
    modal.classList.add('hidden');
    modalContent.innerHTML = '';
    document.body.style.overflow = '';
}
function showModalMedia() {
    const media = filteredList[currentIndex];
    modalContent.innerHTML = '';
    if (media.type === 'image') {
        const img = document.createElement('img');
        img.src = media.src;
        img.alt = media.alt;
        modalContent.appendChild(img);
    } else if (media.type === 'video') {
        const video = document.createElement('video');
        video.src = media.src;
        video.setAttribute('controls', '');
        video.setAttribute('autoplay', '');
        video.setAttribute('playsinline', '');
        video.style.background = '#000';
        modalContent.appendChild(video);
        // 자동 재생 보장 (일부 브라우저는 mute 필요)
        video.muted = true;
        video.play().catch(() => {});
    }
}
function prevMedia() {
    if (currentIndex > 0) {
        currentIndex--;
        showModalMedia();
    }
}
function nextMedia() {
    if (currentIndex < filteredList.length - 1) {
        currentIndex++;
        showModalMedia();
    }
}
closeBtn.addEventListener('click', closeModal);
leftArrow.addEventListener('click', prevMedia);
rightArrow.addEventListener('click', nextMedia);
window.addEventListener('keydown', e => {
    if (!modal.classList.contains('hidden')) {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') prevMedia();
        if (e.key === 'ArrowRight') nextMedia();
    }
});
modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
});
// 필터 기능
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        if (filter === 'all') {
            filteredList = [...mediaList];
        } else {
            filteredList = mediaList.filter(m => m.type === filter);
        }
        renderGallery(filteredList);
    });
});
// 초기 렌더링
renderGallery(filteredList);
