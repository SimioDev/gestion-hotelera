export interface Hotel {
    id: number;
    type: string;
    name: string;
    location: {
        type: string;
        coordinates: [number, number];
    };
    address: string;
    city: string;
    phone?: string;
    employees?: number;
    logoUrl?: string;
    managerName?: string;
    managerEmail?: string;
    services?: string[];
    price?: number;
    images?: string[];
}
