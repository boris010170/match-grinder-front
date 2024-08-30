import {writable} from 'svelte/store';

/**
 * base URL.
 * @type {import('svelte/store').Writable<string>}
 */
export const baseUrl = writable();

/**
 * api URL.
 * @type {import('svelte/store').Writable<string>}
 */
export const apiUrl = writable();

/**
 * uploads URL.
 * @type {import('svelte/store').Writable<string>}
 */
export const uploadsUrl = writable();

/**
 * Заголовок приложения.
 * @type {import('svelte/store').Writable<string>}
 */
export const titleMain = writable();

/**
 * UUID.
 * @type {import('svelte/store').Writable<string>}
 */
export const uuid = writable();

/**
 * Хранилище данных пользователя.
 * @type {import('svelte/store').Writable<UserStore>}
 */
export const userStore = writable();

/**
 * Тема сайта по умолчанию.
 * @type {import('svelte/store').Writable<boolean>}
 */
export const darkMode = writable();