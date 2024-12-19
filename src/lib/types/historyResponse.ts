import type { Profile } from "./profile";

export interface HistoryResponse {
    items: HistoryItem[];
    _links: Links;
    _meta: Meta;
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

export interface Links {
    self: Link;
    first: Link;
    last: Link;
    next: Link;
}

export interface Link {
    href: string;
}

export interface Meta {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    perPage: number;
}
