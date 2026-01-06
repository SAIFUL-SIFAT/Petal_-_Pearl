import { Controller, Post } from '@nestjs/common';
import { RecoveryService } from './recovery.service';

@Controller('recovery')
export class RecoveryController {
    constructor(private readonly recoveryService: RecoveryService) { }

    @Post('trigger-reminders')
    triggerReminders() {
        return this.recoveryService.sendAbandonedCartReminders();
    }
}
