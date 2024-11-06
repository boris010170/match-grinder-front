<script lang="ts">
    import {apiUrl, userStore, uuid, baseUrl} from "$lib/store";
    import Flash from "$lib/Flash.svelte";

    let newChats = undefined;
    let chats = undefined;
    let errorMessage = "";

    async function getChats() {

        errorMessage = "";
        try {
            const response = await fetch(`${$apiUrl}/api/v1/chat/chat-messages`, {
                method: 'GET',
                headers: new Headers({
                    'uuid': $uuid,
                    'Content-Type': 'application/json',
                }),
            });

            if (response.ok) {
                chats = await response.json();
            } else {
                let responseMessage = await response.json();
                errorMessage = responseMessage.message;
                console.log(errorMessage);
            }
        } catch (e) {
            errorMessage = e.message
        }
    }

    async function getNewChats() {

        errorMessage = "";
        try {
            const response = await fetch(`${$apiUrl}/api/v1/chat/new`, {
                method: 'GET',
                headers: new Headers({
                    'uuid': $uuid,
                    'Content-Type': 'application/json',
                }),
            });

            if (response.ok) {
                newChats = await response.json();
            } else {
                let responseMessage = await response.json();
                errorMessage = responseMessage.message;
                console.log(errorMessage);
            }
        } catch (e) {
            errorMessage = e.message
        }
    }

    $: if ($userStore && $userStore.in_search && chats === undefined) {
        newChats = [];
        chats = [];
        getChats();
        getNewChats();
    }
</script>
{#if errorMessage}
    <Flash type="error" message={errorMessage}/>
{/if}

{#if $userStore && !$userStore.is_guest}

    {#if newChats && newChats.items}
        {#each newChats.items as item}
            <div class="flex flex-nowrap gap-2 overflow-scroll scrollbar-hide">
                {#each {length: 20} as _, i}

                    {#if item.profile}
                        {#if item.profile.images && item.profile.images.length > 0}
                            <div class="flex-none">
                                <a href="{$baseUrl}/messaging/{item.id}">
                                    <img src={$apiUrl}/{item.profile.images[0].url} alt="{item.profile.name}"
                                         class="h-12 w-12 object-cover rounded-full"/>
                                </a>
                            </div>
                        {/if}
                    {/if}

                {/each}
            </div>
        {/each}
    {/if}

    {#if chats && chats.items}
        {#each chats.items as item}
            <div class="grid grid-cols-1 gap-3">
                {#each {length: 20} as _, i}

                    {#if item.profile}
                        {#if item.profile.images && item.profile.images.length > 0}
                            <div class="flex gap-3">
                                <div>
                                    <a href="{$baseUrl}/messaging/{item.chat_id}">
                                        <img src={$apiUrl}/{item.profile.images[0].url} alt="{item.profile.name}"
                                             class="h-12 w-12 object-cover rounded-full"/>
                                    </a>
                                </div>
                                <div class=" flex-1">
                                    <a href="{$baseUrl}/messaging/{item.chat_id}" class="block"> {item.text}</a>
                                </div>

                            </div>
                        {/if}
                    {/if}

                {/each}
            </div>
        {/each}
    {/if}

{/if}

