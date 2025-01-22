<script lang="ts">
    export let currentPage: number;
    export let totalPages: number;
    export let windowSize: number = 3;
    export let onPageChange: (page: number) => void;
    const itemClass = 'p-1 uppercase';
    let startPage: number;
    let endPage: number;
    let pages: Array<number> = [];

    const getPages = () => {
        startPage = Number(currentPage) - (Number(windowSize) - 1) / 2;
        if (startPage < 1) {
            startPage = 1;
        }

        endPage = Number(startPage + Number(windowSize));
        if (endPage > Number(totalPages)) {
            endPage = Number(totalPages);
            startPage = endPage - Number(windowSize);
        }

        if (startPage < 1) {
            startPage = 1;
        }

        pages = Array.from(Array(endPage + 1).keys()).slice(startPage);
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    $: if (currentPage) {
        getPages();
    }
</script>

{#if totalPages > 1}
    <div class="text-lg m-3 text-center">
        {#if Number(currentPage) != 1}
            <button class={itemClass} on:click={() => handlePageChange(1)}>1</button>
            <button class={itemClass} on:click={() => handlePageChange(currentPage - 1)}>
                &laquo;
            </button>
        {/if}

        {#each pages as page}
            {#if page == Number(currentPage)}
                <span class="{itemClass} font-bold">{page}</span>
            {:else}
                <button class={itemClass} on:click={() => handlePageChange(page)}>{page}</button>
            {/if}
        {/each}

        {#if Number(currentPage) < Number(totalPages)}
            <button class={itemClass} on:click={() => handlePageChange(currentPage + 1)}>
                &raquo;
            </button>
            <button class={itemClass} on:click={() => handlePageChange(totalPages)}
                >{totalPages}</button
            >
        {/if}
    </div>
{/if}
