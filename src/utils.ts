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
    if (isWorkTime(date)) {
        return date;
    }

    let targetDate = new Date(date);
    while (isWorkTime(targetDate)) {
        targetDate.setHours(targetDate.getHours() + 1);
    }
    targetDate.setMinutes(0, 0, 0);

    return targetDate;
}