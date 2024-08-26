<script lang="ts">
    export let type: string;
    export let message: string;
</script>

<div class="[&>div>div>ul>li]:list-disc [&>div>div>ul>li]:ml-2 [&>div>div>ul]:pt-3 [&>div>div>ul]:pl-3">
    {#if (type === 'error')}
        <div class="border border-red-700 text-red-700 bg-red-300 p-3 my-3 rounded shadow">
            {@html message}
        </div>
    {/if}

    {#if (type === 'success')}
        <div class="border border-blue-200 bg-blue-100 text-blue-900 p-3 my-3">
            {@html message}
        </div>
    {/if}

</div>