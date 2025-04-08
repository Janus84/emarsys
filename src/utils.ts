import { DEFAULT_WORK_HOURS } from "./constans";

export function isWorkDay(date: Date): boolean {
    const day = date.getDay();
    return day !== 0 && day !== 6; // hétvége kizárva
}

export function isWorkHour(date: Date): boolean {
    const hour = date.getHours();
    return hour >= DEFAULT_WORK_HOURS.START && hour < DEFAULT_WORK_HOURS.END;
}

export function isWorkTime(date: Date): boolean {
    return isWorkDay(date) && isWorkHour(date);
}

export function getNextWorkStartAfterDate(date: Date): Date {
    let targetDate = new Date(date);

    if (isWorkTime(targetDate)) {
        return targetDate;
    }

    while (!isWorkTime(targetDate)) {
        incrementHours(targetDate);
    }
    targetDate.setMinutes(0, 0, 0);

    return targetDate;
}

export function skipIfNotWorkingTime(date: Date): Date {
    let targetDate = new Date(date);

    while (!isWorkDay(targetDate)) {
        incrementDates(targetDate);
        continue;
    }

    if (targetDate.getHours() >= DEFAULT_WORK_HOURS.END) {
        incrementDates(targetDate);
    }
    targetDate.setHours(DEFAULT_WORK_HOURS.START);

    if (!isWorkDay(targetDate)) {
        targetDate = skipIfNotWorkingTime(targetDate);
    }

    return targetDate;
}

export function incrementHours(date: Date): void {
    date.setHours(date.getHours() + 1);
}

export function incrementDates(date: Date): void {
    date.setDate(date.getDate() + 1);
}