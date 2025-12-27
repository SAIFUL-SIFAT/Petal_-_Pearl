import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column('jsonb')
    items: Array<{
        productId: number;
        name: string;
        price: number;
        quantity: number;
        image: string;
    }>;

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount: number;

    @Column({ default: 'pending' })
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

    @Column()
    shippingAddress: string;

    @Column()
    customerName: string;

    @Column()
    customerEmail: string;

    @Column()
    customerPhone: string;

    @Column({ nullable: true })
    paymentMethod: string;

    @CreateDateColumn()
    createdAt: Date;
}
