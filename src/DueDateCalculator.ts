import { skipIfNotWorkingTime, getNextWorkStartAfterDate, isWorkTime, incrementHours } from "./utils";

interface DueDateCalculatorStrategy {
    addWorkHours(submit: Date, turnaround: number): Date
}

export class SimpleDueDateCalculatorStrategy implements DueDateCalculatorStrategy {
    public addWorkHours(startDate: Date, turnaround: number): Date {
        let targetDate = getNextWorkStartAfterDate(startDate);
        let remainingHours = turnaround;

        while (remainingHours > 0) {
            incrementHours(targetDate);
            if (isWorkTime(targetDate)) {
                remainingHours--;
            }
        }

        return targetDate;
    }
}

export class UpdatedDueDateCalculatorStrategy implements DueDateCalculatorStrategy {
    addWorkHours(startDate: Date, turnaround: number): Date {
        let targetDate = getNextWorkStartAfterDate(startDate);
        let remainingHours = turnaround;

        while (remainingHours > 0) {
            incrementHours(targetDate);
            if (!isWorkTime(targetDate)) {
                targetDate = skipIfNotWorkingTime(targetDate);
            }
            remainingHours--;
        }

        return targetDate;
    }
}

export class DueDateCalculator {

    constructor(
        private dueDateCalculatorStrategy: DueDateCalculatorStrategy = new SimpleDueDateCalculatorStrategy()
    ) { }

    /**
     * Calculates the due date by adding turnaround time to the submit date
     * considering working hours (9AM - 5PM) and skipping weekends.
     * 
     * @param submit Date and time when the task is submitted.
     * @param turnaround  Number of working hours to add to the submit date.
     * @returns The calculated due date, considering working time and weekends.
     * @throws {TypeError} If the 'submit' parameter is not a valid Date object or the 'turnaround' parameter is not a positive integer. 
     */
    public calculateDueDate(submit: Date, turnaround: number): Date {

        if (!(submit instanceof (Date)) || isNaN(submit.getTime())) {
            throw new TypeError('Wrong submit parameter');
        }
        if (typeof (turnaround) != 'number' || turnaround <= 0 || turnaround % 1 !== 0) {
            throw new TypeError('Wrong turnaround parameter');
        }

        const calculatedDueDate = this.dueDateCalculatorStrategy.addWorkHours(submit, turnaround)

        return calculatedDueDate;
    }
}