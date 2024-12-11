import { writable } from 'svelte/store';
import type { BannerMessage, BannerType } from '$lib/types/banner';

function createBannerStore() {
    const { subscribe, update } = writable<BannerMessage[]>([]);
    
    const store = {
        subscribe,
        add: (message: string, type: BannerType = 'info') => {
            const id = crypto.randomUUID();
            const newMessage: BannerMessage = { 
                id, 
                message, 
                type, 
                timestamp: Date.now() 
            };

            update(messages => [...messages, newMessage]);
            
            setTimeout(() => {
                store.remove(id);
            }, 7000);

            return id;
        },
        remove: (id: string) => {
            update(messages => messages.filter(m => m.id !== id));
        },
        clear: () => {
            update(() => []);
        }
    };

    return store;
}

export const bannerStore = createBannerStore();
