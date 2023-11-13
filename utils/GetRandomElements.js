export default function getThreeRandomElements(inputArray) {
  if (inputArray.length < 3) {
    throw new Error("Input array must contain at least 3 elements");
  }

  const randomElements = [];

  while (randomElements.length < 3) {
    const randomIndex = Math.floor(Math.random() * inputArray.length);
    const randomElement = inputArray[randomIndex];

    if (!randomElements.includes(randomElement)) {
      randomElements.push(randomElement);
    }
  }

  return randomElements;
}
