import { workerData } from "worker_threads";

export class DueDateCalculator {
    private readonly DEFAULT_WORK_START_HOUR: number = 9;
    private readonly DEFAULT_WORK_END_HOUR: number = 17;

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
        return (actualHour >= this.DEFAULT_WORK_START_HOUR &&
            actualHour < this.DEFAULT_WORK_END_HOUR);
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