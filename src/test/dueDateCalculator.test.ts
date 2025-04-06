import { assert } from "chai";
import { DueDateCalculator } from "../DueDateCalculator.js";

class MockDueDateCalculator extends DueDateCalculator {
    public testIsWorkDay(date: Date): boolean {
        return this.isWorkDay(date);
    }

    public testIsWorkHour(date: Date): boolean {
        return this.isWorkHour(date);
    }

    public testGetNextWorkStartAfterDate(date: Date): Date{
        return this.getNextWorkStartAfterDate(date);
    }
}

const dueDateCalculator = new DueDateCalculator();
const mockDueDateCalculator = new MockDueDateCalculator();

describe('DueDateCalculator error handling', function () {
    it('should throw an error when submit is invalid Date object', function () {
        const resultValue = () => dueDateCalculator.calculateDueDate(new Date('a'), 1);
        assert.throws(resultValue), TypeError;
    });

    it('should throw an error when turnaround is less than 1', function () {
        const resultValue = () => dueDateCalculator.calculateDueDate(new Date, 0);
        assert.throws(resultValue, TypeError);
    });

    it('should throw an error when turnaround not an integer', function () {
        const resultValue = () => dueDateCalculator.calculateDueDate(new Date, 1.4);
        assert.throws(resultValue, TypeError);
    });
});

describe('DueDateCalculator work hours and work days borderline cases', function () {
    it('should work day before weekend', function () {
        assert.isTrue(mockDueDateCalculator.testIsWorkDay(new Date(2025, 0, 3, 23, 59, 59)))
    });

    it('should work day after weekend', function () {
        assert.isTrue(mockDueDateCalculator.testIsWorkDay(new Date(2025, 0, 6, 0, 0, 0)))
    });

    it('should not work day start of weekend', function () {
        assert.isFalse(mockDueDateCalculator.testIsWorkDay(new Date(2025, 0, 4, 0, 0, 0)))
    });

    it('should not work day end of weekend', function () {
        assert.isFalse(mockDueDateCalculator.testIsWorkDay(new Date(2025, 0, 5, 23, 59, 59)))
    });

    it('should work time 09:00:00', function () {
        assert.isTrue(mockDueDateCalculator.testIsWorkHour(new Date(2025, 0, 1, 9, 0, 0)))
    });

    it('should work time 16:59:59', function () {
        assert.isTrue(mockDueDateCalculator.testIsWorkHour(new Date(2025, 0, 1, 16, 59, 59)))
    });

    it('should not work time 08:59:59', function () {
        assert.isFalse(mockDueDateCalculator.testIsWorkHour(new Date(2025, 0, 1, 8, 59, 59)))
    });

    it('should not work time 17:00:00', function () {
        assert.isFalse(mockDueDateCalculator.testIsWorkHour(new Date(2025, 0, 1, 17, 0, 0)))
    });
});

describe('DueDateCalculator calculateDueDate cases', function () {
    it('should add 1 hour whitout change the day', function () {
        const resultValue = dueDateCalculator.calculateDueDate(new Date(2025, 0, 1, 9, 0, 0), 1);
        const expectedValue = new Date(2025, 0, 1, 10, 0, 0);
        assert.strictEqual(resultValue.getTime(), expectedValue.getTime());
    });

    it('should add 1 hour and move to the next day', function () {
        const resultValue = dueDateCalculator.calculateDueDate(new Date(2025, 0, 1, 16, 30, 0), 1);
        const expectedValue = new Date(2025, 0, 2, 9, 30, 0);
        assert.strictEqual(resultValue.getTime(), expectedValue.getTime());
    });

    it('should add 1 hour and skip the weekend', function () {
        const resultValue = dueDateCalculator.calculateDueDate(new Date(2025, 0, 3, 16, 30, 0), 1);
        const expectedValue = new Date(2025, 0, 6, 9, 30, 0);
        assert.strictEqual(resultValue.getTime(), expectedValue.getTime());
    });

    it('should add 9 hour and skip the weekend and move to the next day', function () {
        const resultValue = dueDateCalculator.calculateDueDate(new Date(2025, 0, 3, 16, 30, 0), 9);
        const expectedValue = new Date(2025, 0, 7, 9, 30, 0);
        assert.strictEqual(resultValue.getTime(), expectedValue.getTime());
    });
});

describe('DueDateCalculator calculate DueDate cases when submit is before or after work time', function () {
    it('should find first work time after date', function () {
        const resultValue = mockDueDateCalculator.testGetNextWorkStartAfterDate(new Date(2025, 0, 4, 8, 12, 5));
        const expectedValue = new Date(2025, 0, 6, 9, 0, 0);
        assert.strictEqual(resultValue.getTime(), expectedValue.getTime());
      })
    
    it('should add 1 hour if submitted before worktime', function () {
        const resultValue = dueDateCalculator.calculateDueDate(new Date(2025, 0, 1, 0, 0, 0), 1);
        const expectedValue = new Date(2025, 0, 1, 10, 0, 0);
        assert.strictEqual(resultValue.getTime(), expectedValue.getTime());
    });

    it('should add 1 hour if submitted after worktime', function () {
        const resultValue = dueDateCalculator.calculateDueDate(new Date(2025, 0, 1, 17, 0, 0), 1);
        const expectedValue = new Date(2025, 0, 2, 10, 0, 0);
        assert.strictEqual(resultValue.getTime(), expectedValue.getTime());
    });
});


