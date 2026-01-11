export enum RitualType {
    Daily = 'daily',
    Weekly = 'weekly',
    Monthly = 'monthly'
}

export type Ritual = {
    id: string;
    name: string;
    streak: number;
    remindTime: Date | null;
    created: Date | null;
    sortOrder: number;
    actioned: boolean;
    type: RitualType;
}

export type Profile = {
    id: string;
    notificationSettings: string;
    accountType: string;
    created: Date;
}
