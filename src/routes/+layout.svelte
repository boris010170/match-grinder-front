<script lang="ts">
    import '../app.css';
    import { baseUrl, apiUrl, titleMain, uuid, darkMode, userStore, uploadsUrl } from '$lib/store';
    import { AuthGetUUID, AuthGetUserStore } from '$lib/Auth';
    import { onMount } from 'svelte';
    import ThemeToggle from '$lib/ThemeToggle.svelte';
    import { goto } from '$app/navigation';
    import Navbar from '$lib/nav/Navbar.svelte';
    import Banner from '$lib/Banner.svelte';

    $darkMode = true;
    $baseUrl = import.meta.env.VITE_ROOT_URL || 'http://localhost:5173';
    $apiUrl = import.meta.env.VITE_API_URL;
    $uploadsUrl = $apiUrl;
    $titleMain = 'Match Grinder';

    let innerWidth = 0;
    let innerHeight = 0;

    onMount(async () => {
        $uuid = await AuthGetUUID();
        $userStore = await AuthGetUserStore($uuid, `${$apiUrl}/api/v1/user/show`);

        if ($userStore.is_guest) {
            await goto(`${$baseUrl}/signin`);
        }
    });
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<Banner />
<ThemeToggle />

{#if innerWidth < 640}
    <div class="min-h-screen max-w-lg flex flex-col">
        <div class="flex-grow overflow-auto max-h-[calc(100vh-5rem)] content-center">
            <main class="m-3 sm:max-w-lg sm:mx-auto sm:p-2">
                <slot />
            </main>
        </div>
        <div class="w-full h-20 bg-neutral-800 place-content-center">
            <Navbar />
        </div>
    </div>
{:else}
    <div class="hidden sm:block">
        <div class="max-w-lg mx-auto w-full z-40">
            <Navbar />
        </div>
        <main class="max-w-lg mx-auto p-2">
            <slot />
        </main>
    </div>
{/if}
