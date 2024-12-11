export type BannerType = 'info' | 'success' | 'error' | 'warning';

export interface BannerMessage {
    id: string;
    message: string;
    type?: BannerType;
    timestamp?: number;
}
