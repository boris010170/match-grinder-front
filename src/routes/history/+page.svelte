<script lang="ts">
    import {apiUrl, userStore, uuid} from "$lib/store";
    import Flash from "$lib/Flash.svelte";
    import UserCard from "$lib/UserCard.svelte";

    let history = undefined;
    let errorMessage = "";

    async function getHistory() {

        errorMessage = "";
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
                let responseMessage = await response.json();
                errorMessage = responseMessage.message;
                console.log(errorMessage);
            }
        } catch (e) {
            errorMessage = e.message
        }
    }

    $: if ($userStore && $userStore.in_search && history == undefined) {
        history = [];
        getHistory();
    }
</script>
{#if errorMessage}
    <Flash type="error" message={errorMessage}/>
{/if}

{#if $userStore && !$userStore.is_guest && history && history.items}
    {#each history.items as item}
        <UserCard user={item.profile} cardType="history" isLike={item.is_like}/>
    {/each}
{/if}