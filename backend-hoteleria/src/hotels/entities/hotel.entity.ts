import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Hotel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('jsonb')
    location: { type: string; coordinates: number[] };

    @Column()
    address: string;

    @Column()
    city: string;

    @Column()
    phone: string;

    @Column()
    employees: number;

    @Column('text', { array: true, nullable: true })
    services: string[];

    @ManyToOne(() => User, (user) => user.hotels)
    user: User;
}
