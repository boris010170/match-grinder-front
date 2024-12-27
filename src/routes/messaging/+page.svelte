<script lang="ts">
    import { apiUrl, userStore, uuid, titleMain, baseUrl } from '$lib/store';
    import { page } from '$app/stores';
    import type { ChatWithMessages } from '$lib/types/chatWithMessages';
    import { bannerStore } from '$lib/stores/bannerStore';
    import Banner from '$lib/Banner.svelte';
    import { tick } from 'svelte';
    import { browser } from '$app/environment';

    let chatWithMessages: ChatWithMessages | undefined = undefined;
    let ChatMessagesResponse: ChatMessagesResponse;
    let chatMessages: Array<ChatMessage> = [];
    let message = '';
    let sending = false;
    let getMessagesUrl: string | undefined = '';
    let scrollToMessageId: string = '';

    async function getChat() {
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
            } else {
                let responseMessage = await response.json();
                bannerStore.add(responseMessage.message, 'error');
            }
        } catch (e) {
            bannerStore.add((e as Error).message, 'error');
        }
    }

    async function getMessages() {
        if (getMessagesUrl === '') {
            getMessagesUrl =
                `${$apiUrl}/api/v1/message?chat_id=` + $page.url.searchParams.get('id');
        }

        if (getMessagesUrl === undefined) return;

        try {
            const response = await fetch(getMessagesUrl, {
                method: 'GET',
                headers: new Headers({
                    uuid: $uuid,
                    'Content-Type': 'application/json'
                })
            });

            if (response.ok) {
                ChatMessagesResponse = await response.json();
                if (ChatMessagesResponse.items.length > 0) {
                    scrollToMessageId = 'message_' + ChatMessagesResponse.items[0].id;
                    chatMessages = [...ChatMessagesResponse.items.reverse(), ...chatMessages];
                    getMessagesUrl = ChatMessagesResponse._links.next?.href || undefined;
                    await tick();
                    scroll();
                }
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
                message = '';
                const newMessage: ChatMessage = await response.json();
                chatMessages = [...chatMessages, newMessage];

                scrollToMessageId = 'message_' + newMessage.id;
                await tick();
                scroll();
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

    function showDate(date: string) {
        const d = new Date(date);
        const today = new Date();
        if (today.toDateString() === d.toDateString()) {
            return d.getHours() + ':' + d.getMinutes().toString().padStart(2, '0');
        }
        return (
            d.getDate().toString().padStart(2, '0') +
            '/' +
            d.getMonth().toString().padStart(2, '0') +
            '<br/>' +
            d.getHours() +
            ':' +
            d.getMinutes().toString().padStart(2, '0')
        );
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

    async function scroll() {
        const message = document.getElementById(scrollToMessageId);
        if (message) {
            message.scrollIntoView();
        } else {
            console.error('message not found');
        }
    }

    $: if ($userStore && $userStore.in_search && chatWithMessages === undefined) {
        getChat();
        getMessages();
    }
</script>

<svelte:head>
    <title>Чат - {$titleMain}</title>
</svelte:head>

<Banner />

{#if chatWithMessages && chatWithMessages.messages}
    <div class="flex flex-col gap-3 h-[calc(100vh-7rem)]">
        <div class="justify-items-center">
            <a href="{$baseUrl}/user?uuid={chatWithMessages.profile.uuid}" class="block">
                <img
                    src={`${$apiUrl}/${chatWithMessages.profile.images[0].url}`}
                    alt={chatWithMessages.profile.name}
                    class="h-12 w-12 object-cover rounded-full"
                />
            </a>
        </div>
        <div class="content-end overflow-scroll flex-1">
            {#if getMessagesUrl}
                <div class="justify-items-center">
                    <button class="border rounded-md px-2 block" on:click={getMessages}
                        >more...</button
                    >
                </div>
            {/if}
            <div
                class="grid grid-cols-1 gap-3 [&>div>*]:rounded-2xl [&>div>*]:inline-block [&>div>*]:px-3 [&>div>*]:py-1"
            >
                {#if chatMessages}
                    {#each chatMessages as message}
                        {#if $userStore.id === message.from_id}
                            <div class="text-right relative">
                                <div
                                    id="message_{message.id}"
                                    class="min-w-24
                                     max-w-72
                                     break-all
                                    !rounded-br-none
                                     text-neutral-200
                                     bg-indigo-800
                                     dark:bg-indigo-800"
                                    style="white-space: pre-line"
                                >
                                    {message.text}
                                </div>

                                <div class="absolute top-0 left-0 !p-0 text-xs text-neutral-600">
                                    {@html showDate(message.created_at_formatted)}
                                </div>
                            </div>
                        {:else}
                            <div class="relative">
                                <div
                                    class="
                                    max-w-72
                                    break-all
                                    !rounded-bl-none
                                    text-neutral-800
                                    bg-gray-200
                                    dark:bg-gray-200"
                                >
                                    {message.text}
                                </div>
                                <div class="absolute top-0 right-0 !p-0 text-xs text-neutral-600">
                                    {@html showDate(message.created_at_formatted)}
                                </div>
                            </div>
                        {/if}
                    {/each}
                {/if}
            </div>
        </div>
        <div>
            <div class="flex gap-3">
                <div class="flex-1">
                    <textarea
                        class="border rounded-md w-full max-h-[72px] p-2 dark:bg-neutral-800 resize-none overflow-y-auto scrollbar-hide"
                        name="text"
                        bind:value={message}
                        placeholder="Сообщение..."
                        rows="1"
                        on:input={textareaOnEvent}
                    ></textarea>
                    <div id="messageTextarea"></div>
                </div>
                <div class="">
                    <button
                        class="border px-3 py-2 rounded-md text-neutral-200"
                        disabled={sending}
                        on:click|preventDefault={async () =>
                            chatWithMessages?.profile &&
                            (await sendMessage(chatWithMessages.profile.id))}
                    >
                        send
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}
