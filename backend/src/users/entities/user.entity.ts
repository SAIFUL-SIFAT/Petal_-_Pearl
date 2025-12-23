import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column()
    password: string;

    @Column({ default: 'user' })
    role: 'user' | 'admin';

    @CreateDateColumn()
    createdAt: Date;
}
