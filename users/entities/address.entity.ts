import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

export enum AddressType {
    BILLING = 'billing',
    SHIPPING = 'shipping',
}

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    street: string;

    @Column()
    city: string;

    @Column()
    country: string;

    @Column()
    postalCode: string;

    @Column({ type: 'enum', enum: AddressType })
    type: AddressType; // Billing veya Shipping olarak belirteceğiz

    @ManyToOne(() => User, (user) => user.addresses)
    user: User;
}
