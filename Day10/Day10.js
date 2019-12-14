const fs = require('fs-extra');
const path = require('path');

const getInputArray = async () => {
  const input = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  let inputArray = input.split('\n');
  return inputArray;
};

const countVisibleAsteroids = async () => {
	let input = await getInputArray();
	console.log(input);
};

countVisibleAsteroids();

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
let solution4 = {coordinates: '(11,13)', asteroidsVisible: 210};
























































