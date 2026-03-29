(function () {
    const section = document.querySelector('[data-brands]');
    if (!section) return;

    const swiperEl = section.querySelector('.brands-swiper');
    const wrapper = swiperEl?.querySelector('.swiper-wrapper');
    const btn = section.querySelector('[data-brands-toggle]');
    const labelEl = btn?.querySelector('[data-expand-label]');

    const MOBILE_MAX = 767;
    const MOBILE_SLIDE_COUNT = 9;
    const LIMIT_TABLET = 6;
    const LIMIT_DESKTOP = 8;

    let swiper = null;
    let expanded = false;
    let mobileOverflowFragment = null;

    function getLimit() {
        const w = window.innerWidth;
        if (w <= MOBILE_MAX) return Number.POSITIVE_INFINITY;
        if (w < 1120) return LIMIT_TABLET;
        return LIMIT_DESKTOP;
    }

    function getSlides() {
        return [...section.querySelectorAll('.brands-swiper .swiper-slide')];
    }

    function updateExpandButton(total, limit) {
        if (!btn || !labelEl) return;
        if (window.innerWidth <= MOBILE_MAX) {
            btn.hidden = true;
            btn.setAttribute('aria-expanded', 'false');
            return;
        }
        const needsToggle = Number.isFinite(limit) && total > limit;
        btn.hidden = !needsToggle;
        btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        labelEl.textContent = expanded ? 'Скрыть' : 'Показать все';
        btn.classList.toggle('brands-expand--open', expanded);
    }

    function applyCollapse() {
        const slides = getSlides();
        const limit = getLimit();
        const total = slides.length;

        if (Number.isFinite(limit) && total <= limit) {
            expanded = false;
        }

        slides.forEach((slide, i) => {
            const hide = Number.isFinite(limit) && !expanded && i >= limit;
            slide.classList.toggle('swiper-slide--hidden', hide);
            slide.setAttribute('aria-hidden', hide ? 'true' : 'false');
        });

        if (swiper) {
            swiper.update();
        }
        const pagEl = section.querySelector('.swiper-pagination');
        if (pagEl) {
            pagEl.classList.remove('brands-swiper__pagination--off');
        }
        updateExpandButton(total, limit);
    }

    function setGridMode(isGrid) {
        section.classList.toggle('brands-section--grid', isGrid);
    }

    function destroySwiper() {
        if (!swiper) return;
        swiper.destroy(true, true);
        swiper = null;
    }

    function extractSlidesForMobile() {
        if (!wrapper) return;
        while (wrapper.children.length > MOBILE_SLIDE_COUNT) {
            if (!mobileOverflowFragment) {
                mobileOverflowFragment = document.createDocumentFragment();
            }
            const last = wrapper.lastElementChild;
            mobileOverflowFragment.insertBefore(last, mobileOverflowFragment.firstChild);
        }
    }

    function restoreSlidesFromMobile() {
        if (!wrapper || !mobileOverflowFragment) return;
        while (mobileOverflowFragment.firstChild) {
            wrapper.appendChild(mobileOverflowFragment.firstChild);
        }
    }

    function initSwiper() {
        if (swiper || !swiperEl) return;
        swiper = new Swiper(swiperEl, {
            slidesPerView: 'auto',
            spaceBetween: 16,
            speed: 320,
            resistanceRatio: 0.75,
            watchOverflow: true,
            observer: true,
            observeParents: true,
            pagination: {
                el: section.querySelector('.swiper-pagination'),
                clickable: true,
                dynamicBullets: false,
            },
        });
    }

    function syncLayout() {
        const mobile = window.innerWidth <= MOBILE_MAX;

        destroySwiper();

        if (mobile) {
            expanded = false;
            extractSlidesForMobile();
            initSwiper();
        } else {
            restoreSlidesFromMobile();
        }

        setGridMode(!mobile);
        applyCollapse();
    }

    let resizeT;
    window.addEventListener('resize', () => {
        clearTimeout(resizeT);
        resizeT = setTimeout(syncLayout, 150);
    });

    btn?.addEventListener('click', () => {
        if (window.innerWidth <= MOBILE_MAX) return;
        const limit = getLimit();
        if (!Number.isFinite(limit) || getSlides().length <= limit) return;
        expanded = !expanded;
        applyCollapse();
    });

    syncLayout();
})();
