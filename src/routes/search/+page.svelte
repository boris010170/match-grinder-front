<script>
    import {titleMain, userStore} from "$lib/store.js";
</script>
<svelte:head>
    <title>Поиск - {$titleMain}</title>
</svelte:head>

{#if $userStore && !$userStore.is_guest}
    <div class="text-center">Пока пусто</div>
{/if}
