// 갤러리 미디어 목록 (이미지/비디오 파일명만 수정해서 사용)
const mediaList = [
    // 이미지 예시
        // 이미지 예시 (카테고리/태그별)
        // { type: 'image', src: 'assets/images/travel1.jpg', alt: '여행사진1', category: '여행', tags: ['풍경','여름'] },
        // { type: 'image', src: 'assets/images/daily1.jpg', alt: '일상사진1', category: '일상', tags: ['집','반려동물'] },
        // { type: 'image', src: 'assets/images/work1.jpg', alt: '작업사진1', category: '작업', tags: ['프로젝트','문서'] },
        // 실제 비디오 파일 (카테고리/태그별)
        { type: 'video', src: 'assets/video/video1.mp4', thumb: '', alt: '여행 비디오', category: '여행', tags: ['여행','풍경','바다'] },
        { type: 'video', src: 'assets/video/video2.mp4', thumb: '', alt: '작업 비디오', category: '작업', tags: ['작업','프리젠테이션'] },
];

const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalContent = modal.querySelector('.modal-content');
const closeBtn = modal.querySelector('.close');
const leftArrow = modal.querySelector('.arrow.left');
const rightArrow = modal.querySelector('.arrow.right');
const filterBtns = document.querySelectorAll('.filter-nav button');
const categoryFilter = document.getElementById('category-filter');
const tagFilter = document.getElementById('tag-filter');

let currentIndex = 0;
let filteredList = [...mediaList];
let currentTypeFilter = 'all';
let currentCategoryFilter = 'all';
let currentTagFilter = [];

function renderGallery(list) {
    gallery.innerHTML = '';
    list.forEach((media, idx) => {
        const card = document.createElement('div');
        card.className = 'media-card';
        card.tabIndex = 0;
        card.setAttribute('data-idx', idx);
        // 카테고리 라벨 표시
        const label = document.createElement('div');
        label.textContent = media.category || '';
        label.style.position = 'absolute';
        label.style.top = '8px';
        label.style.left = '8px';
        label.style.background = 'rgba(0,188,212,0.7)';
        label.style.color = '#fff';
        label.style.fontSize = '0.8rem';
        label.style.padding = '2px 8px';
        label.style.borderRadius = '8px';
        label.style.zIndex = '2';
        card.appendChild(label);
        // 태그 라벨 표시
        if (media.tags && media.tags.length > 0) {
            const tagWrap = document.createElement('div');
            tagWrap.style.position = 'absolute';
            tagWrap.style.bottom = '8px';
            tagWrap.style.left = '8px';
            tagWrap.style.display = 'flex';
            tagWrap.style.gap = '4px';
            media.tags.forEach(tag => {
                const tagLabel = document.createElement('span');
                tagLabel.textContent = tag;
                tagLabel.style.background = 'rgba(33,150,243,0.7)';
                tagLabel.style.color = '#fff';
                tagLabel.style.fontSize = '0.7rem';
                tagLabel.style.padding = '1px 6px';
                tagLabel.style.borderRadius = '6px';
                tagLabel.style.zIndex = '2';
                tagWrap.appendChild(tagLabel);
            });
            card.appendChild(tagWrap);
        }
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
        currentTypeFilter = btn.getAttribute('data-filter');
        applyFilters();
    });
});

categoryFilter.addEventListener('change', () => {
    currentCategoryFilter = categoryFilter.value;
    applyFilters();
});

tagFilter.addEventListener('input', () => {
    const raw = tagFilter.value.trim();
    currentTagFilter = raw ? raw.split(',').map(t => t.trim()).filter(t => t) : [];
    applyFilters();
});

function applyFilters() {
    filteredList = mediaList.filter(m => {
        const typeMatch = currentTypeFilter === 'all' || m.type === currentTypeFilter;
        const categoryMatch = currentCategoryFilter === 'all' || m.category === currentCategoryFilter;
        const tagMatch = currentTagFilter.length === 0 || (m.tags && currentTagFilter.every(tf => m.tags.includes(tf)));
        return typeMatch && categoryMatch && tagMatch;
    });
    renderGallery(filteredList);
}
// 초기 렌더링
renderGallery(filteredList);
