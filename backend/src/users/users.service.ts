import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThan, And } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto) {
        const { email, password, name, phone } = createUserDto;

        // Check if user already exists
        const existingUser = await this.usersRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.usersRepository.create({
            name,
            email,
            phone,
            password: hashedPassword,
        });

        const savedUser = await this.usersRepository.save(user);

        // Remove password from returned object
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...result } = savedUser;
        return result;
    }



    async findAll() {
        const users = await this.usersRepository.find();
        return users.map(user => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;
            return result;
        });
    }

    async update(id: number, updateUserDto: any) {
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        await this.usersRepository.update(id, updateUserDto);
        const updatedUser = await this.usersRepository.findOne({ where: { id } });
        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = updatedUser;
        return result;
    }

    async remove(id: number) {
        return this.usersRepository.delete(id);
    }

    async findByEmail(email: string) {
        return this.usersRepository.findOne({ where: { email } });
    }

    async count() {
        return this.usersRepository.count({
            where: { role: 'user' }
        });
    }

    async getTrend() {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

        const currentUsers = await this.usersRepository.count({
            where: {
                role: 'user',
                createdAt: MoreThanOrEqual(thirtyDaysAgo)
            }
        });

        const previousUsers = await this.usersRepository.count({
            where: {
                role: 'user',
                createdAt: And(MoreThanOrEqual(sixtyDaysAgo), LessThan(thirtyDaysAgo))
            }
        });

        if (previousUsers === 0) return currentUsers > 0 ? 100 : 0;
        return Math.round(((currentUsers - previousUsers) / previousUsers) * 100);
    }
}
