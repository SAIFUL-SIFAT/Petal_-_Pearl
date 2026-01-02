import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private notificationsRepository: Repository<Notification>,
    ) { }

    async create(createNotificationDto: CreateNotificationDto) {
        const notification = this.notificationsRepository.create(createNotificationDto);
        return this.notificationsRepository.save(notification);
    }

    async findAllUnread() {
        return this.notificationsRepository.find({
            where: { isRead: false },
            order: { createdAt: 'DESC' },
        });
    }

    async markAsRead(id: number) {
        return this.notificationsRepository.update(id, { isRead: true });
    }
}
