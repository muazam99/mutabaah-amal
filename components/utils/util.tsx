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

export function getCurrentWeek(): [Date, Date] {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // Calculate the difference to the previous Thursday
    const diffToThursday = (dayOfWeek + 3) % 7; // 3 is the offset to Thursday (0=Sunday, 1=Monday, ..., 6=Saturday)
    
    // Calculate the start of the week (Thursday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - diffToThursday);
    
    // Calculate the end of the week (Wednesday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return [startOfWeek, endOfWeek];
}