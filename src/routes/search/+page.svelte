<script>
    import {titleMain, userStore, baseUrl} from "$lib/store.js";
</script>
<svelte:head>
    <title>Поиск - {$titleMain}</title>
</svelte:head>

{#if $userStore && !$userStore.is_guest}
    {#if $userStore.in_search}
        <div class="text-center">Поиск...</div>
    {:else}
        <div class="text-center mt-36 text-3xl">
            Сначала необходимо заполнить <a href="{$baseUrl}/profile/data" class="underline">профиль</a>,
            <a href="{$baseUrl}/profile/search" class="underline">параметры поиска</a> и
            <a href="{$baseUrl}/profile/media" class="underline">добавить фотографии</a>.
        </div>
    {/if}
{/if}
