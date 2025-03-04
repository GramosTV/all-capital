import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    salary: number;
    birthdate: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Household {
    id: number;
    name: string;
    code: string;
    expenses: Expense[];
}

export interface Expense {
    id: number;
    name: string;
    amount: number;
}

export interface Member {
    name: string;
    salary: number;
}
export interface Retirement {
    id: number;
}
export interface Instrument {
    id: number;
    name: string;
    yearly_return: number;
    weight: number;
}
