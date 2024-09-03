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
        search_weight_from?: number;
        search_weight_to?: number;
        search_height_from?: number;
        search_height_to?: number;
        images?: Image[];
    }
}

export {};
