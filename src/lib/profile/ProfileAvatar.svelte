<script>
    import {baseUrl, uploadsUrl} from "$lib/store.js";

    export let avatar = "";
</script>

<div class="w-3/4 mx-auto">
    {#if avatar}
        <img src="{$uploadsUrl}/{avatar}" alt="avatar" class="rounded-full aspect-square object-cover"/>
    {:else}
        <img src="{$baseUrl}/bleat.jpg" alt="avatar" class="rounded-full aspect-square object-cover"/>
    {/if}
</div>