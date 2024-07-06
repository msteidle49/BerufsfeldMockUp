document.addEventListener('DOMContentLoaded', () => {
    const searchDateBtn = document.getElementById('search-date');
    const cancelBtn = document.getElementById('cancel');

    searchDateBtn.addEventListener('click', () => {
        window.location.href = '/termin/wahl';
    });

    cancelBtn.addEventListener('click', () => {
        window.location.href = '/main';
    });
});