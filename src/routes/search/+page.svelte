<script lang="ts">
    import { titleMain, userStore, baseUrl, apiUrl, uuid } from '$lib/store.js';
    import UserCard from '$lib/UserCard.svelte';
    import type { User } from '$lib/types/user';
    import { bannerStore } from '$lib/stores/bannerStore';

    let users: User[] | undefined = undefined;
    let userIndex = 0;

    async function searchUsers() {
        if (!$userStore.in_search) return;
        try {
            const response = await fetch(`${$apiUrl}/api/v1/search`, {
                method: 'GET',
                headers: new Headers({
                    uuid: $uuid,
                    'Content-Type': 'application/json'
                })
            });

            if (response.ok) {
                let _users = await response.json();

                _users.forEach((user: User) => {
                    if (!users) users = [];
                    users.push(user);
                });
                users = users;
            } else {
                const responseMessage = await response.json();
                const errorMessage = (responseMessage as Error).message;
                bannerStore.add(errorMessage, 'error');
                console.error(errorMessage);
            }
        } catch (e: unknown) {
            bannerStore.add(
                e instanceof Error ? e.message : 'An unexpected error occurred',
                'error'
            );
            console.error(e);
        }
    }

    async function nextUser(profile_id: number, is_like: boolean) {
        // Ставим лайк / дизлайк
        like(profile_id, is_like);
        // Тут можно удалять элементы массива, но в этом случае картинки будут заново загружаться
        userIndex++;
        // users = users?.slice(userIndex + 1);
        if (users && users.length - userIndex < 5) {
            await searchUsers();
        }
    }

    async function like(profile_id: number, is_like: boolean) {
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
            } else {
                const responseMessage = await response.json();
                const errorMessage = (responseMessage as Error).message;
                bannerStore.add(errorMessage, 'error');
                console.error(errorMessage);
            }
        } catch (e: unknown) {
            bannerStore.add(
                e instanceof Error ? e.message : 'An unexpected error occurred',
                'error'
            );
            console.error(e);
        }
    }

    $: if ($userStore && $userStore.in_search && users == undefined) {
        users = [];
        searchUsers();
    }
</script>

<svelte:head>
    <title>Поиск - {$titleMain}</title>
</svelte:head>

{#if $userStore && !$userStore.is_guest}
    {#if $userStore.in_search}
        {#if users && users.length > 0}
            {#each users as user, i}
                <div class:hidden={i !== userIndex} class="relative">
                    <UserCard {user} />

                    <div class="absolute top-0 w-full aspect-[3/4]">
                        <div class="grid grid-cols-2 gap-3 p-3 w-full absolute bottom-0 z-40">
                            <div class="text-center">
                                <button on:click={() => nextUser(Number(user.id), false)}>
                                    <img
                                        src="{$baseUrl}/broken-heart-90.png"
                                        alt="avatar"
                                        class="w-12 opacity-90"
                                    />
                                </button>
                            </div>
                            <div class="text-center">
                                <button on:click={() => nextUser(Number(user.id), true)}>
                                    <img
                                        src="{$baseUrl}/heart2.png"
                                        alt="avatar"
                                        class="w-12 opacity-90"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="p-3">
                        <div class="mb-3 text-xl">
                            {user.name}, {user.age}
                        </div>
                        <div class="text-muted">
                            {user.about}
                        </div>
                    </div>
                </div>
            {/each}
        {:else}
            <div class="text-center">Поиск...</div>
        {/if}
    {:else}
        <div class="text-center mt-36 text-3xl">
            Сначала необходимо заполнить
            <a href="{$baseUrl}/profile/data" class="underline">профиль</a>,
            <a href="{$baseUrl}/profile/search" class="underline">параметры поиска</a> и
            <a href="{$baseUrl}/profile/media" class="underline">добавить фотографии</a>.
        </div>
    {/if}
{/if}
