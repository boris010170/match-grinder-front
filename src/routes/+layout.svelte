<script>
    import Header from './Header.svelte';
    import '../app.css';
    import {baseUrl, apiUrl, titleMain, uuid, userStore} from '../lib/store';
    import {AuthGetUUID} from '$lib/Auth';
    import {onMount} from "svelte";

    $baseUrl = import.meta.env.VITE_ROOT_URL;
    $apiUrl = import.meta.env.VITE_API_URL;
    $titleMain = "Match Grinder";
    onMount(async () => {
        $uuid = await AuthGetUUID();
    })
</script>

<div class="">
    <Header/>

    <main class="max-w-lg mx-auto px-2">
        <slot/>
    </main>
</div>


