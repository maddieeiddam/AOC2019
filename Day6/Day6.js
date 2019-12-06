const fs = require('fs-extra');
const path = require('path');

const getInputArray = async () => {
  const input = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  let inputArray = input.split('\n');
  return inputArray;
};

const countOrbits = (target, orbitObj, count) => {
	if (!orbitObj[target]) {
		return count;
	} else {
		count++;
		return countOrbits(orbitObj[target], orbitObj, count);
	}
}

const listParents = (target, orbitObj, parentArray) => {
	if (!orbitObj[target]) {
		return parentArray;
	} else {
		parentArray.push(orbitObj[target]);
		return listParents(orbitObj[target], orbitObj, parentArray);
	}
}

const countTransfers = (orbitObj, yourPlanet, santasPlanet) => {
	let yourPlanetParents = listParents(yourPlanet, orbitObj, [yourPlanet]);
	let santasPlanetParents = listParents(santasPlanet, orbitObj, [santasPlanet]);
	let minTransfers = (yourPlanetParents.length - 1) + (santasPlanetParents.length - 1); 
	for (let i = 1; i < yourPlanetParents.length; i++) {
		if (santasPlanetParents.includes(yourPlanetParents[i])) {
			if (santasPlanetParents.indexOf(yourPlanetParents[i]) + i < minTransfers) minTransfers = santasPlanetParents.indexOf(yourPlanetParents[i]) + i;
		}
	}
	return minTransfers;

}

const buildOrbits = async () => {
	const map = await getInputArray();
	// const map = ['COM)B', 'B)C', 'C)D', 'D)E', 'E)F', 'B)G', 'G)H', 'D)I', 'E)J', 'J)K', 'K)L', 'K)YOU', 'I)SAN'];
	let orbitObject = {};
	for (let i = 0; i < map.length; i++) {
		let orbit = map[i].split(")");
		orbitObject[orbit[1]] = orbit[0];
	}
	let orbitCount = 0;
	for (let key in orbitObject) {
		orbitCount = countOrbits(key, orbitObject, orbitCount);
	}
	console.log('total orbit count:', orbitCount);

	let transferCount = countTransfers(orbitObject, orbitObject.YOU, orbitObject.SAN, 0);
	console.log('minimum transfer count:', transferCount);
}

buildOrbits();