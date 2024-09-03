<script>
    import '../app.css';
    import {baseUrl, apiUrl, titleMain, uuid, darkMode, userStore, uploadsUrl} from '$lib/store';
    import {AuthGetUUID, AuthGetUserStore} from '$lib/Auth';
    import {onMount} from "svelte";
    import ThemeToggle from "$lib/ThemeToggle.svelte";
    import {goto} from "$app/navigation";
    import Navbar from "$lib/nav/Navbar.svelte";

    $darkMode = true;
    $baseUrl = import.meta.env.VITE_ROOT_URL;
    $apiUrl = import.meta.env.VITE_API_URL;
    $uploadsUrl = $apiUrl;
    $titleMain = "Match Grinder";

    onMount(async () => {
        $uuid = await AuthGetUUID();
        $userStore = await AuthGetUserStore($uuid, `${$apiUrl}/api/v1/user/show`);

        console.log($userStore);
        if ($userStore.is_guest) {
            await goto(`${$baseUrl}/signin`);
        }
    })
</script>

<div>
    <main class="max-w-lg mx-auto p-2">
        <ThemeToggle/>
        <slot/>
    </main>

    <div class="fixed bottom-0 w-full z-50">
        <div class="p-3 bg-neutral-800 max-w-lg mx-auto">
            <Navbar/>
        </div>
    </div>
</div>


