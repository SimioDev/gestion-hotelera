export interface Hotel {
    id: number;
    name: string;
    location: {
        type: string;
        coordinates: [number, number];
    };
    address: string;
    city: string;
    phone: string;
    employees: number;
    logoUrl?: string;
    managerName?: string;
    managerEmail?: string;
    services?: string[];
}
