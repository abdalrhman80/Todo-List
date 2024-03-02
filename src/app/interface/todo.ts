export interface Todo {
    _id: string;
    title: string;
    completed: boolean;
    apiKey: string;
    __v: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface newTodo {
    title: string;
    apiKey: string;
}
