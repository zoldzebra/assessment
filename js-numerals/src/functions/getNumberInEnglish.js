// 7    == seven
// 42   == forty-two
// 2001 == two thousand and one
// 1999 == nineteen hundred and ninety-nine
// 17999 == seventeen thousand nine hundred and ninety-nine

const uniques = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelwe', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = [undefined, undefined, 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const getNumberInEnglish = number => translateUnderHundred(number);

const translateUnderHundred = (number) => {
    number = parseInt(number);
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

module.exports = getNumberInEnglish;