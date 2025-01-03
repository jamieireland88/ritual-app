export type Ritual = {
    id: string;
    name: string;
    streak: number;
    remindTime: Date | null;
    created: Date | null;
}

export type Profile = {
    id: string;
    notificationSettings: string;
    accountType: string;
    created: Date;
}