document.addEventListener('DOMContentLoaded', () => {
    const backBtn = document.getElementById('back');
    const cancelBtn = document.getElementById('cancel');

    backBtn.addEventListener('click', () => {
        window.location.href = '/termin';
    });

    cancelBtn.addEventListener('click', () => {
        window.location.href = '/main';
    });
});