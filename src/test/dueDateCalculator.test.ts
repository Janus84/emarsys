import { assert } from "chai";
import { DueDateCalculator } from "../DueDateCalculator.js";

const dueDateCalculator = new DueDateCalculator();

describe('DueDateCalculator', function () {
    it('should throw an error when submit is invalid Date object', function () {
        const resultValue = () => dueDateCalculator.calculateDueDate(new Date('a'), 1);
        assert.throws(resultValue), TypeError;
    });

    it('should throw an error when turnaround is zero or negative', function () {
        const resultValue = () => dueDateCalculator.calculateDueDate(new Date, 0);
        assert.throws(resultValue, Error);
    });

    it('should throw an error when turnaround not an integer', function () {
        const resultValue = () => dueDateCalculator.calculateDueDate(new Date, 1.4);
        assert.throws(resultValue, Error);
    });

    it('should ', function () {

    });
});