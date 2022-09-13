import { Table } from './Table.js';

interface Combination {
  wins: number
  plays: number
  rate: number
}

interface Simulation {
  suited: Combination[][]
  offSuit: Combination[][]
}

const simulationResults: Simulation = { suited: [], offSuit: [] };

for (let i = 0; i < 13; i++) {
  const arr = new Array<Combination>();
  for (let j = 0; j < 13; j++) {
    arr.push({ wins: 0, plays: 0, rate: 0 });
  }
  simulationResults.suited.push(arr);
}

for (let i = 0; i < 13; i++) {
  const arr = new Array<Combination>();
  for (let j = 0; j < 13; j++) {
    arr.push({ wins: 0, plays: 0, rate: 0 });
  }
  simulationResults.offSuit.push(arr);
}

const table = new Table();

let date1, date2;
for (let n = 0; n < 10; n++) {
  console.log(`Calculating ${n}...`);
  date1 = Date.now();
  for (let i = 0; i < 1000; i++) {
    table.reset();
    table.addPlayers(3);
    table.dealToHands();
    table.dealToTable(5);

    const { hand, win } = table.evaluate();

    const [card1, card2] = hand;
    if (card1.suit === card2.suit) {
      simulationResults.suited[card1.value][card2.value].plays++;
      if (win) simulationResults.suited[card1.value][card2.value].wins++;
    } else {
      simulationResults.offSuit[card1.value][card2.value].plays++;
      if (win) simulationResults.offSuit[card1.value][card2.value].wins++;
    }
  }
  date2 = Date.now();
  console.log(`Finished ${n} calculation.`);
  console.log(`Time elapsed: ${(date2 - date1) / 1000} seconds.`);
}

const ratesSuited: number[][] = [];
const ratesOffSuit: number[][] = [];

for (let i = 0; i < 13; i++) {
  const arr = new Array<number>();
  for (let j = 0; j < 13; j++) {
    arr.push(0);
  }
  ratesSuited.push(arr);
}

for (let i = 0; i < 13; i++) {
  const arr = new Array<number>();
  for (let j = 0; j < 13; j++) {
    arr.push(0);
  }
  ratesOffSuit.push(arr);
}

for (let i = 0; i < 13; i++) {
  for (let j = 0; j < 13; j++) {
    if (i > j) {
      simulationResults.suited[i][j].plays += simulationResults.suited[j][i].plays;
      simulationResults.suited[j][i].plays = 0;
      simulationResults.suited[i][j].wins += simulationResults.suited[j][i].wins;
      simulationResults.suited[j][i].wins = 0;
      simulationResults.suited[i][j].rate =
        simulationResults.suited[i][j].wins / simulationResults.suited[i][j].plays;
      ratesSuited[i][j] = simulationResults.suited[i][j].rate;

      simulationResults.offSuit[i][j].plays += simulationResults.offSuit[j][i].plays;
      simulationResults.offSuit[j][i].plays = 0;
      simulationResults.offSuit[i][j].wins += simulationResults.offSuit[j][i].wins;
      simulationResults.offSuit[j][i].wins = 0;
      simulationResults.offSuit[i][j].rate =
        simulationResults.offSuit[i][j].wins / simulationResults.offSuit[i][j].plays;
      ratesOffSuit[i][j] = simulationResults.offSuit[i][j].rate;
    }
    if (i === j) {
      simulationResults.offSuit[i][j].rate =
        simulationResults.offSuit[i][j].wins / simulationResults.offSuit[i][j].plays;
      ratesOffSuit[i][j] = simulationResults.offSuit[i][j].rate;
    }
  }
}

console.table(ratesSuited);
console.table(ratesOffSuit);
