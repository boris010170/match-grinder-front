<script lang="ts">
    import {apiUrl} from "$lib/store";

    let imageIndex = 0;
    export let cardType = "";
    export let isLike = false;

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

    export let user: UserStore | undefined = undefined;
</script>
{#if user}
    {#if user.images}
        <div class="relative">
            <div class="absolute top-0 w-full h-full z-40">
                <div class="grid grid-cols-2 gap-5 h-full">
                    <button class="w-full h-full text-left p-3" on:click={()=>{nextImage(false)}}> ←</button>

                    <button class="w-full h-full text-right p-3 " on:click={()=>{nextImage()}}> →</button>
                </div>
            </div>


            {#each user.images as image, i}
                <img src={$apiUrl}/{image.url} alt="{user.name}" class="object-cover w-full aspect-[3/4]"
                     class:hidden="{imageIndex !== i}"/>
            {/each}
        </div>
    {/if}

    {#if cardType === 'history'}
        {#if isLike}  <span>👍</span>
        {:else}
            <span>👎</span>
        {/if}
    {/if}


    <div>
        {user.name}, {user.age}
    </div>
    <div>
        {user.about}
    </div>
{/if}