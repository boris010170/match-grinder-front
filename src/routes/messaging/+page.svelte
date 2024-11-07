<script lang="ts">
    import {apiUrl, userStore, uuid, titleMain} from "$lib/store";
    import Flash from "$lib/Flash.svelte";
    import {page} from '$app/stores'

    let chat = undefined;
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
{/if}