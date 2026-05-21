export function countRemainingErrors(finalInput, targetText) {
  let remaining = 0;
  for (let i = 0; i < finalInput.length; i++) {
    if (finalInput[i] !== targetText[i]) remaining += 1;
  }
  return remaining;
}

export function countOmissionErrors(targetLength, inputLength) {
  return targetLength - inputLength;
}
