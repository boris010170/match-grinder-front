<script lang="ts">
    import { apiUrl, userStore, uuid, baseUrl } from '$lib/store';
    import { page } from '$app/stores';
    import { afterNavigate } from '$app/navigation';
    import { bannerStore } from '$lib/stores/bannerStore';
    import Banner from '$lib/Banner.svelte';
    import type { User } from '$lib/types/user';
    import UserCard from '$lib/UserCard.svelte';

    let user: User | undefined = undefined;
    let hasLike: boolean = false;
    let isLike: boolean = false;

    afterNavigate(() => {
        getUser();
        getHasLike();
    });

    const getHasLike = async () => {
        if (!$userStore) {
            return;
        }

        try {
            const response = await fetch(
                `${$apiUrl}/api/v1/like/has-like?uuid=${$page.url.searchParams.get('uuid')}`,
                {
                    method: 'GET',
                    headers: new Headers({
                        uuid: $uuid,
                        'Content-Type': 'application/json'
                    })
                }
            );

            if (response.ok) {
                const json = await response.json();
                hasLike = json.hasLike || false;
                isLike = json.isLike || false;
                console.log(hasLike);
            } else {
                const responseMessage = (await response.json()) as { message: string };
                bannerStore.add(responseMessage.message, 'error');
            }
        } catch (e) {
            bannerStore.add((e as Error).message, 'error');
        }
    };

    const like = async (profile_id: number, is_like: boolean) => {
        try {
            const response = await fetch(`${$apiUrl}/api/v1/like/create`, {
                method: 'POST',
                body: JSON.stringify({
                    profile_id: profile_id,
                    is_like: is_like
                }),
                headers: new Headers({
                    uuid: $uuid,
                    'Content-Type': 'application/json'
                })
            });

            if (response.ok) {
                let result = await response.json();
                if (result > 0) {
                    bannerStore.add('У вас новое совпадение, так держать!', 'success');
                }
                getHasLike();
            } else {
                const responseMessage = await response.json();
                const errorMessage = (responseMessage as Error).message;
                bannerStore.add(errorMessage, 'error');
            }
        } catch (e: unknown) {
            bannerStore.add(
                e instanceof Error ? e.message : 'An unexpected error occurred',
                'error'
            );
            console.error(e);
        }
    };

    async function getUser() {
        if (!$userStore) {
            return;
        }

        try {
            const response = await fetch(
                `${$apiUrl}/api/v1/profile/show?uuid=${$page.url.searchParams.get('uuid')}`,
                {
                    method: 'GET',
                    headers: new Headers({
                        uuid: $uuid,
                        'Content-Type': 'application/json'
                    })
                }
            );

            if (response.ok) {
                user = (await response.json()) as User;
                console.log(user);
            } else {
                const responseMessage = (await response.json()) as { message: string };
                bannerStore.add(responseMessage.message, 'error');
            }
        } catch (e) {
            bannerStore.add((e as Error).message, 'error');
        }
    }

    $: if (!user && $userStore && $uuid) {
        getUser();
        getHasLike();
    }
</script>

<Banner />

{#if user}
    <div class="relative">
        <UserCard {user} />
        {#if hasLike}
            <div class="absolute top-0 w-full aspect-[3/4]">
                <div
                    class="grid grid-cols-2 gap-3 p-3 w-full absolute bottom-0 z-40 place-items-center"
                >
                    <div class="text-center">
                        <button on:click={() => like(Number(user?.id), false)}>
                            <img
                                src="{$baseUrl}/broken-heart-90.png"
                                alt="avatar"
                                class="w-12"
                                class:opacity-20={isLike}
                                class:opacity-90={!isLike}
                            />
                        </button>
                    </div>
                    <div class="text-center">
                        <button on:click={() => like(Number(user?.id), true)}>
                            <img
                                src="{$baseUrl}/heart2.png"
                                alt="avatar"
                                class="w-12"
                                class:opacity-90={isLike}
                                class:opacity-20={!isLike}
                            />
                        </button>
                    </div>
                </div>
            </div>
        {/if}

        <div class="p-3">
            <div class="mb-3 text-xl">
                {user.name}, {user.age}
            </div>
            <div class="text-muted">
                {user.about}
            </div>
        </div>
    </div>
{/if}
