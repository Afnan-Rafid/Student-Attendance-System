/* =========================
   SIDEBAR ACTIVE STATE
   (Handled by Django template)
   ========================= */
// ❌ REMOVED JS-based active logic
// Use Django template instead:
// <li class="{% if request.path == '/attendance/' %}active{% endif %}">


/* =========================
   SIDEBAR TOGGLE
   ========================= */
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

if (menuBar && sidebar) {
    menuBar.addEventListener('click', () => {
        sidebar.classList.toggle('hide');
    });
}


/* =========================
   MOBILE SEARCH TOGGLE
   ========================= */
const searchForm = document.querySelector('#content nav form');
const searchBtn = document.querySelector('#content nav form button');
const searchIcon = document.querySelector('#content nav form button .bx');

if (searchForm && searchBtn && searchIcon) {
    searchBtn.addEventListener('click', (e) => {
        if (window.innerWidth < 576) {
            e.preventDefault();
            searchForm.classList.toggle('show');
            searchIcon.classList.toggle('bx-search');
            searchIcon.classList.toggle('bx-x');
        }
    });
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 576 && searchForm && searchIcon) {
        searchForm.classList.remove('show');
        searchIcon.classList.add('bx-search');
        searchIcon.classList.remove('bx-x');
    }
});


/* =========================
   DARK / LIGHT MODE
   ========================= */
const switchMode = document.getElementById('switch-mode');

function applyTheme(theme) {
    document.body.classList.toggle('dark', theme === 'dark');
    if (switchMode) switchMode.checked = theme === 'dark';
}

if (switchMode) {
    switchMode.addEventListener('change', () => {
        const theme = switchMode.checked ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        applyTheme(theme);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    applyTheme(localStorage.getItem('theme') || 'light');
});


/* =========================
   ATTENDANCE FORM (DJANGO POST)
   ========================= */
const attendanceForm = document.getElementById('attendance-form');

if (attendanceForm) {
    attendanceForm.addEventListener('submit', () => {
        // Optional loader / button disable
        const btn = attendanceForm.querySelector('button[type="submit"]');
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Submitting...';
        }
    });
}
