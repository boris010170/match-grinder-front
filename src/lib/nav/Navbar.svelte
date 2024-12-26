<script>
    import { baseUrl, userStore } from '$lib/store';
    // https://icons8.com/icon/set/login/ios
</script>

{#if $userStore && !$userStore.is_guest}
    <div
        class="grid grid-cols-4
[&>div]:text-center
[&>div>a>svg]:mx-auto
[&>div>a>img]:mx-auto
items-center
"
    >
        <div>
            <a href="{$baseUrl}/search">
                <img src="{$baseUrl}/icons/search-w-1.png" alt="profile" class="w-8 opacity-80" />
                Поиск
            </a>
        </div>

        <div>
            <a href="{$baseUrl}/chats">
                <img src="{$baseUrl}/icons/chat-w-1.png" alt="profile" class="w-8 opacity-80" />
                Чаты
            </a>
        </div>
        <div>
            <a href="{$baseUrl}/history">
                <img src="{$baseUrl}/icons/history-w.png" alt="profile" class="w-8 opacity-80" />
                История
            </a>
        </div>
        <div>
            <a href="{$baseUrl}/profile">
                <img src="{$baseUrl}/icons/user-w.png" alt="profile" class="w-8 opacity-80" />
                Профиль
            </a>
        </div>
    </div>
{:else}
    <div
        class="grid grid-cols-1
    [&>div]:text-center
    [&>div>a>img]:mx-auto
    items-center"
    >
        <div>
            <a href="{$baseUrl}/signin">
                <img src="{$baseUrl}/icons/login-w.png" alt="login" class="w-5 opacity-80" />
                Войти
            </a>
        </div>
    </div>
{/if}
