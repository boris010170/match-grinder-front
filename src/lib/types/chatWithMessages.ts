export interface ChatWithMessages {
    id: number;
    deleted: number;
    timestamp: number;
    profile: Profile;
    messages: Array<{
        id: number;
        chat_id: number;
        from_id: number;
        to_id: number;
        is_read: number;
        text: string;
        created_at: number;
        updated_at: number;
    }>;
}