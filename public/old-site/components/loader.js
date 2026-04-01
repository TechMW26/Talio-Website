(function () {
    const componentFiles = [
        ['header-placeholder', 'components/header.html'],
        ['footer-placeholder', 'components/footer.html'],
    ];

    async function injectComponent(placeholderId, filePath) {
        const placeholder = document.getElementById(placeholderId);

        if (!placeholder) {
            return;
        }

        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`Failed to load ${filePath}`);
        }

        placeholder.innerHTML = await response.text();
    }

    function setRouteTargets() {
        const target = window.top !== window ? '_top' : '_self';

        document.querySelectorAll('a[href^="/"]').forEach((anchor) => {
            anchor.setAttribute('target', target);
        });
    }

    function setCurrentYear() {
        const year = String(new Date().getFullYear());

        document.querySelectorAll('[data-current-year]').forEach((element) => {
            element.textContent = year;
        });
    }

    function wireMobileSidebar() {
        const mobileMenuButton = document.getElementById('mobileMenuBtn');
        const mobileSidebar = document.getElementById('mobileSidebar');
        const sidebarPanel = document.getElementById('sidebarPanel');

        if (!mobileMenuButton || !mobileSidebar || !sidebarPanel) {
            return;
        }

        const closeSidebar = () => {
            mobileSidebar.classList.remove('active');
            mobileMenuButton.classList.remove('active');
            sidebarPanel.classList.remove('submenu-active');
            document.documentElement.classList.remove('sidebar-open');
            document.body.classList.remove('sidebar-open');

            mobileSidebar.querySelectorAll('.sidebar-submenu.active').forEach((submenu) => {
                submenu.classList.remove('active');
            });
        };

        const openSidebar = () => {
            mobileSidebar.classList.add('active');
            mobileMenuButton.classList.add('active');
            document.documentElement.classList.add('sidebar-open');
            document.body.classList.add('sidebar-open');
        };

        mobileMenuButton.addEventListener('click', () => {
            if (mobileSidebar.classList.contains('active')) {
                closeSidebar();
                return;
            }

            openSidebar();
        });

        mobileSidebar.querySelectorAll('[data-close-sidebar]').forEach((element) => {
            element.addEventListener('click', closeSidebar);
        });

        mobileSidebar.querySelectorAll('a').forEach((anchor) => {
            anchor.addEventListener('click', closeSidebar);
        });

        mobileSidebar.querySelectorAll('[data-submenu-target]').forEach((trigger) => {
            trigger.addEventListener('click', () => {
                const submenuId = trigger.getAttribute('data-submenu-target');
                const submenu = submenuId ? document.getElementById(submenuId) : null;

                if (!submenu) {
                    return;
                }

                sidebarPanel.classList.add('submenu-active');
                submenu.classList.add('active');
            });
        });

        mobileSidebar.querySelectorAll('[data-submenu-close]').forEach((trigger) => {
            trigger.addEventListener('click', () => {
                const submenu = trigger.closest('.sidebar-submenu');

                if (!submenu) {
                    return;
                }

                submenu.classList.remove('active');
                sidebarPanel.classList.remove('submenu-active');
            });
        });

        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeSidebar();
            }
        });
    }

    function syncNavbarScrollState() {
        const navbar = document.getElementById('navbar');

        if (!navbar) {
            return;
        }

        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }

    async function init() {
        try {
            await Promise.all(componentFiles.map(([placeholderId, filePath]) => injectComponent(placeholderId, filePath)));
            setRouteTargets();
            setCurrentYear();
            wireMobileSidebar();
            syncNavbarScrollState();
            window.addEventListener('scroll', syncNavbarScrollState, { passive: true });
            window.dispatchEvent(new Event('scroll'));
        } catch (error) {
            console.error('Failed to load old-site components', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
    }

    init();
})();