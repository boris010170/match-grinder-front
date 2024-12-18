export interface ChatWithMessages {
    id: number;
    deleted: number;
    timestamp: number;
    profile: {
        age: number;
        name: string;
        sex: string;
        about: string;
        uuid: string;
        images: Array<{
            id: number;
            sort: number;
            size: number;
            name: string;
            url: string;
            ratio: number;
        }>;
    };
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