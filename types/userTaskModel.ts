export interface UserTask {
    taskId: number;
    name: string;
    frequencyType: string;
    frequencyCount: number;
    description: string | null;
    quantityCompleted: string | null;
    updatedAt: string | null;
    taskDateFrom: string | null;
    taskDateTo: string | null;
}

export interface Task {
    taskId: number;
    circleId: number | null;
    name: string;
    frequencyType: string;
    frequencyCount: number;
    description: string | null;
}