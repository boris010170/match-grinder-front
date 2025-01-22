<script lang="ts">
    import { apiUrl, userStore, uuid, baseUrl } from '$lib/store';
    import UserCard from '$lib/UserCard.svelte';
    import { bannerStore } from '$lib/stores/bannerStore';
    import type { HistoryResponse } from '$lib/types/historyResponse';
    import Pagination from '$lib/Paginator.svelte';

    let historyResponse: HistoryResponse | undefined = undefined;
    let currentPage = 1;
    let totalPages = 2;

    async function getHistory() {
        try {
            const response = await fetch(`${$apiUrl}/api/v1/like/history?page=${currentPage}`, {
                method: 'GET',
                headers: new Headers({
                    uuid: $uuid,
                    'Content-Type': 'application/json'
                })
            });

            if (response.ok) {
                historyResponse = await response.json();

                currentPage = historyResponse?._meta?.currentPage || 1;
                totalPages = historyResponse?._meta?.pageCount || 1;
                console.log(history);
            } else {
                const responseMessage = (await response.json()) as { message: string };
                bannerStore.add(responseMessage.message, 'error');
            }
        } catch (e) {
            bannerStore.add((e as Error).message, 'error');
        }
    }

    const handlePageChange = (page: number) => {
        currentPage = page;
        getHistory();
    };

    $: if ($userStore && $userStore.in_search && historyResponse == undefined) {
        getHistory();
    }
</script>

{#if $userStore && !$userStore.is_guest && historyResponse && historyResponse.items}
    <div class="grid grid-cols-2 gap-3">
        {#each historyResponse.items as item}
            <div class="relative">
                <UserCard user={item.profile} />

                <div class="absolute top-2 right-2 z-40">
                    <a href="{$baseUrl}/user?uuid={item.profile.uuid}">
                        {#if item.is_like}
                            <img src="{$baseUrl}/heart2.png" alt="heart" class="w-8 opacity-90" />
                        {:else}
                            <img
                                src="{$baseUrl}/broken-heart-90.png"
                                alt="broken heart"
                                class="w-8 opacity-90"
                            />
                        {/if}
                    </a>
                </div>

                <div class="p-3">
                    <div class="mb-1 text-sm">
                        <a href="{$baseUrl}/user?uuid={item.profile.uuid}">{item.profile.name}</a>, {item
                            .profile.age}
                    </div>
                    <div class="text-xs">
                        {item.profile.about}
                    </div>
                </div>
            </div>
        {/each}
    </div>
    <Pagination {currentPage} {totalPages} onPageChange={handlePageChange} />
{/if}
