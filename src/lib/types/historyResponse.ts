export interface HistoryResponse {
    items: HistoryItem[];
    _links: DataProviderLinks;
    _meta: DataProviderMeta;
}

export interface HistoryItem {
    id: number;
    user_id: number;
    is_like: number;
    timestamp: number;
    profile: Profile;
}

export interface Image {
    id: number;
    sort: number;
    size: number;
    name: string;
    url: string;
    ratio: number;
}