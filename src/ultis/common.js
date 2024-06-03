export const getNumberFromString = (string) => {
    let number = 0;
    const matchResult = string.match(/\d+/);
    if (matchResult !== null) {
        const extractedNumber = +matchResult[0];
        if (string.includes('đồng/tháng')) {
            number = extractedNumber / Math.pow(10, 3);
        } else if (string.includes('triệu/tháng')) {
            number = extractedNumber;
        } else if (string.includes('m')) {
            number = extractedNumber;
        }
    }
    return number;
}

export const getNumberFromStringV2 = (string) => {
    let number = 0;
    if (string.includes('đồng/tháng')) {
        const matchResult = string.match(/\d+/);
        if (matchResult !== null) {
            number = +matchResult[0] / Math.pow(10, 3);
        }
    } else if (string.includes('triệu/tháng')) {
        const firstWord = string.split(' ')[0];
        number = +firstWord;
    } else if (string.includes('m')) {
        const matchResult = string.match(/\d+/);
        if (matchResult !== null) {
            number = +matchResult[0];
        }
    }
    return number;
}
