import { createConnection, getRepository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { Order } from '../orders/entities/order.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../../.env') });

async function seed() {
    console.log(' Starting database seeding...');

    const dbUrl = process.env.DATABASE_URL;

    const connection = await createConnection({
        type: 'postgres',
        url: dbUrl,
        entities: [Product, User, Notification, Order],
        synchronize: true,
        ssl: dbUrl ? { rejectUnauthorized: false } : false,
    });

    console.log(' Connected to database');

    const productRepo = getRepository(Product);
    const userRepo = getRepository(User);

    // 1. Seed Admin User
    const adminEmail = 'admin@petalpearl.com';
    const existingAdmin = await userRepo.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = userRepo.create({
            name: 'Petal & Pearl Admin',
            email: adminEmail,
            role: 'admin',
            password: hashedPassword,
            phone: '01758761248',
        });
        await userRepo.save(admin);
        console.log('Admin user created: admin@petalpearl.com / admin123');
    } else {
        console.log('ℹ Admin user already exists');
    }

    // 2. Seed Initial Products
    const count = await productRepo.count();
    if (count === 0) {
        const products = [
            // Clothing
            {
                name: 'Royal Jamdani Three-Piece',
                description: 'Exquisite hand-woven Jamdani ensemble with intricate floral patterns.',
                price: 8500,
                type: 'clothing' as const,
                category: 'Three-Piece',
                image: '/assets/clothing-1.jpg',
                stock: 10,
            },
            {
                name: 'Silk Elegance Suite',
                description: 'Premium silk three-piece with metallic embroidery.',
                price: 12000,
                type: 'clothing' as const,
                category: 'Silk',
                image: '/assets/clothing-2.jpg',
                stock: 5,
            },
            {
                name: 'Cotton Comfort Set',
                description: 'Breathable artisanal cotton set for everyday luxury.',
                price: 4500,
                type: 'clothing' as const,
                category: 'Cotton',
                image: '/assets/clothing-3.jpg',
                stock: 15,
            },
            // Ornaments
            {
                name: 'Classic Pearl Necklace',
                description: 'Timeless freshwater pearl necklace with gold-plated clasp.',
                price: 3200,
                type: 'ornament' as const,
                category: 'Necklace',
                image: '/assets/ornament-1.jpg',
                stock: 20,
            },
            {
                name: 'Filigree Gold Earrings',
                description: 'Traditional handcrafted gold filigree earrings.',
                price: 5400,
                type: 'ornament' as const,
                category: 'Earrings',
                image: '/assets/ornament-2.jpg',
                stock: 8,
            },
            {
                name: 'Beaded Bracelet Ensemble',
                description: 'Colorful artisanal beaded bracelet with silver charms.',
                price: 1500,
                type: 'ornament' as const,
                category: 'Bracelet',
                image: '/assets/ornament-3.jpg',
                stock: 25,
            }
        ];

        await productRepo.save(productRepo.create(products));
        console.log(' Initial products seeded');
    } else {
        console.log('ℹ Products already exist in database');
    }

    await connection.close();
    console.log(' Seeding completed successfully!');
}

seed().catch(err => {
    console.error(' Seeding failed:', err);
    process.exit(1);
});
