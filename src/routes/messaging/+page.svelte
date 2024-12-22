<script lang="ts">
    import { apiUrl, userStore, uuid, titleMain, baseUrl } from '$lib/store';
    import { page } from '$app/stores';
    import type { ChatWithMessages } from '$lib/types/chatWithMessages';
    import { bannerStore } from '$lib/stores/bannerStore';
    import Banner from '$lib/Banner.svelte';

    let chatWithMessages: ChatWithMessages | undefined = undefined;
    let chatMessages: Array<ChatMessage> = [];
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
                chatMessages = (chatWithMessages as ChatWithMessages).messages;
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
                const newMessage: ChatMessage = await response.json();
                chatMessages = [newMessage, ...chatMessages];
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

{#if chatWithMessages && chatWithMessages.messages}
    <div class="flex flex-col gap-3 h-[calc(100vh-7rem)]">
        <div class="justify-center">
            <div>
                <a href="{$baseUrl}/user?uuid={chatWithMessages.profile.uuid}">
                    <img
                        src={`${$apiUrl}/${chatWithMessages.profile.images[0].url}`}
                        alt={chatWithMessages.profile.name}
                        class="h-12 w-12 object-cover rounded-full"
                    />
                </a>
            </div>
        </div>
        <div class="flex-1 content-end">
            <div
                class="grid grid-cols-1 gap-3 [&>div>*]:rounded-2xl [&>div>*]:inline-block [&>div>*]:px-4 [&>div>*]:py-2"
            >
                {#if chatMessages}
                    {#each chatMessages as message}
                        {#if $userStore.id === message.from_id}
                            <div class="text-right">
                                <div
                                    class="!rounded-br-none text-neutral-200 bg-indigo-800 dark:bg-indigo-800"
                                >
                                    {message.text}
                                    {message.id}
                                </div>
                            </div>
                        {:else}
                            <div>
                                <div
                                    class="!rounded-bl-none text-neutral-800 bg-gray-200 dark:bg-gray-200"
                                >
                                    {message.text}
                                    {message.id}
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
