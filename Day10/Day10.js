const fs = require('fs-extra');
const path = require('path');

let testArray1 = ['.#..#', '.....', '#####', '....#', '...##'];
let solution1 = {coordinates: '(3,4)', asteroidsVisible: 8};

let testArray2 = ['......#.#.', '#..#.#....', '..#######.', '.#.#.###..', '.#..#.....', '..#....#.#', '#..#....#.', '.##.#..###', '##...#..#.', '.#....####'];
let solution2 = {coordinates: '(5,8)', asteroidsVisible: 33};

let testArray3 = ['#.#...#.#.', '.###....#.', '.#....#...', '##.#.#.#.#', '....#.#.#.', '.##..###.#', '..#...##..', '..##....##', '......#...', '.####.###.'];
let solution3 = {coordinates: '(1,2)', asteroidsVisible: 35};

let testArray4 = ['.#..#..###', '####.###.#', '....###.#.', '..###.##.#', '##.##.#.#.', '....###..#', '..#.#..#.#', '#..#.#.###', '.##...##.#', '.....#.#..'];
let solution4 = {coordinates: '(6,3)', asteroidsVisible: 41};

let testArray5 = ['.#..##.###...#######', '##.############..##.', '.#.######.########.#', '.###.#######.####.#.', '#####.##.#.##.###.##', 
'..#####..#.#########', '####################', '#.####....###.#.#.##', '##.#################', '#####.##.###..####..', 
'..######..##.#######', '####.##.####...##..#', '.#####..#.######.###', '##...#.##########...', '#.##########.#######', 
'.####.#.###.###.#.##', '....##.##.###..#####', '.#.#.###########.###', '#.#.#.#####.####.###', '###.##.####.##.#..##'];
let solution5 = {coordinates: '(11,13)', asteroidsVisible: 210};




const getInputArray = async () => {
  const input = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  let inputArray = input.split('\n');
  return inputArray;
};

const buildMap = inputArray => {
	let map = [];
	for (let yCoord = 0; yCoord < inputArray.length; yCoord++) {
		let positionArray = inputArray[yCoord].split('');
		map.push(positionArray);
	};
	return map;
}

const buildAsteroidObject = map => {
	const hasAsteroid = (x, y) => {
		if (x >= 0 && x < map[0].length && y >= 0 && y < map.length) {
			if (map[y][x] === '#') return true;
		}
		return false;
	}
	let asteroidArray = [];
	for (let yCoord = 0; yCoord < map.length; yCoord++) {
		for (let xCoord = 0; xCoord < map[yCoord].length; xCoord++) {
			if (hasAsteroid(xCoord, yCoord)) {
				asteroidObject = {coordinates: [xCoord, yCoord], asteroidsVisible: null};
				asteroidArray.push(asteroidObject);
			}
		}
	}
	return asteroidArray;
}

const buildLine = (coord1, coord2) => {
	if (coord1[0] === coord2[0] && coord1[1] === coord2[1]) {
		return '1';
	} else {
		let slope = (coord2[1] - coord1[1]) / (coord2[0] - coord1[0]);
		let yInt = coord2[1] - slope * coord2[0];
		return `y=${slope}x+${yInt}`;
	}
}

const isAdjacent = (coord1, coord2) => {
	if (coord1[0] === coord2[0] && Math.abs(coord1[1] - coord2[1]) === 1) {
		return true;
	} else if (coord1[1] === coord2[1] && Math.abs(coord1[0] - coord2[0]) === 1) {
		return true;
	} else if (Math.abs(coord1[0] - coord2[0]) && Math.abs(coord1[1] - coord2[1])) {
		return true;
	} else if (Math.abs(coord1[1] - coord2[1]) && Math.abs(coord1[0] - coord2[0])) {
		return true;
	} return false;
}

const countVisibleAsteroids = async () => {
	// let input = await getInputArray();
	let input = testArray1;
	let map = buildMap(input);
	let asteroidArray = buildAsteroidObject(map);
	let maxVisible = 0;
	let bestOption = null;

	for (let i = 0; i < asteroidArray.length; i++) {
		let visibleAsteroids = 0;
		let lineArray = [];
		let visibleArray = [];
		// loop once to tally up all adjacent asteroids
		for (let j = 0; j < asteroidArray.length; j++) {
			if (isAdjacent(asteroidArray[i].coordinates, asteroidArray[j].coordinates)) {
				let lineStr = buildLine(asteroidArray[i].coordinates, asteroidArray[j].coordinates);
				lineArray.push(lineStr);
				visibleArray.push(`(${asteroidArray[j].coordinates})`);
				visibleAsteroids++;
			}
		}
		// loop through again to check if any other asteroids are visible
		for (let k = 0; k < asteroidArray.length; k++) {
			let lineStr = buildLine(asteroidArray[i].coordinates, asteroidArray[k].coordinates);
			if (!visibleArray.includes(`${asteroidArray[k].coordinates}`) && !lineArray.includes(lineStr) && asteroidArray[i].coordinates !== asteroidArray[k].coordinates) {
				lineArray.push(lineStr);
				visibleArray.push(`${asteroidArray[k].coordinates}`);
				visibleAsteroids++;
			}
		}
		asteroidArray[i].asteroidsVisible = visibleAsteroids;
		if (visibleAsteroids > maxVisible) {
			maxVisible = visibleAsteroids;
			bestOption = asteroidArray[i].coordinates;
		}
		console.log(`asteroid at ${asteroidArray[i].coordinates} can see ${visibleAsteroids} asteroids: ${visibleArray} with equations ${lineArray}`);
	}
	console.log(`best option is at ${bestOption} where ${maxVisible} asteroids are visible.`);

};

countVisibleAsteroids();
























































