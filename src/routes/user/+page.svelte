<script lang="ts">
    import { apiUrl, userStore, uuid } from '$lib/store';
    import { page } from '$app/stores';
    import { afterNavigate } from '$app/navigation';
    import { bannerStore } from '$lib/stores/bannerStore';
    import Banner from '$lib/Banner.svelte';
    import type { User } from '$lib/types/user';
    import UserCard from '$lib/UserCard.svelte';

    let user: User | undefined = undefined;

    afterNavigate(() => {
        getUser();
    });

    async function getUser() {
        if (!$userStore) {
            return;
        }

        try {
            const response = await fetch(
                `${$apiUrl}/api/v1/profile/show?uuid=${$page.url.searchParams.get('uuid')}`,
                {
                    method: 'GET',
                    headers: new Headers({
                        uuid: $uuid,
                        'Content-Type': 'application/json'
                    })
                }
            );

            if (response.ok) {
                user = (await response.json()) as User;
                console.log(user);
            } else {
                const responseMessage = (await response.json()) as { message: string };
                bannerStore.add(responseMessage.message, 'error');
            }
        } catch (e) {
            bannerStore.add((e as Error).message, 'error');
        }
    }

    $: if (!user && $userStore && $uuid) {
        getUser();
    }
</script>

<Banner />

{#if user}
    <UserCard {user} />

    <div class="p-3">
        <div class="mb-3 text-xl">
            {user.name}, {user.age}
        </div>
        <div class="text-muted">
            {user.about}
        </div>
    </div>
{/if}
