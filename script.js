console.log('logic started');

var pollAmt = 30;
var popAmt = 7;
var carAmt = 1;
var day = moment("2019-01-01");
var forAmt = 4;
var moneyAmt = 1e8;
var clAmt = 15000;
var oiAmt = 10000;
var slAmt = 0;
var wnAmt = 0;
var hyAmt = 0;
var pollRateAmt = 0;
var pwAmt = 3500;
var reqpwAmt = 20000;

var ccsAmt = 0;

var paused = false;

var upgrades = {
  'upHydro1': {
    'cost': 1.5e8,
    'hydro': +1500
  },
  'upSolar1': {
    'cost': 1.5e8,
    'solar': +1500,
  },
  'upForest1': {
    'cost': 4e8,
    'forest': 1
  },
  'upCcs1': {
    'cost': 8e8,
    'carbon': 1000
  },
  'upWind1': {
    'cost': 4e8,
    'wind': +2500
  }
};

var upgradesOrder = [
  'upHydro1',
  'upSolar1',
  'upForest1',
  'upCcs1',
  'upWind1'
];

var upgradesTime = [
  '2020-01-01',
  '2022-01-01',
  '2023-01-01',
  '2024-01-01',
  '2026-01-01'
];

var pollEle = document.getElementById('pollCounter');
var popEle = document.getElementById('popCounter');
var dayEle = document.getElementById('dayCounter');
var forEle = document.getElementById('forCounter');
var carEle = document.getElementById('carCounter');
var moneyEle = document.getElementById('moneyCounter');
var clEle = document.getElementById('clCounter');
var oiEle = document.getElementById('oiCounter');
var slEle = document.getElementById('slCounter');
var wnEle = document.getElementById('wnCounter');
var hyEle = document.getElementById('hyCounter');
var pollRateEle = document.getElementById('pollRateCounter');
var pwEle = document.getElementById('pwCounter');
var reqpwEle = document.getElementById('reqpwCounter');

var ccsEle = document.getElementById('ccsCounter');
var hyMoneyEle = document.getElementById('hydroMoneyCounter');
var slMoneyEle = document.getElementById('solarMoneyCounter');
var forMoneyEle = document.getElementById('forestMoneyCounter');
var ccsMoneyEle = document.getElementById('carbonMoneyCounter');
var wnMoneyEle = document.getElementById('windMoneyCounter');

function updatePage() {
  // Called to refresh all the variables on the web page
  pollEle.innerHTML = pollAmt.toFixed(1);
  popEle.innerHTML = popAmt.toFixed(3);
  forEle.innerHTML = forAmt.toFixed(3);
  dayEle.innerHTML = day.format('MMMM Do YYYY');
  carEle.innerHTML = carAmt.toFixed(3);
  moneyEle.innerHTML = numberWithCommas(moneyAmt.toFixed(0));
  clEle.innerHTML = clAmt.toFixed(1);
  oiEle.innerHTML = oiAmt.toFixed(1);
  slEle.innerHTML = slAmt.toFixed(1);
  wnEle.innerHTML = wnAmt.toFixed(1);
  hyEle.innerHTML = hyAmt.toFixed(1);
  pollRateEle.innerHTML = pollRateAmt.toFixed(2);
  pwEle.innerHTML = pwAmt.toFixed(1);
  reqpwEle.innerHTML = reqpwAmt.toFixed(1);

  hyMoneyEle.innerHTML = numberWithCommas(upgrades['upHydro1']['cost']);
  slMoneyEle.innerHTML = numberWithCommas(upgrades['upSolar1']['cost']);
  forMoneyEle.innerHTML = numberWithCommas(upgrades['upForest1']['cost']);
  ccsMoneyEle.innerHTML = numberWithCommas(upgrades['upCcs1']['cost']);
  wnMoneyEle.innerHTML = numberWithCommas(upgrades['upWind1']['cost']);

  ccsEle.innerHTML = ccsAmt.toFixed(0);
}

function changePoll(amt) {
  // Called to change the pollution amount by amt
  pollAmt += amt;
}

function changePop(amt) {
  popAmt *= amt;
}

function changeCar(amt) {
  carAmt *= amt;
}

function updateDate(amt) {
  day.add(amt, 'days');
}

function changeFor(amt) {
  forAmt *= amt;
}

function changeMoney(amt) {
  moneyAmt += amt;
}

function calculateTotalPower() {
  pwAmt = clAmt + oiAmt + slAmt + hyAmt + wnAmt;
  reqpwAmt = 10000 + popAmt * 1500;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calculatePollRate() {
  pollRateAmt = (
    + carAmt / 1e2
    - forAmt / 3.5e2
    + clAmt / 4000000 // Add coal
    + oiAmt / 8000000 // Add oil
    + slAmt / 2e8 // Add solar
    + hyAmt / 4e8 // Add hydro
    + wnAmt * 0 // Add wind
    - ccsAmt / 100000 // Subtract CCS machines
  );
}

function retrieveUpgrades() {
  for (var i = 0; i < upgradesTime.length; i++) {
    var upgradeName = upgradesOrder[i];

    if (moment(upgradesTime[i]).diff(day) < 0) {
      document.getElementById(upgradeName).classList.remove('hidden');
    }

    if (upgrades[upgradeName]['cost'] > moneyAmt) {
      document.getElementById(upgradeName).disabled = true;
    } else {
      document.getElementById(upgradeName).disabled = false;
    }
  }
}

function togglePause() {
  paused = !paused;
}

function buyUpgrade(name) {
  var upgradeInfo = upgrades[name];
  var cost = 0;
  var coal = 0;
  var oil = 0;
  var solar = 0;
  var hydro = 0;
  var wind = 0;
  var forest = 0;
  var carbon = 0;

  if ('cost' in upgradeInfo) {
    var cost = upgradeInfo['cost'];
  }
  if ('coal' in upgradeInfo) {
    var coal = upgradeInfo['coal'];
  }
  if ('oil' in upgradeInfo) {
    var oil = upgradeInfo['oil'];
  }
  if ('solar' in upgradeInfo) {
    var solar = upgradeInfo['solar'];
  }
  if ('hydro' in upgradeInfo) {
    var hydro = upgradeInfo['hydro'];
  }
  if ('wind' in upgradeInfo) {
    var wind = upgradeInfo['wind'];
  }
  if ('forest' in upgradeInfo) {
    var forest = upgradeInfo['forest'];
  }
  if ('carbon' in upgradeInfo) {
    var carbon = upgradeInfo['carbon'];
  }

  if (moneyAmt > cost) {
    moneyAmt -= cost;
    clAmt += coal;
    oiAmt += oil;
    slAmt += solar;
    hyAmt += hydro;
    wnAmt += wind;
    forAmt += forest;
    ccsAmt += carbon;

    upgrades[name]['cost'] *= 1.4;

    //document.getElementById(name).classList.add('purchased');
  }
}

function reduce(name) {
  switch(name) {
    case "redCoal":
      clAmt -= 500;
      break;
    case "redOil":
      oiAmt -= 500;
      break;
  }
  moneyAmt += 7.5e7;
}

function checkLose() {
  if (pwAmt < reqpwAmt) {
    document.getElementById('gameStatus').innerHTML = 'You have lost!'
    document.getElementById('main').classList.add('hidden');
    document.getElementById('lose').classList.remove('hidden');
    paused = true;
    document.getElementById('loseReason').innerHTML = "The government has stopped funding Detox Inc. because the power demand is greater than what Detox can supply.";
    document.getElementById('surviveDays').innerHTML = 'You have survived for ' + day.diff(moment("2019-01-01"), 'days') + ' days.';
  } else if (pollAmt >= 100) {
    document.getElementById('gameStatus').innerHTML = 'You have lost!'
    document.getElementById('main').classList.add('hidden');
    document.getElementById('lose').classList.remove('hidden');
    paused = true;
    document.getElementById('loseReason').innerHTML = "Pollution has overwhelmed the world and Detox Inc. is at fault.";
    document.getElementById('surviveDays').innerHTML = 'You have survived for ' + day.diff(moment("2019-01-01"), 'days') + ' days.';
  } else if (pollAmt <= 0) {
    document.getElementById('gameStatus').innerHTML = 'You have won!'
    document.getElementById('main').classList.add('hidden');
    document.getElementById('lose').classList.remove('hidden');
    paused = true;
    document.getElementById('loseReason').innerHTML = "Total environmental protection has been achieved. Detox Inc. is revered as the savior of the world.";
    document.getElementById('surviveDays').innerHTML = 'You have saved the world in ' + day.diff(moment("2019-01-01"), 'days') + ' days.';
  } else if (forAmt <= 0) {
    document.getElementById('gameStatus').innerHTML = 'You have lost!'
    document.getElementById('main').classList.add('hidden');
    document.getElementById('lose').classList.remove('hidden');
    paused = true;
    document.getElementById('loseReason').innerHTML = "There isn't a single tree left in the world.";
    document.getElementById('surviveDays').innerHTML = 'You have survived for ' + day.diff(moment("2019-01-01"), 'days') + ' days.';
  }
}

function mainLoop() {
  if (paused) return;
  // Called every second
  // Adjust main pollution
  calculatePollRate()
  changePoll(pollRateAmt);
  pollRateAmt = pollRateAmt * 365;
  // Adjust individual variables
  changePop(1 + 0.02 / 365);
  changeCar(1 + 0.02 / 365);
  changeFor(1 - 0.05 / 365);
  // Adjust date
  updateDate(1);
  // Retrieve upgrades
  retrieveUpgrades();
  // Calculate total power
  calculateTotalPower();
  // Update the entire page
  updatePage();
  checkLose();
}

function yearLoop() {
  if (paused) return;
  changeMoney((popAmt * 1e8 + carAmt * 1e8) / 8);
}

updatePage();
setInterval(mainLoop, 100 / 5);
setInterval(yearLoop, 36500 / 5);

var smoothie = new SmoothieChart({minValue:20000, maxValueScale:1.02});
smoothie.streamTo(document.getElementById("mycanvas"));

// Data
var line1 = new TimeSeries();
var line2 = new TimeSeries();

// Add a random value to each line every second
setInterval(function() {
  line1.append(new Date().getTime(), pwAmt);
  line2.append(new Date().getTime(), reqpwAmt);
}, 100);

// Add to SmoothieChart
smoothie.addTimeSeries(line1, { strokeStyle:'rgb(0, 255, 0)', fillStyle:'rgba(0, 255, 0, 0.4)', lineWidth:2 });
smoothie.addTimeSeries(line2, { strokeStyle:'rgb(255, 0, 0)', fillStyle:'rgba(255, 0, 0, 0.4)', lineWidth:2 });