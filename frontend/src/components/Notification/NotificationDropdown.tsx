import { useState, useEffect, useRef } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { useNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead } from '../../hooks/useNotifications';
import { Notification } from '../../api/notifications';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data: notifications = [], isLoading } = useNotifications();
    const { data: unreadCount = 0 } = useUnreadCount();
    const markAsRead = useMarkAsRead();
    const markAllAsRead = useMarkAllAsRead();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            markAsRead.mutate(notification._id);
        }
        // Could navigate to task details here
        setIsOpen(false);
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead.mutate();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {isLoading ? (
                            <div className="px-4 py-8 text-center text-gray-500">
                                <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-500">
                                <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-indigo-50' : ''
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                    {notification.message}
                                                </p>
                                                {notification.taskId && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Task: {notification.taskId.title}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                            {!notification.isRead && (
                                                <div className="h-2 w-2 bg-indigo-600 rounded-full mt-2 ml-2"></div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-2 border-t border-gray-200">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-sm text-gray-600 hover:text-gray-900 w-full text-center"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
