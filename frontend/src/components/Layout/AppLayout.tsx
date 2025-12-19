/**
 * AppLayout - Main authenticated layout wrapper with top navigation bar
 * Provides consistent navigation structure, user profile display, and mobile-responsive menu across all protected routes
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
    LayoutDashboard,
    CheckSquare,
    LogOut,
    User,
    ChevronDown
} from 'lucide-react';
import { cn } from '../../lib/utils';
import NotificationDropdown from '../Notification/NotificationDropdown';

interface AppLayoutProps {
    children: React.ReactNode;
}

/**
 * Main authenticated layout component.
 * Includes responsive top navigation bar.
 */
export default function AppLayout({ children }: AppLayoutProps) {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuthStore();

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'All Tasks', href: '/tasks', icon: CheckSquare },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo/Brand */}
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center">
                                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">TM</span>
                                </div>
                                <h1 className="ml-3 text-xl font-bold text-gray-900 hidden sm:block">
                                    Task Manager
                                </h1>
                            </Link>
                        </div>

                        {/* Center Navigation Links */}
                        <nav className="hidden md:flex items-center space-x-1">
                            {navigation.map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                            isActive
                                                ? "bg-indigo-50 text-indigo-700 shadow-sm"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "h-4 w-4",
                                            isActive ? "text-indigo-600" : "text-gray-400"
                                        )} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right Side - Notifications & User Menu */}
                        <div className="flex items-center gap-3">
                            {/* Notification Bell */}
                            <NotificationDropdown />

                            {/* User Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-[120px]">{user?.email}</p>
                                    </div>
                                    <ChevronDown className={cn(
                                        "h-4 w-4 text-gray-400 transition-transform duration-200",
                                        isUserMenuOpen && "rotate-180"
                                    )} />
                                </button>

                                {/* Dropdown Menu */}
                                {isUserMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                                            <div className="p-3 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                            </div>
                                            <div className="p-2">
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setIsUserMenuOpen(false);
                                                    }}
                                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    <span>Sign out</span>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Navigation Links */}
                    <nav className="md:hidden border-t border-gray-100 py-2 flex gap-2">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all flex-1 justify-center",
                                        isActive
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-gray-700 hover:bg-gray-50"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "h-4 w-4",
                                        isActive ? "text-indigo-600" : "text-gray-400"
                                    )} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </header>

            {/* Page Content - Full Width */}
            <main className="flex-1 py-8">
                <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
