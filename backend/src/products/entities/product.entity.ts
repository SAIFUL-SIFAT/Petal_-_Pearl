import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'name' })
    name: string;

    @Column('decimal', { name: 'price', precision: 10, scale: 2 })
    price: number;

    @Column('decimal', { name: 'originalPrice', precision: 10, scale: 2, nullable: true })
    originalPrice?: number;

    @Column({ name: 'image' })
    image: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string;

    @Column({ name: 'category' })
    category: string;

    @Column({ name: 'isNew', default: false })
    isNew: boolean;

    @Column({ name: 'isSale', default: false })
    isSale: boolean;

    @Column({ name: 'type', type: 'enum', enum: ['clothing', 'ornament'] })
    type: 'clothing' | 'ornament';

    @Column({ name: 'stock', default: 0 })
    stock: number;
}
