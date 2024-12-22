// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }

    /**
     * Сообщение
     */
    export interface ChatMessage {
        id: number;
        chat_id: number;
        from_id: number;
        to_id: number;
        is_read: number;
        text: string;
        created_at: number;
        updated_at: number;
    }

    /**
     * Профиль пользователя
     */
    export interface Profile {
        id: number;
        username: string;
        is_guest: boolean;
        age: number;
        name: string;
        sex: 'M' | 'F';
        about: string;
        uuid: string;
        birth_year: number;
        zodiac: string;
        height: number;
        weight: number;
        lat: string;
        lng: string;
        search_sex: string;
        search_radius: number;
        search_from: number;
        search_to: number;
        search_weight_from: number;
        search_weight_to: number;
        search_height_from: number;
        search_height_to: number;
        in_search: number;
        images: Image[];
    }

    /**
     * Фото пользователя
     */
    interface Image {
        id: number;
        sort: number;
        size: number;
        name: string;
        url: string;
        ratio: number | null;
    }

    interface UserStore {
        id?: number;
        username?: string;
        is_guest: boolean;
        age?: number;
        name?: string;
        sex?: string;
        birth_year?: string;
        zodiac?: string;
        about?: string;
        height?: number;
        weight?: number;
        lat?: number;
        lng?: number;
        search_sex?: string;
        search_radius?: number;
        search_from?: number;
        search_to?: number;
        search_weight_from?: number;
        search_weight_to?: number;
        search_height_from?: number;
        search_height_to?: number;
        in_search?: number;
        images?: Image[];
    }

    export interface DataProviderLinks {
        self: Link;
        first: Link;
        last: Link;
        next: Link;
    }

    export interface DataProviderLink {
        href: string;
    }

    export interface DataProviderMeta {
        totalCount: number;
        pageCount: number;
        currentPage: number;
        perPage: number;
    }
}

export {};
