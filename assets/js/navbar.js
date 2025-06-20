function loadNavbar() {
  fetch('partials/navbar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navbarContainer').innerHTML = data;

      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          firebase.auth().signOut().then(() => {
            window.location.href = 'login.html';
          });
        });
      }
    });
}
