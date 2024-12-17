<script lang="ts">
    import {apiUrl, userStore, uuid} from "$lib/store";
    import Flash from "$lib/Flash.svelte";
    import UserCard from "$lib/UserCard.svelte";
    import { bannerStore } from "$lib/stores/bannerStore";
	import Banner from "$lib/Banner.svelte";

    let history = undefined;

    async function getHistory() {
        try {
            const response = await fetch(`${$apiUrl}/api/v1/like/history`, {
                method: 'GET',
                headers: new Headers({
                    'uuid': $uuid,
                    'Content-Type': 'application/json',
                }),
            });

            if (response.ok) {
                history = await response.json();
                console.log(history);
            } else {
                const responseMessage = await response.json() as { message: string };
                bannerStore.add(responseMessage.message, 'error')
            }
        } catch (e) {
            bannerStore.add((e as Error).message, 'error')
        }
    }

    $: if ($userStore && $userStore.in_search && history == undefined) {
        history = [];
        getHistory();
    }
</script>
<Banner />

{#if $userStore && !$userStore.is_guest && history && history.items}
    {#each history.items as item}
        <UserCard user={item.profile} cardType="history" isLike={item.is_like}/>
    {/each}
{/if}