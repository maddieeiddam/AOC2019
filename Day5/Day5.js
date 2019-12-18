/* eslint-disable complexity */
const fs = require('fs-extra');
const path = require('path');

class intcodeComputer {
  constructor(program, input) {
    this.input = input;
    this.codeArray = program;
    this.outputArray = [];
  }

  get output() {
    return this.aggregateOutput();
  }

  parseInstruction(int) {
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

  operateAndReplace(param1, param2, opcode, address) {
    this.codeArray[address] = opcode === 1 ? param1 + param2 : param1 * param2;
  }

  parseIntcode(pointer, input, outputArray) {
    let opcodeObj = this.parseInstruction(this.codeArray[pointer]);
    switch (opcodeObj.opcode) {
      case 99:
        return this.outputArray;
      case 3:
        this.codeArray[this.codeArray[pointer + 1]] = input;
        return this.parseIntcode(pointer + 2, input, outputArray);
      case 4: {
        let output = opcodeObj.mode1 === 0 ? this.codeArray[this.codeArray[pointer + 1]] : this.codeArray[pointer + 1];
        this.outputArray.push(output);
        return this.parseIntcode(pointer + 2, input, outputArray);
      }
      case 5: {
        let nextPointer = pointer + 3;
        let firstArg = opcodeObj.mode1 === 0 ? this.codeArray[this.codeArray[pointer + 1]] : this.codeArray[pointer + 1];
        if (firstArg !== 0) {
          nextPointer = opcodeObj.mode2 === 0 ? this.codeArray[this.codeArray[pointer + 2]] : this.codeArray[pointer + 2];
        }
        return this.parseIntcode(nextPointer, input, outputArray);
      }
      case 6: {
        let nextPointer = pointer + 3;
        let firstArg = opcodeObj.mode1 === 0 ? this.codeArray[this.codeArray[pointer + 1]] : this.codeArray[pointer + 1];
        if (firstArg === 0) {
          nextPointer = opcodeObj.mode2 === 0 ? this.codeArray[this.codeArray[pointer + 2]] : this.codeArray[pointer + 2];
        }
        return this.parseIntcode(nextPointer, input, outputArray);
      }
      case 7: {
        let num1 = opcodeObj.mode1 === 0 ? this.codeArray[this.codeArray[pointer + 1]] : this.codeArray[pointer + 1];
        let num2 = opcodeObj.mode2 === 0 ? this.codeArray[this.codeArray[pointer + 2]] : this.codeArray[pointer + 2];
        num1 < num2 ? this.codeArray[this.codeArray[pointer + 3]] = 1 : this.codeArray[this.codeArray[pointer + 3]] = 0;
        return this.parseIntcode(pointer + 4, input, outputArray);
      }
      case 8: {
        let num1 = opcodeObj.mode1 === 0 ? this.codeArray[this.codeArray[pointer + 1]] : this.codeArray[pointer + 1];
        let num2 = opcodeObj.mode2 === 0 ? this.codeArray[this.codeArray[pointer + 2]] : this.codeArray[pointer + 2];
        num1 === num2 ? this.codeArray[this.codeArray[pointer + 3]] = 1 : this.codeArray[this.codeArray[pointer + 3]] = 0;
        return this.parseIntcode(pointer + 4, input, outputArray);
      }
      default: {
        let param1 = opcodeObj.mode1 === 0 ? this.codeArray[this.codeArray[pointer + 1]] : this.codeArray[pointer + 1];
        let param2 = opcodeObj.mode2 === 0 ? this.codeArray[this.codeArray[pointer + 2]] : this.codeArray[pointer + 2];
        let address =  this.codeArray[pointer + 3];
        this.operateAndReplace(param1, param2, opcodeObj.opcode, address);
        this.parseIntcode(pointer + 4, input, outputArray);
      }
    }
  }

  aggregateOutput() {
    this.parseIntcode(0, this.input, []);
    return this.outputArray;
  }


}

const runProgram = async (input) => {
  const programStr = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const program = programStr.split(',').map(Number);

  const computer = new intcodeComputer(program, input);
  const output = computer.output;
  console.log('output', output);
};

runProgram(5);
