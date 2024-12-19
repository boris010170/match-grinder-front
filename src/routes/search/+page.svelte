<script lang="ts">
    import { titleMain, userStore, baseUrl, apiUrl, uuid } from '$lib/store.js';
    import Flash from '$lib/Flash.svelte';
    import UserCard from '$lib/UserCard.svelte';
    import Message from '$lib/Message.svelte';
    import { slide } from 'svelte/transition';
    import type { User } from '$lib/types/user';

    let users: User[] | undefined = undefined;
    let errorMessage = '';
    let userIndex = 0;
    let message = '';

    async function searchUsers() {
        if (!$userStore.in_search) return;
        errorMessage = '';
        try {
            const response = await fetch(`${$apiUrl}/api/v1/search`, {
                method: 'GET',
                headers: new Headers({
                    uuid: $uuid,
                    'Content-Type': 'application/json'
                })
            });

            if (response.ok) {
                console.log(users);
                let _users = await response.json();

                _users.forEach((user: User) => {
                    if (!users) users = [];
                    users.push(user);
                });
                users = users;
                console.log(users);
            } else {
                let responseMessage = await response.json();
                errorMessage = responseMessage.message;
                console.log(errorMessage);
            }
        } catch (e: unknown) {
            errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred';
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
        errorMessage = '';
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
                    message = 'У вас новое совпадение, так держать!';
                }
                console.log(result);
            } else {
                let responseMessage = await response.json();
                errorMessage = responseMessage.message;
                console.log(errorMessage);
            }
        } catch (e: unknown) {
            errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred';
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

{#if errorMessage}
    <Flash type="error" message={errorMessage} />
{/if}

<div class="relative">
    {#if message}
        <div
            transition:slide={{ duration: 300, axis: 'y' }}
            class="absolute top-0 left-0 z-50 w-full bg-indigo-800 px-3 py-2 rounded-md text-neutral-200"
        >
            <Message bind:message />
        </div>
    {/if}
</div>
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
                                        class="w-12 h-12 opacity-60"
                                    />
                                </button>
                            </div>
                            <div class="text-center">
                                <button
                                    on:click={() => nextUser(Number(user.id), true)}
                                    class="border-4 border-green-600 text-green-900 w-12 h-12 rounded-full bg-green-400 bg-opacity-50 font-bolder"
                                >
                                    `⏝`
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        {:else}
            <div class="text-center">Поиск...</div>
        {/if}
    {:else}
        <div class="text-center mt-36 text-3xl">
            Сначала необходимо заполнить <a href="{$baseUrl}/profile/data" class="underline"
                >профиль</a
            >,
            <a href="{$baseUrl}/profile/search" class="underline">параметры поиска</a> и
            <a href="{$baseUrl}/profile/media" class="underline">добавить фотографии</a>.
        </div>
    {/if}
{/if}
