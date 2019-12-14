const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const getInputArray = async () => {
  const input = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  return input.split('\n')[0];
};

const buildLayer = (width, height, chars) => {
  let startIndex = 0;
  let layer = [];
  for (let i = 0; i < height; i++) {
    let row = chars.slice(startIndex, startIndex + width);
    startIndex += width;
    layer.push(row);
  }
  return layer;
}

const countZeros = layer => {
  let zeroCount = 0;
  for (let j = 0; j < layer.length; j++) {
    for (let k = 0; k < layer[j].length; k++) {
      if (layer[j][k] === '0') zeroCount++;
    }
  }
  return zeroCount;
}

const findTargetLayer = layerArray => {
  let fewestZeros = countZeros(layerArray[0]);
  let fewestZeroLayer = layerArray[0];
  for (let i = 1; i < layerArray.length; i++) {
    let zeroCount = countZeros(layerArray[i]);
    if (zeroCount < fewestZeros) {
      fewestZeros = zeroCount;
      fewestZeroLayer = layerArray[i];
    }
  }
  return fewestZeroLayer;
}

const countDigits = (layer, digit) => {
  let count = 0;
  for (let i = 0; i < layer.length; i++) {
    for (let j = 0; j < layer[i].length; j++) {
      if (layer[i][j] === digit) count++;
    }
  }
  return count;
}

const drawImage = (layerArray, width, height) => {
  let finalImage = [];
  for (let i = 0; i < height; i++) {
    let row = []
    for (let j = 0; j < width; j++) {
      row.push(layerArray[0][i][j]);
    }
    finalImage.push(row);
  }
  layerArray.forEach(layer => {
    for (let i = 0; i < layer.length; i++) {
      for (let j = 0; j < layer[i].length; j++) {
        if (finalImage[i][j] === '2') {
          finalImage[i][j] = layer[i][j];
        }
      }
    }
  })
  finalImage.forEach(row => {
    for (let i = 0; i < row.length; i++) {
      if (row[i] === '0') {
        row[i] = chalk.black(0);
      } else if (row[i] === '1') {
        row[i] = chalk.white.bgWhite(1);
      } else if (row[i] === '2') {
        row[i] = chalk.hidden(2);
      }
    }
    row.join();
    console.log(`${row}`);
  })
}

const decodePassword = async (width, height) => {
  let input = await getInputArray();
  let layerChars = width * height;
  let startIndex = 0;
  let layerArray = [];
  for (let i = 0; i < input.length / layerChars; i++) {
    let chars = input.slice(startIndex, startIndex + layerChars);
    startIndex += layerChars;
    let layer = buildLayer(width, height, chars);
    layerArray.push(layer);
  }
  drawImage(layerArray, width, height);
  let targetLayer = findTargetLayer(layerArray);
  let oneCount = countDigits(targetLayer, '1');
  let twoCount = countDigits(targetLayer, '2');
  console.log('solution:', oneCount * twoCount);
}

decodePassword(25, 6);
