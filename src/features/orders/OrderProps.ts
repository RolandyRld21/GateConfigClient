export interface IOrderProps {
    id?: number;
    user_id?: number;
    gate_id: number;
    width: number;
    height: number;
    color: string;
    option1?: boolean;
    option2?: boolean;
    option3?: boolean;
    option4?: boolean;
    option5?: boolean;
    total_price?: number;
    latitude?: string;
    longitude?: string;
    created_at?: string;
    gates?:{text:string};
}
