export interface ChatProfileBase {
    id?: number;
    age: number;
    name: string;
    sex: 'M' | 'F';
    about: string | null;
}

export interface ChatProfile extends ChatProfileBase {
    uuid: string;
    images: Image[];
}

export interface NewChatItem {
    id: number;
    deleted: number;
    timestamp: number;
    profile: ChatProfile;
}

export interface ChatMessageItem {
    id: number;
    chat_id: number;
    from_id: number;
    to_id: number;
    is_read: number;
    text: string;
    created_at: number;
    updated_at: number;
    from: ChatProfileBase;
    profile: ChatProfile;
}

export interface NewChatsResponse {
    items?: NewChatItem[];
}

export interface ChatsResponse {
    items?: ChatMessageItem[];
}
