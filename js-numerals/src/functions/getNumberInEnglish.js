const uniques = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelwe', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = [undefined, undefined, 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const magnitudeNames = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion'];

const getNumberInEnglish = number => {
    let numberInEnglish = '';

    numberInEnglish = isTooLarge(number)
        ? numberInEnglish = 'Too large number. Sorry, I only translate between +/- 1 quintillion.'
        : isNegative(number)
        ? numberInEnglish = 'minus ' + translate(number.slice(1, number.length))
        : numberInEnglish = translate(number)

    return numberInEnglish;
}

const translate = number => {
    let numberInEnglish = '';

    parseInt(number) >= 2000
        ? numberInEnglish = addAnd(addMagnitudeSizes(translateSlices(sliceNumberByMagnitudes(number)))).join(' ').trim()
        : numberInEnglish = translateUnderTwoThousand(parseInt(number));

    return numberInEnglish;
}

const translateUnderTwoThousand = number => {
    let underTwoThousand = '';

    if (number > 99) {
        const hundreds = Math.floor(number / 100);
        underTwoThousand += uniques[hundreds] + ' hundred';
        if (number - hundreds * 100 === 0) {
            return underTwoThousand;
        } else {
            number -= hundreds * 100;
            underTwoThousand += ' and ' + translateUnderHundred(number)
        };
    } else {
        underTwoThousand = translateUnderHundred(number);
    }

    return underTwoThousand;
}

const translateUnderHundred = number => {
    let underHundred = '';

    if (number < 20) {
        underHundred += uniques[number];
    } else if (number % 10 === 0) {
        underHundred += tens[number / 10];
    } else {
        underHundred += tens[(number - number % 10) / 10] + '-' + uniques[number % 10];
    }

    return underHundred;
}

const sliceNumberByMagnitudes = number => {
    const magnitudeSlices = [];
    const thousandMagnitudeSize = 3;
    const sliceFirstMagnitudeInNumber = number.length % thousandMagnitudeSize;
    let actualHundred = '';
    let counter = 0;

    if (sliceFirstMagnitudeInNumber !== 0) {
        actualHundred += number.slice(0, sliceFirstMagnitudeInNumber);
        magnitudeSlices.push(actualHundred);
        actualHundred = '';
    }
    
    for (let i = sliceFirstMagnitudeInNumber; i <= number.length; i++) {
        actualHundred += number[i];
        counter++;
        if (counter === 3) {
            magnitudeSlices.push(actualHundred);
            actualHundred = '';
            counter = 0;
        }
    }

    return magnitudeSlices;
}

const translateSlices = magnitudeSlices => {
    return magnitudeSlices.map(element =>
        element = translateUnderTwoThousand(parseInt(element)));
}

const addMagnitudeSizes = translatedSlices => {
    const translatedSlicesWithMagnitudes = [];

    translatedSlices.forEach((element, index) => {
        if (element !== 'zero') {
            element += ' ' + magnitudeNames[translatedSlices.length - index - 1];
            translatedSlicesWithMagnitudes.push(element);
        }
    })

    return translatedSlicesWithMagnitudes;
}

const addAnd = translatedSlicesWithMagnitudes => {
    if (translatedSlicesWithMagnitudes.length > 1
        &&!translatedSlicesWithMagnitudes[translatedSlicesWithMagnitudes.length - 1].includes('hundred'))
        {
        translatedSlicesWithMagnitudes
            .push(translatedSlicesWithMagnitudes[translatedSlicesWithMagnitudes.length - 1]);
        translatedSlicesWithMagnitudes[translatedSlicesWithMagnitudes.length - 2] = 'and';
    }

    return translatedSlicesWithMagnitudes;
}

const isNegative = number => {
    return number[0] === '-';
}

const isTooLarge = number => {
    return Math.abs(parseInt(number)) >= 10 ** 18 ? true : false;
}

module.exports.getNumberInEnglish = getNumberInEnglish;
module.exports.sliceNumberByMagnitudes = sliceNumberByMagnitudes;
module.exports.translateSlices = translateSlices;