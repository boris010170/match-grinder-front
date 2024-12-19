export interface Profile {
    id: number;
    username: string;
    is_guest: boolean;
    age: number;
    name: string;
    sex: string;
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
