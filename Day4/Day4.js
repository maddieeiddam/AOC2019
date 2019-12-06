const hasDoubles = str => {
  let blackList = [];
  for (let i = 0; i < str.length - 1; i++) {
    if (blackList.includes(str[i])) continue;
    if (str[i] === str[i + 1]) {
      if (str[i] === str[i + 2]) {
        blackList.push(str[i])
      } else {
        return true;
      }
    }
  }
  return false;
}

const neverDecreases = str => {
  for (let i = 0; i < str.length; i++) {
    if (Number(str[i]) > Number(str[i + 1])) return false;
  }
  return true;
};

const validPassword = int => {
  const stringInt = int.toString();
  if (!hasDoubles(stringInt)) return false;
  if (!neverDecreases(stringInt)) return false;
  return true;
};

const countValidPasswords = (start, end) => {
  let count = 0;
  let current = start;
  while (current <= end) {
    if (validPassword(current)) {
      count++;
    } current++;
  }
  console.log('count', count);
  return count;
}

countValidPasswords(240298, 784956);
