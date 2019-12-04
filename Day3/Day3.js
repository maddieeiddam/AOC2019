const fs = require('fs-extra');
const path = require('path');

const getInputArray = async () => {
  const input = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  return input.split('\n');
};

const layWire = (currX, currY, pathArray, pathHistory) => {
  if (pathArray.length === 0) {
    return pathHistory;
  } else {
    let currStep = pathArray.shift();
    let direction = currStep.substring(0, 1);
    let distance = Number(currStep.substring(1, currStep.length));
    let newX = currX;
    let newY = currY;
    if (direction === 'R') {
      for (let i = 0; i < distance; i++) {
        newX++;
        pathHistory.push(newX.toString() + ',' + newY.toString());
      }
    } else if (direction === 'L') {
      for (let i = 0; i < distance; i++) {
        newX--;
        pathHistory.push(newX.toString() + ',' + newY.toString());
      }
    } else if (direction === 'U') {
      for (let i = 0; i < distance; i++) {
        newY++;
        pathHistory.push(newX.toString() + ',' + newY.toString());
      }
    } else if (direction === 'D') {
      for (let i = 0; i < distance; i++) {
        newY--;
        pathHistory.push(newX.toString() + ',' + newY.toString());
      }
  } else {
    console.log('unknown direction!');
  }
  return layWire(newX, newY, pathArray, pathHistory);
  }
}

const findTargetIntersection = (intArr, stepArr) => {
  let shortestDistance = null;
  let fewestSteps = null;
  for (const i in intArr) {
    let coord = intArr[i];
    let xCoord = Number(coord.split(',')[0]);
    let yCoord = Number(coord.split(',')[1]);
    let distance = Math.abs(xCoord) + Math.abs(yCoord);
    if (!shortestDistance || shortestDistance > distance) {
      shortestDistance = distance;
    }
  }
  for (const j in stepArr) {
    if (!fewestSteps || fewestSteps > stepArr[j]) {
      fewestSteps = stepArr[j];
    }
  }
  console.log('shortest distance:', shortestDistance);
  console.log('fewest steps:', fewestSteps);
};

const compareWires = (wire1, wire2) => {
  let intersections = [];
  let steps = [];
  for (let i = 0; i < wire1.length; i++) {
    let target = wire1[i];
    if (wire2.indexOf(target) !== -1) {
      intersections.push(target);
      steps.push(i + wire2.indexOf(target));
    }
  }
  return findTargetIntersection(intersections, steps);
};

const splitPaths = async () => {
  const splitArray = await getInputArray();
  const path1 = splitArray[0].split(',');
  const path2 = splitArray[1].split(',');

  const wire1 = layWire(0, 0, path1, ['0,0']);
  const wire2 = layWire(0, 0, path2, ['0, 0']);

  compareWires(wire1, wire2);
};

splitPaths();
