<script>
    import {titleMain, baseUrl, userStore} from '$lib/store.js';
    import ProfileAvatar from "$lib/profile/ProfileAvatar.svelte";
</script>

<svelte:head>
    <title>Профиль - {$titleMain}</title>
</svelte:head>

{#if $userStore && !$userStore.is_guest}
    <div>
        <div class="mb-3">
            <ProfileAvatar avatar="{($userStore.images && $userStore.images[0]) ? $userStore.images[0] : ''}"/>
        </div>

        <div class="text-center text-lg mb-3">
            {$userStore.name ?? 'энписи'}, {$userStore.age}
        </div>
    </div>

    <div>
        <div class="border rounded-md p-3 mb-2 text-center"><a href="{$baseUrl}/profile/data" class="block">Личные
            данные</a></div>
        <div class="border rounded-md p-3 mb-2 text-center"><a href="{$baseUrl}/profile/media" class="block">Медиа</a>
        </div>
        <div class="border rounded-md p-3 mb-2 text-center"><a href="{$baseUrl}/profile/search" class="block">Настройки
            поиска</a></div>
    </div>
{/if}