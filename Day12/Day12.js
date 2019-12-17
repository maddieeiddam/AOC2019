const fs = require('fs-extra');
const path = require('path');

const getInputArray = async () => {
  const input = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  let planetArray = [];
  input.split('\n').filter(Boolean).forEach(positionStr => {
    let coords = positionStr.split(', ');
    let planetObj = {
      x: [Number(coords[0].split('=')[1]), 0],
      y: [Number(coords[1].split('=')[1]), 0],
      z: [Number(coords[2].split('=')[1].split('>')[0]), 0],
    };
    planetArray.push(planetObj);
  })
  return planetArray;
};

const adjustVelocities = (planet1, planet2, coord) => {
  if (planet1[coord][0] > planet2[coord][0]) {
    planet1[coord][1]--;
    planet2[coord][1]++;
  } else if (planet1[coord][0] < planet2[coord][0]) {
    planet1[coord][1]++;
    planet2[coord][1]--;
  }
  return { planet1, planet2 };
};

const applyGravity = (planetArray, coord) => {
  for (let i = 0; i < planetArray.length - 1; i++) {
    for (let j = i + 1; j < planetArray.length; j++) {
      let { planet1, planet2 } = adjustVelocities(planetArray[i], planetArray[j], coord);
      planetArray[i] = planet1;
      planetArray[j] = planet2;
    }
  }
  return planetArray;
}

const applyVelocity = (planetArray, coord) => {
  for (let i = 0; i < planetArray.length; i++) {
    planetArray[i][coord][0] += planetArray[i][coord][1];
  }
  return planetArray;
}

const calculateEnergy = planetArray => {
  let totalEnergy = 0;
  for (let i = 0; i < planetArray.length; i++) {
    let potentialE = Math.abs(planetArray[i].x[0]) + Math.abs(planetArray[i].y[0]) + Math.abs(planetArray[i].z[0]);
    let kineticE = Math.abs(planetArray[i].x[1]) + Math.abs(planetArray[i].y[1]) + Math.abs(planetArray[i].z[1]);
    totalEnergy += (potentialE * kineticE);
  }
  return totalEnergy;
}

// run to solve part 1
const predictPositions = async (steps) => {
  let planetArray = await getInputArray();
  let dimensionArray = ['x', 'y', 'z'];
  let stepsCompleted = 0;
  while (stepsCompleted < steps) {
    for (let i = 0; i < dimensionArray.length; i++) {
      planetArray = applyGravity(planetArray, dimensionArray[i]);
      planetArray = applyVelocity(planetArray, dimensionArray[i]);
    }
    stepsCompleted++;
  }
  let totalEnergy = calculateEnergy(planetArray);
  console.log('total energy is', totalEnergy);
  return planetArray;
};

const findRepeat = (planetArray, coord) => {
  let newArray = [];
  for (let i = 0; i < planetArray.length; i++) {
    let planetObj = { [coord]: planetArray[i][coord] };
    newArray.push(planetObj);
  }
  let states = [];
  let foundRepeat = false;
  let steps = 0;
  states.push(JSON.stringify(newArray));
  while (!foundRepeat) {
    newArray = applyGravity(newArray, coord);
    newArray = applyVelocity(newArray, coord);
    steps++;
    if (states.includes(JSON.stringify(newArray))) {
      foundRepeat = true;
      console.log(`${steps} steps needed to repeat ${coord} coord`);
      return steps;
    } else {
      states.push(JSON.stringify(newArray));
    }
  }
};

const leastCommonMultiple = (num1, num2, num3) => {
  let multiple = 1;
  let LCMfound = false;
  while (!LCMfound) {
    if (multiple % num1 === 0 && multiple % num2 === 0 && multiple % num3 === 0) {
      LCMfound = true;
      return multiple;
    } else {
      multiple++;
    }
  }
}

// run to solve part 2
const findRepeatedState = async () => {
  let planetArray = await getInputArray();
  let xSteps = findRepeat(planetArray, 'x');
  let ySteps = findRepeat(planetArray, 'y');
  let zSteps = findRepeat(planetArray, 'z');
  console.log('total steps:', leastCommonMultiple(xSteps, ySteps, zSteps));
}

// predictPositions(1000);
findRepeatedState();
