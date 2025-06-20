firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    if (window.location.pathname !== '/login.html' && window.location.pathname !== '/index.html') {
      window.location.href = 'login.html';
    }
  }
});
