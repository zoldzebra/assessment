const assert = require('assert');
const chai = require('chai');
const expect = require('chai').expect;
const {getNumberInEnglish} = require('../src/functions/getNumberInEnglish');
const {magnitudeSlicesToArray} = require('../src/functions/getNumberInEnglish');
const {translateMagnitudeSlices} = require('../src/functions/getNumberInEnglish');
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
});
describe('magnitudeSlice array tests', () => {
    it('should return an array', () => {
        expect(magnitudeSlicesToArray('1213412')).to.be.an.instanceOf(Array);
    });
    it('should create an array with 1 element below 1000', () => {
        expect(magnitudeSlicesToArray('1')).to.have.members(['1']);
        expect(magnitudeSlicesToArray('145')).to.have.members(['145']);
    });
    it('should create an array with 3 ordered and correct element for 123456789', () => {
        expect(magnitudeSlicesToArray('123456789')).to.have.ordered.members(['123', '456', '789']);
    });
});
describe('translateMagnitudeSlice array tests', () => {
    it('should return an array', () => {
        expect(translateMagnitudeSlices(magnitudeSlicesToArray('123456789'))).to.be.an.instanceOf(Array);
    });
    it('should create correct translations for each element', () => {
        expect(translateMagnitudeSlices(['3'])).to.have.members(['three']);
        expect(translateMagnitudeSlices(['12', '345'])).to.have.members(['twelwe', 'three hundred and forty-five']);
    });
});