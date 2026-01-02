import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column({ default: false })
    isRead: boolean;

    @Column({ nullable: true })
    orderId: number;

    @CreateDateColumn()
    createdAt: Date;
}
