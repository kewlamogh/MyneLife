window.location.href = '#';
/*==Functions==*/
function Player(name) {
  return {
    name: name,
    health: 10,
    builtABase: false,
    axe: false,
    sheild: false,
    wood: 0,
    food: 10,
    crafting: false,
    sheildDurability: null
  }
}
function Evento(title, type, act, pisoi = null) {
  return {
    title: title,
    type: type,
    effect: act,
    formatStr: function (player) { this.effect(player); return players[player].name + this.title; },
    pisoi: pisoi //FYI (more like FMI), pisoi means person-identification-string-or-integer
  }
}
function choice(list) {
  return list[Math.floor(list.length * Math.random())]
}
function updateOrInitializeStats() {
  document.getElementById('stats').innerHTML = '';
  for (var i = 0; i <= players.length - 1; i++) {
    document.getElementById('stats').innerHTML += players[i].name + ': Health = ' + players[i].health.toString() + ', Food: ' + players[i].food.toString() + ', House: ' + players[i].builtABase + ', sheild: ' + players[i].sheild + ', crafting table: ' + players[i].crafting + ', axe: ' + players[i].axe + '<br>';
  }
}
function generate() {
  if (players.length > 0) {
    cyclesDone++
    if (cyclesDone >= players.length) {
      document.getElementById('console').innerHTML += '<br>Day ' + day.toString() + '<br>';
    }
    causeEvent();
    if (cyclesDone >= players.length) {
      day++
      cyclesDone = 0;
    }
  } else {
    document.getElementById('stats').innerHTML = '';
    deadPlayers['names'].reverse()
    for (var i = 0; i <= deadPlayers['names'].length - 1; i++) {
      document.getElementById('stats').innerHTML += i+' place: '+deadPlayers['name'][i];
    }
  }
}
function initPlayers() {
  for (var i = 0; i <= JSON.parse(sessionStorage.getItem('playerz')).length - 1; i++) {
    players.push(
      new Player(JSON.parse(sessionStorage.getItem('playerz'))[i])
    )
  }
}
function causeEvent() {
  let subject = Math.floor(Math.random() * players.length);
  let issue = choice(issues);
  shouldDoAnything = true;
  if (players[subject].food < 1) {
    if (issue.pisoi == 6432) {
      shouldDoAnything = false;
    }
  }
  if (players[subject].wood < 10 || players[subject].builtABase) {
    if (issue.pisoi == 'yeet' && players[subject].crafting == false) {
      shouldDoAnything = false;
    }
  }
  if (players[subject].wood < 5) {
    if (issue.pisoi == 'ax' && players[subject].crafting == false) {
      shouldDoAnything = false;
    }
  }
  if (players[subject].sheild) {
    if (issue.pisoi == 'sh' && players[subject].crafting == false) {
      shouldDoAnything = false;
    }
  }
  if (!players[subject].house && issue.pisoi == 911) {
    shouldDoAnything = false;
  }
  let prevHealth = players[subject].health;
  if (shouldDoAnything) {
    insert(issue, subject)
  }
  if (issue.pisoi == 'blockableAndDamaging') {
    if (players[subject].sheild) {
      players[subject].health = prevHealth;
      insert(new Evento(' blocked damage with a sheild', 'luck', function () { }), subject)
      players[subject].sheildDurability -= 1;
      if (players[subject].sheildDurability == 0) {
        insert(new Evento("'s sheild breaks", 'luck', function () { players[subject].sheild = false; players[subject].sheildDurability = null }), subject)
        players[subject].sheild = false;
        players[subject].sheildDurability = null;
      }
    }
  }
  if (issue.pisoi == 'blockableAndDamaging') {
    if (players[subject].axe && players[subject].health > 0) {
      insert(new Evento(' killed what attacked them', 'luck', function () { }), subject)
    }
  }
  if (players[subject].health < 0) {
    insert(new Evento(' died', 'really-bad', function () { }), subject)

    deadPlayers['names'].push(players[subject].name);
    deadPlayers['number'] += 1;

    players.splice(subject, 1);
    updateOrInitializeStats();
  }
  if (!shouldDoAnything) {
    insert(new Evento(' is feeling blue', 'info', function () { }), subject)
  }
}
function insert(evento, subject) {
  evts++
  document.getElementById('console').innerHTML += '<span id = "' + evts.toString() + '" ' + 'class="' + evento.type + '"><br>' + notations[evento.type] + ' ' + evento.formatStr(subject) + '</span><br>';
  window.location.href = '#' + evts.toString();
  updateOrInitializeStats()
}
/*==Vars==*/
let day = 1, evts = 0, players = [], cyclesDone = 0, notations = {
  'good': '[+]',
  'bad': '[-]',
  'info': '[!]',
  'luck': '[*]',
  'really-bad': '[--]',
  'really-good': '[++]'
}, shouldDoAnything = true,issues = [
  new Evento(' got hit by a zombie', 'bad', function (playerIssuedTo) { players[playerIssuedTo].health -= 1 }, 'blockableAndDamaging'),
  new Evento(' got shot by a skeleton', 'bad', function (playerIssuedTo) { players[playerIssuedTo].health -= 1 }, 'blockableAndDamaging'),
  new Evento(' gets bitten by a spider', 'bad', function (playerIssuedTo) { players[playerIssuedTo].health -= 1 }, 'blockableAndDamaging'),
  new Evento(' finds a cave', 'info', function (playerIssuedTo) { }),
  new Evento(' ate some food', 'good', function (player) { players[player].health += 1; players[player].food -= 1 }, 6432),
  new Evento(' is gettting paranoid', 'info', function () { }),
  new Evento(' thinks they will die', 'info', function () { }),
  new Evento(' builds a house', 'really-good', function (player) { players[player].builtABase = true; }, 'yeet'),
  new Evento(' gets some wood', 'good', function (player) { players[player].wood += Math.round(Math.random() * 30) }),
  new Evento(' falls off a cliff', 'bad', function (player) { players[player].health -= Math.ceil(Math.random() * 5) }),
  new Evento(' feels like leaving this blocky world', 'info', function (player) { }),
  new Evento(' crafts a sheild', 'luck', function (player) { players[player].sheild = true; players[player].sheildDurability = 3; }, 'sh'),
  new Evento(' finds mushrooms and crafts mushroom stew', 'good', function (player) { players[player].food += 1 }),
  new Evento(' finds apples', 'good', function (player) { players[player].food += 1 }),
  new Evento(' gets axe', 'good', function (player) { players[player].axe = true; }, 'ax'),
  new Evento(' crafts a crafting table', 'good', function (player) { players[player].crafting = true; }),
  new Evento(' goes fishing with their fists', 'good', function (player) { players[player].food += 3; }),
  new Evento(' screams at the ocean', 'info', function () { }),
  new Evento("'s house got blown up by a creeper", 'bad', function (player) { players[player].house = false; players[player].health -= 5 }, 911),
  new Evento(" goes for a swim", 'info', function (player) { }),
  new Evento(" finds a shipwreck and gets some wood", 'info', function (player) { players[player].wood += 20; }),
  new Evento(" feels lonely", 'info', function (player) { }),
  new Evento(" gets speared by a Drowned", 'bad', function (player) { players[player].health -= Math.ceil(Math.random() * 10); }, 'blockableAndDamaging')
], deadPlayers = {'names': [], 'number': 0};
/*==Game and Init==*/
initPlayers();
updateOrInitializeStats();
document.addEventListener('keydown', function (event) { if (event.keyCode == 13) generate() });