// 7    == seven
// 42   == forty-two
// 2001 == two thousand and one
// 1999 == nineteen hundred and ninety-nine
// 17999 == seventeen thousand nine hundred and ninety-nine

const uniques = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelwe', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = [undefined, undefined, 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const getNumberInEnglish = number => {
    translateMagnitudeSlices(magnitudeSlicesToArray(number));
    number = parseInt(number);
    return translateUnderTwoThousand(number);
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
    } else if (number < 100) {
        underHundred += tens[(number - number % 10) / 10] + '-' + uniques[number % 10];
    }
    return underHundred;
}

const magnitudeSlicesToArray = (number) => {
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
    
    for (let i = sliceFirstMagnitudeInNumber + 1; i <= number.length; i++) {     
        actualHundred += number[i - 1];
        counter++;
        if (counter === 3) {
            magnitudeSlices.push(actualHundred);
            actualHundred = '';
            counter = 0;
        }
    }
    return magnitudeSlices;
}

const translateMagnitudeSlices = (magnitudeSlices) => {
    const translatedMagnitudeSlices = [];
    magnitudeSlices.forEach(element => {
        element = translateUnderTwoThousand(parseInt(element));
        translatedMagnitudeSlices.push(element);
    })
    console.log('translatedMagnitudeSlices: ', translatedMagnitudeSlices);
    return translatedMagnitudeSlices;
}

//module.exports = getNumberInEnglish;
module.exports.getNumberInEnglish = getNumberInEnglish;
module.exports.magnitudeSlicesToArray = magnitudeSlicesToArray;
module.exports.translateMagnitudeSlices = translateMagnitudeSlices;