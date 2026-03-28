(function () {
    function isDesktop() {
        return window.matchMedia('(min-width: 1120px)').matches;
    }

    function initMenu() {
        var aside = document.getElementById('aside-menu');
        var openBtn = document.getElementById('aside-menu-open');

        function setOpen(open) {
            if (!aside) return;
            if (isDesktop()) {
                aside.classList.remove('aside-menu--open');
                aside.setAttribute('aria-hidden', 'false');
                if (openBtn) {
                    openBtn.classList.remove('header__menu-open--expanded');
                    openBtn.setAttribute('aria-expanded', 'false');
                    openBtn.setAttribute('aria-label', 'Открыть меню');
                }
                return;
            }
            aside.classList.toggle('aside-menu--open', open);
            aside.setAttribute('aria-hidden', open ? 'false' : 'true');
            if (openBtn) {
                openBtn.classList.toggle('header__menu-open--expanded', open);
                openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
                openBtn.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
            }
        }

        openBtn &&
            openBtn.addEventListener('click', function () {
                if (isDesktop()) return;
                setOpen(!aside.classList.contains('aside-menu--open'));
            });

        window.addEventListener('resize', function () {
            if (isDesktop()) setOpen(false);
        });

        if (aside && isDesktop()) aside.setAttribute('aria-hidden', 'false');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMenu);
    } else {
        initMenu();
    }
})();
