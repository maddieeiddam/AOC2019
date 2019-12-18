/* eslint-disable complexity */
const fs = require('fs-extra');
const path = require('path');

const getInputArray = async () => {
  const input = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  return input.split(',').map(Number);
};

class intcodeComputer {
  constructor(input) {
    this.input = input;
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

  operateAndReplace(array, param1, param2, opcode, address) {
    array[address] = opcode === 1 ? param1 + param2 : param1 * param2;
    return array;
  }

  parseIntcode(pointer, input, codeArray, outputArray) {
    let opcodeObj = this.parseInstruction(codeArray[pointer]);
    switch (opcodeObj.opcode) {
      case 99:
        return outputArray;
      case 3:
        codeArray[codeArray[pointer + 1]] = input;
        return this.parseIntcode(pointer + 2, input, codeArray, outputArray);
      case 4: {
        let output = opcodeObj.mode1 === 0 ? codeArray[codeArray[pointer + 1]] : codeArray[pointer + 1];
        outputArray.push(output);
        return this.parseIntcode(pointer + 2, input, codeArray, outputArray);
      }
      case 5: {
        let nextPointer = pointer + 3;
        let firstArg = opcodeObj.mode1 === 0 ? codeArray[codeArray[pointer + 1]] : codeArray[pointer + 1];
        if (firstArg !== 0) {
          nextPointer = opcodeObj.mode2 === 0 ? codeArray[codeArray[pointer + 2]] : codeArray[pointer + 2];
        }
        return this.parseIntcode(nextPointer, input, codeArray, outputArray);
      }
      case 6: {
        let nextPointer = pointer + 3;
        let firstArg = opcodeObj.mode1 === 0 ? codeArray[codeArray[pointer + 1]] : codeArray[pointer + 1];
        if (firstArg === 0) {
          nextPointer = opcodeObj.mode2 === 0 ? codeArray[codeArray[pointer + 2]] : codeArray[pointer + 2];
        }
        return this.parseIntcode(nextPointer, input, codeArray, outputArray);
      }
      case 7: {
        let num1 = opcodeObj.mode1 === 0 ? codeArray[codeArray[pointer + 1]] : codeArray[pointer + 1];
        let num2 = opcodeObj.mode2 === 0 ? codeArray[codeArray[pointer + 2]] : codeArray[pointer + 2];
        num1 < num2 ? codeArray[codeArray[pointer + 3]] = 1 : codeArray[codeArray[pointer + 3]] = 0;
        return this.parseIntcode(pointer + 4, input, codeArray, outputArray);
      }
      case 8: {
        let num1 = opcodeObj.mode1 === 0 ? codeArray[codeArray[pointer + 1]] : codeArray[pointer + 1];
        let num2 = opcodeObj.mode2 === 0 ? codeArray[codeArray[pointer + 2]] : codeArray[pointer + 2];
        num1 === num2 ? codeArray[codeArray[pointer + 3]] = 1 : codeArray[codeArray[pointer + 3]] = 0;
        return this.parseIntcode(pointer + 4, input, codeArray, outputArray);
      }
      default: {
        let param1 = opcodeObj.mode1 === 0 ? codeArray[codeArray[pointer + 1]] : codeArray[pointer + 1];
        let param2 = opcodeObj.mode2 === 0 ? codeArray[codeArray[pointer + 2]] : codeArray[pointer + 2];
        let address =  codeArray[pointer + 3];
        let newArray = this.operateAndReplace(codeArray, param1, param2, opcodeObj.opcode, address);
        return this.parseIntcode(pointer + 4, input, newArray, outputArray);
      }
    }
  }

  async aggregateOutput() {
    const inputArray = await getInputArray();
    // const inputArray = [3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0];
    let output = this.parseIntcode(0, 1, inputArray, []);
    return output;
  }


}

const computer = new intcodeComputer(5);
const output = computer.output;
output.then(function(result) {
  console.log('output:', result);
})

// 	aggregateOutput() {
// 		// const inputArray = await getInputArray();
// 		const inputArray = [3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0];
// 		let output1 = this.parseIntcode(0, this.phase, inputArray);
// 		console.log('output1', output1);
// 		let output2 = this.parseIntcode(0, this.input, output1.code);
// 		console.log('output2', output2);
// 		return this.outputArray;
// 	}
// }

const getPermutations = string => {
	let resultsArr = [];
	if (string.length === 1) {
		resultsArr.push(string);
		return resultsArr;
	} else {
		for (let i = 0; i < string.length; i++) {
			let char1 = string[i];
			let charsLeft = string.substring(0, i) + string.substring(i + 1);
			let permutations = getPermutations(charsLeft);
			for (let j = 0; j < permutations.length; j++) {
				resultsArr.push(char1 + permutations[j]);
			}
		}
	}
	return resultsArr;
}

const runPhaseSetting = (initialInput, settingStr) => {
	let inputArr = [initialInput];
	let settingArr = settingStr.split('');
	for (let i = 0; i < settingArr.length; i++) {
		const amplifier = new intcodeComputer(settingArr[i], inputArr[i], []);
		const output = amplifier.output;
		console.log('output:', output);
		inputArr.push(output);
	}
	return inputArr[inputArr.length - 1];
}

const calculateMaxSignal = initialInput => {
	let settingOptions = getPermutations('01234');
	let maxSignal = 0;
	let maxInput = null;
	for (let i = 0; i < settingOptions.length; i++) {
		let signal = runPhaseSetting(initialInput, settingOptions[i]);
		if (signal > maxSignal) {
			maxSignal = signal;
			maxInput = settingOptions[i];
		}
	}
	return maxInput;
}

// console.log(calculateMaxSignal(0));
// const amplifier = new intcodeComputer(4, 0, []);
// console.log(amplifier.output);
