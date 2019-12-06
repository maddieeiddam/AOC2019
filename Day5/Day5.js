/* eslint-disable complexity */
const fs = require('fs-extra');
const path = require('path');

const getInputArray = async () => {
  const input = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  return input.split(',').map(Number);
};

const operateAndReplace = (array, param1, param2, opcode, address) => {
  array[address] = opcode === 1 ? param1 + param2 : param1 * param2;
  return array;
};

const parseInstruction = int => {
  let stringInt = int.toString();
  if (stringInt.length < 5) {
    while (stringInt.length < 5) {
      stringInt = '0' + stringInt;
    }
  }
  return {
    opcode: Number(stringInt.slice(-2)),
    mode1: Number(stringInt[2]),
    mode2: Number(stringInt[1]),
    mode3: Number(stringInt[0])
  }
}

const parseIntcode = (pointer, input, codeArray, outputArray) => {
  let opcodeObj = parseInstruction(codeArray[pointer]);
  switch (opcodeObj.opcode) {
    case 99:
      return outputArray;
    case 3:
      codeArray[codeArray[pointer + 1]] = input;
      return parseIntcode(pointer + 2, input, codeArray, outputArray);
    case 4: {
      let output = opcodeObj.mode1 === 0 ? codeArray[codeArray[pointer + 1]] : codeArray[pointer + 1];
      outputArray.push(output);
      return parseIntcode(pointer + 2, input, codeArray, outputArray);
    }
    case 5: {
      let nextPointer = pointer + 3;
      let firstArg = opcodeObj.mode1 === 0 ? codeArray[codeArray[pointer + 1]] : codeArray[pointer + 1];
      if (firstArg !== 0) {
        nextPointer = opcodeObj.mode2 === 0 ? codeArray[codeArray[pointer + 2]] : codeArray[pointer + 2];
      }
      return parseIntcode(nextPointer, input, codeArray, outputArray);
    }
    case 6: {
      let nextPointer = pointer + 3;
      let firstArg = opcodeObj.mode1 === 0 ? codeArray[codeArray[pointer + 1]] : codeArray[pointer + 1];
      if (firstArg === 0) {
        nextPointer = opcodeObj.mode2 === 0 ? codeArray[codeArray[pointer + 2]] : codeArray[pointer + 2];
      }
      return parseIntcode(nextPointer, input, codeArray, outputArray);
    }
    case 7: {
      let num1 = opcodeObj.mode1 === 0 ? codeArray[codeArray[pointer + 1]] : codeArray[pointer + 1];
      let num2 = opcodeObj.mode2 === 0 ? codeArray[codeArray[pointer + 2]] : codeArray[pointer + 2];
      num1 < num2 ? codeArray[codeArray[pointer + 3]] = 1 : codeArray[codeArray[pointer + 3]] = 0;
      return parseIntcode(pointer + 4, input, codeArray, outputArray);
    }
    case 8: {
      let num1 = opcodeObj.mode1 === 0 ? codeArray[codeArray[pointer + 1]] : codeArray[pointer + 1];
      let num2 = opcodeObj.mode2 === 0 ? codeArray[codeArray[pointer + 2]] : codeArray[pointer + 2];
      num1 === num2 ? codeArray[codeArray[pointer + 3]] = 1 : codeArray[codeArray[pointer + 3]] = 0;
      return parseIntcode(pointer + 4, input, codeArray, outputArray);
    }
    default: {
      let param1 = opcodeObj.mode1 === 0 ? codeArray[codeArray[pointer + 1]] : codeArray[pointer + 1];
      let param2 = opcodeObj.mode2 === 0 ? codeArray[codeArray[pointer + 2]] : codeArray[pointer + 2];
      let address =  codeArray[pointer + 3];
      let newArray = operateAndReplace(codeArray, param1, param2, opcodeObj.opcode, address);
      return parseIntcode(pointer + 4, input, newArray, outputArray);
    }
  }
};

const aggregateOutput = async () => {
  const inputArray = await getInputArray();
  let output = parseIntcode(0, 5, inputArray, []);
  console.log('output:', output);
};

aggregateOutput();
