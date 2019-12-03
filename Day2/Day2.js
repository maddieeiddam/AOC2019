const fs = require('fs-extra');
const path = require('path');

const operateAndReplace = (array, param1, param2, opcode, address) => {
  array[address] = opcode === 1 ? param1 + param2 : param1 * param2;
  return array;
};

const restoreProgram = (codeArray, noun, verb) => {
  codeArray[1] = noun;
  codeArray[2] = verb;
  return codeArray;
};

const parseIntcode = (pointer, codeArray) => {
  if (codeArray[pointer] === 99) {
    return codeArray[0];
  } else {
    let newArray = operateAndReplace(codeArray, codeArray[codeArray[pointer + 1]], codeArray[codeArray[pointer + 2]], codeArray[pointer], codeArray[pointer + 3]);
    return parseIntcode(pointer + 4, newArray);
  }
};

const getInputArray = async () => {
  const input = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  return input.split(',').map(Number);
};

// call this function to solve part 1
const findPositionZero = async () => {
  const inputArray = await getInputArray();
  const restoredProgram = restoreProgram(inputArray, 12, 2);
  console.log('the value at position 0 is', parseIntcode(0, restoredProgram));
}

// call this function to solve part 2
const findTargetInputs = async(target) => {
  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      const inputArray = await getInputArray();
      const restoredProgram = restoreProgram(inputArray, noun, verb);
      const output = parseIntcode(0, restoredProgram);
      if (output === target) {
        console.log('the solution is', 100 * noun + verb);
      }
    }
  }
}

findPositionZero();
findTargetInputs(19690720);
