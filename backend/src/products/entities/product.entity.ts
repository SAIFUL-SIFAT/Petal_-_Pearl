import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('decimal', {
        precision: 10,
        scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        },
    })
    price: number;

    @Column('decimal', {
        precision: 10,
        scale: 2,
        nullable: true,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        },
    })
    originalPrice?: number;

    @Column()
    image: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column()
    category: string;

    @Column({ default: false })
    isNew: boolean;

    @Column({ default: false })
    isSale: boolean;

    @Column({ type: 'enum', enum: ['clothing', 'ornament'] })
    type: 'clothing' | 'ornament';

    @Column({ default: 0 })
    stock: number;
}
