function onGo() {
  let parsed = document.getElementById('svcode').value.replace(' ','').replace('undefined', '').split(',');
  sessionStorage.setItem('playerz', JSON.stringify(parsed));
  window.location.href = 'game.html';
}