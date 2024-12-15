export function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

export function getMaxFrequenceFromFrequencyType(frequencyType: string) {
    switch (frequencyType) {
        case "day":
            return 7;
        case "week":
            return 1;
        case "month":
            return 1;
        default:
            return 1;
    }
}