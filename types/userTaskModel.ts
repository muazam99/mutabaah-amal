export interface UserTask {
    taskId: number;
    name: string;
    frequencyType: string;
    frequencyCount: number;
    description: string | null;
    quantityCompleted: string | null;
    completedDate: string | null;
}