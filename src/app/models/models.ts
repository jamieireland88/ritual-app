export type Ritual = {
    id: number;
    name: string;
    streak: number;
    remindTime: Date;
    created: Date;
}

export type Profile = {
    id: number;
    notificationSettings: string;
    accountType: string;
    created: Date;
}