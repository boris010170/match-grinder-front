<script>
    import {baseUrl, titleMain, userStore} from "$lib/store.js";
    import {apiUrl, uuid} from "$lib/store.js";
    import Input from "$lib/Input.svelte";
    import Flash from "$lib/Flash.svelte";
    import {browser} from "$app/environment";
    import {goto} from "$app/navigation";

    let username = "";
    let password = "";
    let errorMessage = "";

    async function SignIn() {
        errorMessage = "";
        try {
            const response = await fetch(`${$apiUrl}/api/v1/user/login`, {
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
                headers: new Headers({
                    'uuid': $uuid,
                    'Content-Type': 'application/json',
                }),
            });

            if (response.ok) {
                $userStore = await response.json();
                console.log($userStore);
            } else {
                let responseMessage = await response.json();
                errorMessage = responseMessage.message;
                console.log(errorMessage);
            }
        } catch (e) {
            errorMessage = e.message
        }
    }

    $: if ($userStore && !$userStore.is_guest) {
        if (browser) {
            goto($baseUrl);
        }
    }
</script>

<svelte:head>
    <title>Авторизация - {$titleMain}</title>
</svelte:head>

<div>Авторизация</div>

<div class="max-w-lg mx-auto">
    {#if errorMessage}
        <Flash type="error" message={errorMessage}/>
    {/if}

    <Input name="username" bind:bindValue={username} placeholder="Имя пользователя"/>
    <Input type="password" name="password" bind:bindValue={password} placeholder="Пароль"/>

    <div class="flex gap-3 justify-end">
        <div class="py-2">
            <a href="{$baseUrl}/signup">Регистрация</a>
        </div>
        <div class="text-right">
            <button on:click|preventDefault={SignIn} class="bg-indigo-800 px-3 py-2 rounded-md text-neutral-200">Войти
            </button>
        </div>
    </div>
</div>
