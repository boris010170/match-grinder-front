export interface UserImage {
    id: number;
    sort: number;
    size: number;
    name: string;
    url: string;
    ratio: number;
}

export interface User {
    id: number;
    age: number;
    name: string;
    sex: 'M' | 'F';
    about: string;
    birth_year: number;
    zodiac: string;
    height: number;
    weight: number;
    images: UserImage[];
}