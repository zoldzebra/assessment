const assert = require('assert');
const chai = require('chai');
const expect = require('chai').expect;
const getNumberInEnglish = require('../src/functions/getNumberInEnglish');
// 7    == seven
// 42   == forty-two
// 2001 == two thousand and one
// 1999 == nineteen hundred and ninety-nine
// 17999 == seventeen thousand nine hundred and ninety-nine

describe('JS numerals tests', () => {
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
});