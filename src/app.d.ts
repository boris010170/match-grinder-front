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
}

export {};
