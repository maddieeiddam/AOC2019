const fs = require('fs-extra');
const path = require('path');

const calculateSimpleFuel = mass => {
  let fuel = Math.floor(mass / 3) - 2;
  return fuel;
};

const calculateRecursiveFuel = (sum, mass) => {
  let fuelNeeded = Math.floor(mass / 3) - 2;
  if (fuelNeeded <= 0) {
    return sum;
  } else {
    return calculateRecursiveFuel(sum + fuelNeeded, fuelNeeded);
  }
}

const calculateTotalFuel = inputArr => {
  // simple fuel calculation, part 1 of the puzzle
  const simpleFuelArray = inputArr.map(mass => calculateSimpleFuel(mass));
  const totalSimpleFuel = simpleFuelArray.reduce((a, b) => a + b, 0);
  console.log('total simple fuel', totalSimpleFuel);

  // recursive fuel calculation, part 2 of the puzzle
  const recursiveFuelArray = inputArr.map(mass => calculateRecursiveFuel(0, mass));
  const totalRecursiveFuel = recursiveFuelArray.reduce((a, b) => a + b, 0);
  console.log('total recursive fuel', totalRecursiveFuel);
}

const getInputArray = async () => {
  const input = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');

  // split input on each new line, remove empty lines, and convert each line to a number
  let inputArray = input.split('\n').map(line => Number(line.trim())).filter(Boolean);
  return calculateTotalFuel(inputArray);
};

getInputArray();
