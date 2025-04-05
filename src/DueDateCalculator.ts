export class DueDateCalculator {
    private readonly DEFAULT_WORK_START_HOUR: number = 9;
    private readonly DEFAULT_WORK_END_HOUR: number = 17;

    /**
     * Calculates the due date by adding turnaround time to the submit date
     * considering working hours (9AM - 5PM) and skipping weekends.
     * @param submit Date and time when the task is submitted.
     * @param turnaround Number of working hours to add to the submit date.
     * @returns The calculated due date, witch is the submit date plus the turnaround time considering working time and weekends).
     */
    public calculateDueDate(submit: Date, turnaround: number): Date {
        if (!(submit instanceof (Date)) || isNaN(submit.getTime())) {
            throw new TypeError('Wrong submit parameter');
        }
        if (typeof (turnaround) != 'number' || turnaround <= 0 || turnaround % 1 !== 0) {
            throw new TypeError('Wrong turnaround parameter');
        }

        let targetDate = new Date(submit);
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
        return (actualHour >= 9 && actualHour < 17);
    }

    private isWorkTime(date: Date): boolean {
        return (this.isWorkDay(date) && this.isWorkHour(date));
    }
}