<script>
    import {baseUrl, apiUrl} from "$lib/store.js";

    export let avatar = "";
</script>

<div class="w-3/4 mx-auto">
    {avatar}
    {#if avatar}
        <img src="{$apiUrl}/{avatar}" alt="avatar" class="rounded-full aspect-square object-cover"/>
    {:else}
        <img src="{$baseUrl}/bleat.jpg" alt="avatar" class="rounded-full aspect-square object-cover"/>
    {/if}
</div>