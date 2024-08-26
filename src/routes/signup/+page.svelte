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

    async function SignUp() {
        errorMessage = "";
        try {
            const response = await fetch(`${$apiUrl}/api/v1/user/register`, {
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
    <title>Регистрация - {$titleMain}</title>
</svelte:head>

<div>Регистрация</div>


<div class="max-w-lg mx-auto">
    {#if errorMessage}
        <Flash type="error" message={errorMessage}/>
    {/if}

    <Input name="username" bind:bindValue={username} placeholder="Имя пользователя"/>
    <Input type="password" name="password" bind:bindValue={password} placeholder="Пароль"/>
    <button on:click|preventDefault={SignUp}>Зарегистрироваться</button>
</div>
