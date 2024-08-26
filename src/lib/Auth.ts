import { getCookie, setCookie } from 'svelte-cookie';
// import { v4 as uuidv4 } from "uuid";

export async function AuthGetUUID(): Promise<string> {

    let uuid: string;
    uuid = String(getCookie('uuid'));
    if (!uuid) {
        // uuid = String(uuidv4());
        uuid = String(crypto.randomUUID());
        setCookie('uuid', uuid, 365);
    }

    return uuid;
}