import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseWakeupMiddleware implements NestMiddleware {
    constructor(private readonly dataSource: DataSource) { }

    async use(req: Request, res: Response, next: NextFunction) {
        // Make /health non-blocking so cron jobs don't timeout
        if (req.path === '/health') {
            this.dataSource.query('SELECT 1').catch(err => console.error('Background DB wakeup error:', err.message));
            return next();
        }

        // Only target API routes to prevent overhead on static files
        if (req.path.startsWith('/api')) {
            try {
                // Quick connectivity check
                await this.dataSource.query('SELECT 1');
                next();
            } catch (error) {
                console.warn('Database might be sleeping, attempting wake-up...', error.message);

                try {
                    // Wait for 2 seconds and retry as suggested
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    await this.dataSource.query('SELECT 1');
                    next();
                } catch (retryError) {
                    console.error('Database wake-up failed:', retryError.message);
                    // Pass to next even if it fails, let the actual route handler deal with the error
                    next();
                }
            }
        } else {
            next();
        }
    }
}
