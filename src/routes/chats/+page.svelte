<script lang="ts">
    import { apiUrl, userStore, uuid, baseUrl } from '$lib/store';
    import Flash from '$lib/Flash.svelte';
    import type { NewChatsResponse, ChatsResponse } from '$lib/types/chat';

    let newChats: NewChatsResponse | undefined = undefined;
    let chats: ChatsResponse | undefined = undefined;
    let errorMessage = '';

    async function getChats() {
        errorMessage = '';
        try {
            const response = await fetch(`${$apiUrl}/api/v1/chat/chat-messages`, {
                method: 'GET',
                headers: new Headers({
                    uuid: $uuid,
                    'Content-Type': 'application/json'
                })
            });

            if (response.ok) {
                chats = await response.json();
            } else {
                const responseMessage = await response.json();
                errorMessage = responseMessage.message || 'Unknown error occurred';
                console.error(errorMessage);
            }
        } catch (e: unknown) {
            errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred';
            console.error(e);
        }
    }

    async function getNewChats() {
        errorMessage = '';
        try {
            const response = await fetch(`${$apiUrl}/api/v1/chat/new`, {
                method: 'GET',
                headers: new Headers({
                    uuid: $uuid,
                    'Content-Type': 'application/json'
                })
            });

            if (response.ok) {
                newChats = await response.json();
            } else {
                const responseMessage = await response.json();
                errorMessage = responseMessage.message || 'Unknown error occurred';
                console.error(errorMessage);
            }
        } catch (e: unknown) {
            errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred';
            console.error(e);
        }
    }

    function showText(text: string) {
        if (text.length > 100) {
            return text.substring(0, 100) + '...';
        }

        return text;
    }

    $: if ($userStore?.in_search && chats === undefined) {
        newChats = { items: [] };
        chats = { items: [] };
        getChats();
        getNewChats();
    }
</script>

{#if errorMessage}
    <Flash type="error" message={errorMessage} />
{/if}

{#if $userStore && !$userStore.is_guest}
    <div class="min-h-[calc(100vh-7rem)]">
        <div class="grid grid-cols-1 gap-3">
            {#if newChats?.items}
                <div class="flex flex-nowrap gap-2 overflow-scroll scrollbar-hide">
                    {#each newChats.items as item}
                        {#if item.profile}
                            {#if item.profile.images && item.profile.images.length > 0}
                                <div class="flex-none">
                                    <a href="{$baseUrl}/messaging?id={item.id}">
                                        <img
                                            src={`${$apiUrl}/${item.profile.images[0].url}`}
                                            alt={item.profile.name}
                                            class="h-12 w-12 object-cover rounded-full"
                                        />
                                    </a>
                                </div>
                            {/if}
                        {/if}
                    {/each}
                </div>
            {/if}

            {#if chats?.items}
                {#each chats.items as item}
                    <div class="grid grid-cols-1 gap-3">
                        {#if item.profile}
                            {#if item.profile.images && item.profile.images.length > 0}
                                <div class="flex gap-3">
                                    <div>
                                        <a href="{$baseUrl}/messaging?id={item.chat_id}">
                                            <img
                                                src={`${$apiUrl}/${item.profile.images[0].url}`}
                                                alt={item.profile.name}
                                                class="h-12 w-12 object-cover rounded-full"
                                            />
                                        </a>
                                    </div>
                                    <div class="flex-1">
                                        <a
                                            href="{$baseUrl}/messaging?id={item.chat_id}"
                                            class="block"
                                        >
                                            <div class="font-bold">{item.profile.name}</div>
                                            <div class="text-sm text-gray-600">
                                                {showText(item.text)}
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            {/if}
                        {/if}
                    </div>
                {/each}
            {/if}
        </div>
    </div>
{/if}
