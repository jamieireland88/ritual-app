export type RitualRaw = {
    id: number;
    name: string;
    streak: number;
    remind_time: Date;
    created: Date;
}

export type ProfileRaw = {
    id: number;
    notification_settings: string;
    account_type: string;
    created: Date;
}

export type Daily = {
    id: number;
    created: Date;
}