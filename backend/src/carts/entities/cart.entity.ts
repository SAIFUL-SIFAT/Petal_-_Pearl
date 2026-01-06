import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('carts')
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    userId: number;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
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

    @Column({ default: false })
    isRecovered: boolean;

    @Column({ default: false })
    reminderSent: boolean;

    @UpdateDateColumn()
    updatedAt: Date;
}
