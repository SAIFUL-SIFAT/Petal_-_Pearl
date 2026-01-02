import React, { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { notificationApi } from '@/api/services';

const AdminNotifications = () => {
    const { toast } = useToast();
    const processedNotificationIds = useRef<Set<number>>(new Set(
        JSON.parse(sessionStorage.getItem('processedNotificationIds') || '[]')
    ));

    useEffect(() => {
        sessionStorage.setItem('processedNotificationIds', JSON.stringify(Array.from(processedNotificationIds.current)));
    }, []); // Run only optionally or inside the loop? Better to do it when adding.

    // Helper to update storage
    const addToProcessed = (id: number) => {
        processedNotificationIds.current.add(id);
        sessionStorage.setItem('processedNotificationIds', JSON.stringify(Array.from(processedNotificationIds.current)));
    };

    useEffect(() => {
        const checkNotifications = async () => {
            try {
                const response = await notificationApi.getUnread();
                const notifications = response.data;

                notifications.forEach((notification: any) => {
                    if (!processedNotificationIds.current.has(notification.id)) {
                        addToProcessed(notification.id);

                        toast({
                            title: "New Order Notification",
                            description: notification.message,
                            duration: Infinity, // Keep open until manually closed
                            onOpenChange: (open) => {
                                if (!open) {
                                    // Mark as read when closed (dismissed)
                                    notificationApi.markAsRead(notification.id).catch(console.error);
                                }
                            }
                        });
                    }
                });
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            }
        };

        // Check immediately
        checkNotifications();

        // Poll every 15 seconds
        const interval = setInterval(checkNotifications, 15000);

        return () => clearInterval(interval);
    }, [toast]);

    return null; // This component handles side effects only
};

export default AdminNotifications;
