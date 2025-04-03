import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Hotel } from '../../hotels/entities/hotel.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    chainName: string;

    @OneToMany(() => Hotel, (hotel) => hotel.user)
    hotels: Hotel[];
}
