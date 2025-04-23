import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Hotel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    name: string;

    @Column('jsonb')
    location: { type: string; coordinates: number[] };

    @Column()
    address: string;

    @Column()
    city: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    employees: number;

    @Column('text', { array: true })
    services: string[];

    @Column('decimal', { nullable: true })
    price: number;

    @Column({ nullable: true })
    logoUrl: string;

    @Column({ nullable: true })
    managerName: string;

    @Column({ nullable: true })
    managerEmail: string;

    @Column('text', { array: true, nullable: true })
    images: string[];

    @ManyToOne(() => User, (user) => user.hotels)
    user: User;
}
