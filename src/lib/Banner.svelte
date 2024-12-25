<script lang="ts">
    import { bannerStore } from '$lib/stores/bannerStore';
    import type { BannerType } from '$lib/types/banner';
    import { slide, fade } from 'svelte/transition';

    const typeStyles: Record<BannerType, string> = {
        info: 'bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300',
        success:
            'bg-green-100 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-300',
        error: 'border border-red-700 text-red-700 bg-red-300 p-3 my-3 rounded shadow',
        warning:
            'bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-300'
    };

    const typeIcons: Record<BannerType, string> = {
        info: 'ℹ️',
        success: '✅',
        error: '❌',
        warning: '⚠️'
    };
</script>

<div
    class="fixed top-4 right-4 z-50 flex flex-col gap-2 sm:w-auto w-[calc(100%-2rem)] [&>div>div>ul>li]:list-disc [&>div>div>ul>li]:ml-2 [&>div>div>ul]:pt-3 [&>div>div>ul]:pl-3"
>
    {#each $bannerStore as { id, message, type = 'info' } (id)}
        <div
            class="shadow-lg rounded-lg p-4 pointer-events-auto relative border {typeStyles[type]}"
            in:slide={{ duration: 300 }}
            out:fade={{ duration: 200 }}
        >
            <button
                class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                on:click={() => bannerStore.remove(id)}
            >
                ✕
            </button>
            <div class="flex items-center">
                <span class="mr-2 text-xl">{typeIcons[type]}</span>
                <p class="flex-1">{@html message}</p>
            </div>
        </div>
    {/each}
</div>

<style>
    .fixed {
        pointer-events: none;
    }
    div > div {
        pointer-events: auto;
    }
</style>
