<script lang="ts">
    import {apiUrl, userStore, uuid, titleMain} from "$lib/store";
    import Flash from "$lib/Flash.svelte";
    import {page} from '$app/stores'

    let chat = undefined;
    let message = "";
    let sending = false;
    let errorMessage = "";

    async function getMessages() {
        errorMessage = "";
        try {
            const response = await fetch(`${$apiUrl}/api/v1/chat/view?id=` + $page.url.searchParams.get('id'), {
                method: 'GET',
                headers: new Headers({
                    'uuid': $uuid,
                    'Content-Type': 'application/json',
                }),
            });

            if (response.ok) {
                chat = await response.json();
                console.log(chat);
            } else {
                let responseMessage = await response.json();
                errorMessage = responseMessage.message;
                console.log(errorMessage);
            }
        } catch (e) {
            errorMessage = e.message
        }
    }

    async function sendMessage(to_id: number) {
        errorMessage = "";
        sending = true;
        try {
            const response = await fetch(`${$apiUrl}/api/v1/message/create`, {
                    method: 'POST',
                    headers: new Headers({
                        'uuid': $uuid,
                        'Content-Type': 'application/json',
                    }),
                    body: JSON.stringify({
                        to_id: to_id,
                        chat_id: $page.url.searchParams.get('id'),
                        text: message
                    }),
                })
            ;

            if (response.ok) {
                const newMessage = await response.json();
                chat.messages = [newMessage, ...chat.messages];
                console.log(newMessage);
            } else {
                let responseMessage = await response.json();
                errorMessage = responseMessage.message;
                console.log(errorMessage);
            }
            sending = false;
        } catch (e) {
            errorMessage = e.message
            sending = false;
        }
    }

    $: if ($userStore && $userStore.in_search && chat === undefined) {
        chat = {messages: []};
        getMessages();
    }
</script>
<svelte:head>
    <title>Чат - {$titleMain}</title>
</svelte:head>
{#if errorMessage}
    <Flash type="error" message={errorMessage}/>
{/if}
{#if $userStore && !$userStore.is_guest && chat && chat.messages}
    <div class="grid grid-cols-1 gap-3 [&>div>*]:rounded-2xl [&>div>*]:inline-block [&>div>*]:px-4 [&>div>*]:py-2">
        {#each chat.messages as message}
            {#if $userStore.id === message.from_id}
                <div class="text-right">
                    <div class="!rounded-br-none text-neutral-200 bg-indigo-800 dark:bg-indigo-800">
                        {message.text} {message.id}
                    </div>
                </div>

            {:else}
                <div>
                    <div class="!rounded-bl-none text-neutral-800 bg-gray-200 dark:bg-gray-200">
                        {message.text} {message.id}
                    </div>
                </div>
            {/if}
        {/each}
    </div>

    <div class="flex items-center">
        <div class="flex-1">
            <textarea class="border w-full h-20 dark:bg-neutral-800" name="text" bind:value={message}
                      placeholder="Сообщение..."></textarea>
        </div>
        <div class="">
            <!-- icon666.com - MILLIONS vector ICONS FREE -->
            <button on:click|preventDefault={async () => await sendMessage(chat.profile.id) }>
                <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" width="40" height="40"
                     class="fill-neutral-200">
                    <g id="send">
                        <path d="m54 32-44 17.59 8.08-17.59-8.08-17.59z"/>
                    </g>
                </svg>

            </button>
        </div>
    </div>
{/if}