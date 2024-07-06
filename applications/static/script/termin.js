document.addEventListener('DOMContentLoaded', () => {
    const suchenBtn = document.getElementById('suchen-btn');

    suchenBtn.addEventListener('click', () => {
        window.location.href = '/termin/wahl';
    });
});