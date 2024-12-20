<script lang="ts">
    import { apiUrl, userStore, uuid, titleMain, baseUrl } from '$lib/store';
    import { page } from '$app/stores';
    import type { ChatWithMessages } from '$lib/types/chatWithMessages';
    import { bannerStore } from '$lib/stores/bannerStore';
    import Banner from '$lib/Banner.svelte';

    let chatWithMessages: ChatWithMessages | undefined = undefined;
    let message = '';
    let sending = false;

    async function getMessages() {
        try {
            const response = await fetch(
                `${$apiUrl}/api/v1/chat/view?id=` + $page.url.searchParams.get('id'),
                {
                    method: 'GET',
                    headers: new Headers({
                        uuid: $uuid,
                        'Content-Type': 'application/json'
                    })
                }
            );

            if (response.ok) {
                chatWithMessages = await response.json();
                console.log(chatWithMessages);
            } else {
                let responseMessage = await response.json();
                bannerStore.add(responseMessage.message, 'error');
            }
        } catch (e) {
            bannerStore.add((e as Error).message, 'error');
        }
    }

    async function sendMessage(to_id: number) {
        sending = true;
        try {
            const response = await fetch(`${$apiUrl}/api/v1/message/create`, {
                method: 'POST',
                headers: new Headers({
                    uuid: $uuid,
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    to_id: to_id,
                    chat_id: $page.url.searchParams.get('id'),
                    text: message
                })
            });
            if (response.ok) {
                const newMessage = await response.json();
                chatWithMessages.messages = [newMessage, ...chatWithMessages.messages];
                console.log(newMessage);
            } else {
                let responseMessage = await response.json();
                bannerStore.add(responseMessage.message, 'error');
            }
            sending = false;
        } catch (e) {
            bannerStore.add((e as Error).message, 'error');
            sending = false;
        }
    }

    /**
     * Auto resize textarea
     * @param e
     */
    function textareaOnEvent(e: Event) {
        const target = e.target as HTMLTextAreaElement;
        target.style.height = 'auto';
        target.style.height = `${target.scrollHeight}px`;
    }

    $: if ($userStore && $userStore.in_search && chatWithMessages === undefined) {
        getMessages();
    }

    $: if (chatWithMessages) {
        const textarea = document.getElementById('messageTextarea');
        if (textarea) {
            textarea.scrollIntoView({ behavior: 'smooth' });
        }
    }
</script>

<svelte:head>
    <title>Чат - {$titleMain}</title>
</svelte:head>

<Banner />

<div class="flex-grow overflow-auto max-h-[calc(100vh-5rem)] content-center"></div>
<div class="flex flex-row h-full w-full ">
    <div class="border">wed</div>
    <div class="border">wedwed</div>
</div>

{#if $userStore && !$userStore.is_guest && chatWithMessages && chatWithMessages.messages}
    <div>
        <a href="{$baseUrl}/user?uuid={chatWithMessages.profile.uuid}">
            <img
                src={`${$apiUrl}/${chatWithMessages.profile.images[0].url}`}
                alt={chatWithMessages.profile.name}
                class="h-12 w-12 object-cover rounded-full"
            />
        </a>
    </div>

    <div
        class="grid grid-cols-1 gap-3 [&>div>*]:rounded-2xl [&>div>*]:inline-block [&>div>*]:px-4 [&>div>*]:py-2"
    >
        {#each chatWithMessages.messages as message}
            {#if $userStore.id === message.from_id}
                <div class="text-right">
                    <div class="!rounded-br-none text-neutral-200 bg-indigo-800 dark:bg-indigo-800">
                        {message.text}
                        {message.id}
                    </div>
                </div>
            {:else}
                <div>
                    <div class="!rounded-bl-none text-neutral-800 bg-gray-200 dark:bg-gray-200">
                        {message.text}
                        {message.id}
                    </div>
                </div>
            {/if}
        {/each}
    </div>

    <div class="flex my-3 gap-3">
        <div class="flex-1">
            <textarea
                class="border rounded-md w-full max-h-[72px] p-2 dark:bg-neutral-800 resize-none overflow-y-auto"
                name="text"
                bind:value={message}
                placeholder="Сообщение..."
                rows="1"
                on:input={textareaOnEvent}
            ></textarea>
            <div id="messageTextarea">2</div>
        </div>
        <div class="">
            <button
                class="border px-3 py-2 rounded-md text-neutral-200"
                on:click|preventDefault={async () =>
                    chatWithMessages?.profile && (await sendMessage(chatWithMessages.profile.id))}
            >
                send
            </button>
        </div>
    </div>
{/if}
