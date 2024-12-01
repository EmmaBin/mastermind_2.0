export default function checkAgainstCodes(secretCodes, currentGuess) {
    let correctNumber = 0
    let correctLocation = 0
    let tempDict = {}

    for (const number of secretCodes) {
        tempDict[number] = 0
    }
    for (const number of secretCodes) {
        tempDict[number]++
    }

    for (let i = 0; i < currentGuess.length; i++) {
        const currentNumber = currentGuess[i]
        if (currentNumber in tempDict && tempDict[currentNumber] > 0) {
            correctNumber++;
            tempDict[currentNumber]--
        }

        if (currentNumber === secretCodes[i]) {
            correctLocation++
        }
    }


    return { correctNumber, correctLocation }
}