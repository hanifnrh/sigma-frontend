"use client"
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

type Notification = {
    data: string;
    status: string;
    timestamp: Date;
    message: string;
    icon: React.ReactNode;
    color: string;
};

type NotificationContextType = {
    notifications: Notification[];
    addNotification: (notification: Notification) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Use useCallback to memoize the function and prevent unnecessary re-renders
    const addNotification = useCallback((notification: Notification) => {
        setNotifications((prev) => [...prev, notification]);
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

// Custom hook to use the NotificationContext
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
