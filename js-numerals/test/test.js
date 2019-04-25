const expect = require('chai').expect;
const {getNumberInEnglish} = require('../src/functions/getNumberInEnglish');
const {sliceNumberByMagnitudes} = require('../src/functions/getNumberInEnglish');
const {translateSlices} = require('../src/functions/getNumberInEnglish');
// 7    == seven
// 42   == forty-two
// 2001 == two thousand and one
// 1999 == nineteen hundred and ninety-nine
// 17999 == seventeen thousand nine hundred and ninety-nine

describe('Translation tests', () => {
    it('should translate under 10', () => {
        expect(getNumberInEnglish('7')).to.equal('seven');
    });
    it('should translate under 20', () => {
        expect(getNumberInEnglish('16')).to.equal('sixteen');
    });
    it('should translate under 100', () => {
        expect(getNumberInEnglish('42')).to.equal('forty-two');
    });
    it('should discard zeros in the beginning of number', () => {
        expect(getNumberInEnglish('00013')).to.equal('thirteen');
    });
    it('should translate under 2000', () => {
        expect(getNumberInEnglish('1999')).to.equal('nineteen hundred and ninety-nine');
    });
    it('should translate over 2000', () => {
        expect(getNumberInEnglish('2001')).to.equal('two thousand and one');
        expect(getNumberInEnglish('17999')).to.equal('seventeen thousand nine hundred and ninety-nine');
    });
    it('should translate 0 as silent when has 0 of that magnitude (like 2000, 12000123)', () => {
        expect(getNumberInEnglish('2000')).to.equal('two thousand');
        expect(getNumberInEnglish('2000000')).to.equal('two million');
        expect(getNumberInEnglish('12000123')).to.equal('twelwe million one hundred and twenty-three');
    });
    it('should use \'and\' if there are 0 hundreds but there are tens or ones (like 70001, 12000023)', () => {
        expect(getNumberInEnglish('12000023')).to.equal('twelwe million and twenty-three');
        expect(getNumberInEnglish('70001')).to.equal('seventy thousand and one');
    });
    it('should work with negative numbers', () => {
        expect(getNumberInEnglish('-1999')).to.equal('minus nineteen hundred and ninety-nine');
        expect(getNumberInEnglish('-2001')).to.equal('minus two thousand and one');
        expect(getNumberInEnglish('-12000023')).to.equal('minus twelwe million and twenty-three');
        expect(getNumberInEnglish('-70001')).to.equal('minus seventy thousand and one');
        expect(getNumberInEnglish('-1234567890123456789')).to.equal('Too large number. Sorry, I only translate between +/- 1 quintillion.');
    });
});
describe('magnitudeSlice array tests', () => {
    it('should return an array', () => {
        expect(sliceNumberByMagnitudes('1213412')).to.be.an.instanceOf(Array);
    });
    it('should create an array with 1 element below 1000', () => {
        expect(sliceNumberByMagnitudes('1')).to.have.members(['1']);
        expect(sliceNumberByMagnitudes('145')).to.have.members(['145']);
    });
    it('should create an array with 3 ordered and correct element for 123456789', () => {
        expect(sliceNumberByMagnitudes('123456789')).to.have.ordered.members(['123', '456', '789']);
    });
});
describe('translateSlices array tests', () => {
    it('should return an array', () => {
        expect(translateSlices(sliceNumberByMagnitudes('123456789'))).to.be.an.instanceOf(Array);
    });
    it('should create correct translations for each element', () => {
        expect(translateSlices(['3'])).to.have.members(['three']);
        expect(translateSlices(['12', '345'])).to.have.members(['twelwe', 'three hundred and forty-five']);
    });
});