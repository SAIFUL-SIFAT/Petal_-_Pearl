import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'email', unique: true })
    email: string;

    @Column({ name: 'phone', nullable: true })
    phone: string;

    @Column({ name: 'password' })
    password: string;

    @Column({ name: 'role', default: 'user' })
    role: 'user' | 'admin';

    @CreateDateColumn({ name: 'createdAt' })
    createdAt: Date;
}
