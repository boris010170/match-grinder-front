import {getCookie, setCookie} from 'svelte-cookie';

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

export async function AuthGetUserStore(uuid: string, url: string): Promise<any> {

    let userStore = {
        isGuest: true,
    }

    try {
        const response = await fetch(
            url,
            {
                headers: new Headers({
                    'uuid': uuid,
                    'Content-Type': 'application/json',
                }),
            });
        if (response.ok) {
            userStore = await response.json();
        }
    } catch (e) {
        console.log(e);
    }

    return userStore;
}