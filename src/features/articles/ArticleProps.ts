export interface IArticleProps {
    _id?: string;
    date?: Date;
    description?: string;
    image?: string;
    isUseful?: boolean;
    lat?: string;
    long?: string;
    price?: number;
    text: string;  // Make price optional
    version?: number;
    option1?: number;
    option2?: number;
    option3?: number;
    option4?: number;
    option5?: number;
}