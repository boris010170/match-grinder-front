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

    onMount(async () => {
        $uuid = await AuthGetUUID();
        $userStore = await AuthGetUserStore($uuid, `${$apiUrl}/api/v1/user/show`);

        console.log($userStore);
        if ($userStore.is_guest) {
            await goto(`${$baseUrl}/signin`);
        }
    });
</script>

<Banner />

<div class="sm:hidden min-h-screen max-w-lg flex flex-col">
    <div class="flex-grow overflow-auto max-h-[calc(100vh-5rem)] content-center">
        <ThemeToggle />
        <div class="m-3">
            <slot />
        </div>
    </div>
    <div class="w-full h-20 bg-neutral-800">
        <Navbar />
    </div>
</div>

<div class="hidden sm:block">
    <div class="max-w-lg mx-auto w-full z-40">
        <Navbar />
    </div>
    <main class="max-w-lg mx-auto p-2">
        <ThemeToggle />
        <slot />
    </main>
</div>
