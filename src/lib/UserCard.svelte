<script lang="ts">
    import { apiUrl } from '$lib/store';
    import type { User } from '$lib/types/user';

    let imageIndex = 0;

    function nextImage(next = true) {
        if (!user || !user.images) return;

        if (next) {
            imageIndex++;
            if (imageIndex >= user.images.length) imageIndex = 0;
        } else {
            imageIndex--;
            if (imageIndex < 0) imageIndex = user.images.length - 1;
        }
    }

    export let user: User | Profile | undefined = undefined;
</script>

{#if user}
    {#if user.images}
        <div class="relative">
            <div class="absolute top-0 w-full h-full z-40">
                <div class="grid grid-cols-2 gap-5 h-full">
                    <button
                        class="w-full h-full text-left p-3"
                        on:click={() => {
                            nextImage(false);
                        }}
                    >
                        ←
                    </button>

                    <button
                        class="w-full h-full text-right p-3"
                        on:click={() => {
                            nextImage();
                        }}
                    >
                        →
                    </button>
                </div>
            </div>

            {#each user.images as image, i}
                <img
                    src="{$apiUrl}/{image.url}"
                    alt={user.name}
                    class="object-cover w-full aspect-[3/4]"
                    class:hidden={imageIndex !== i}
                    class:opacity-5={import.meta.env.VITE_ENV === 'dev'}
                />
            {/each}
        </div>
    {/if}
{/if}
