export interface ChatWithMessages {
    id: number;
    deleted: number;
    timestamp: number;
    profile: Profile;
    messages: Array<ChatMessage>;
}
