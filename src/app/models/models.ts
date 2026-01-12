export enum RitualType {
    Daily = 'daily',
    Weekly = 'weekly',
    Monthly = 'monthly'
}

export enum IconType {
    Running = 'running',
    Pills = 'pills',
    Yoga = 'yoga',
    Weights = 'weights',
    Cart = 'cart',
    Football = 'football',
    Swimming = 'swimming'
}

export type Ritual = {
    id: string;
    name: string;
    icon?: IconType,
    streak: number;
    remindTime: Date | null;
    created: Date | null;
    sortOrder: number;
    actioned: boolean;
    type: RitualType;
    currentStreak: number;
    longestStreak: number;
    completion: number;
    totalComplete: number;
    totalDays: number;
    lastCheckin?: Date;
}

export type Profile = {
    id: string;
    notificationSettings: string;
    accountType: string;
    created: Date;
}
