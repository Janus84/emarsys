import { workerData } from "worker_threads";
import { DEFAULT_WORK_HOURS } from "./constans";

interface DueDateCalculator{
    calculateDueDate(submit: Date, turnaround: number): Date;
}

export class SimpleDueDateCalculator implements DueDateCalculator{

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

        let targetDate = this.getNextWorkStartAfterDate(submit);
        let remainingHours = turnaround;

        while (remainingHours > 0) {
            targetDate.setHours(targetDate.getHours() + 1);
            if (this.isWorkTime(targetDate)) {
                remainingHours--;
            }
        }

        return targetDate;
    }

    protected isWorkDay(date: Date): boolean {
        const actualDay = date.getDay();
        return (actualDay != 0 && actualDay != 6)
    }

    protected isWorkHour(date: Date): boolean {
        const actualHour = date.getHours();
        return (actualHour >= DEFAULT_WORK_HOURS.START &&
            actualHour < DEFAULT_WORK_HOURS.END);
    }

    private isWorkTime(date: Date): boolean {
        return (this.isWorkDay(date) && this.isWorkHour(date));
    }

    protected getNextWorkStartAfterDate(date: Date): Date {
        if (this.isWorkTime(date)) {
            return date;
        }

        let targetDate = new Date(date);
        while (!this.isWorkTime(targetDate)) {
            targetDate.setHours(targetDate.getHours() + 1);
        }
        targetDate.setMinutes(0, 0, 0);

        return targetDate;
    }
}

abstract class DueDateCalculatorDecorator implements DueDateCalculator{
    constructor(protected decoratedDueDateCalculator: DueDateCalculator){}
    calculateDueDate(submit: Date, turnaround: number): Date {
        return this.decoratedDueDateCalculator.calculateDueDate(submit, turnaround);
    }
}

export class DueDateCalculatorWithLogging extends DueDateCalculatorDecorator{
    constructor(
        decorated: DueDateCalculator,
        private logger: (msg: string) => void = console.log
    ) {
        super(decorated);
    }
    calculateDueDate(submit: Date, turnaround: number): Date {
        const date = super.calculateDueDate(submit, turnaround);
        this.logger(`result: ${date.toString()}`);
        return date;
    }
}
