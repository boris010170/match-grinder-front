<script>
    import {apiUrl, userStore, uuid} from "$lib/store.js";
    import Input from "$lib/Input.svelte";
    import Flash from "$lib/Flash.svelte";
    import Slider from "$lib/Slider.svelte";
    import Message from "$lib/Message.svelte";
    import {slide} from 'svelte/transition';

    let errorMessage = "";
    let saving = false;
    let message = "";

    async function save() {
        errorMessage = "";
        saving = true;
        try {
            const response = await fetch(`${$apiUrl}/api/v1/user/update`, {
                method: 'POST',
                body: JSON.stringify($userStore),
                headers: new Headers({
                    'uuid': $uuid,
                    'Content-Type': 'application/json',
                }),
            });

            if (response.ok) {
                $userStore = await response.json();
                message = "Данные успешно сохранены";
                setTimeout(() => {
                    message = ""
                }, 1500);

            } else {
                let responseMessage = await response.json();
                errorMessage = responseMessage.message;
                console.log(errorMessage);
            }
        } catch (e) {
            errorMessage = e.message
        }

        saving = false;
    }
</script>

<svelte:head>
    <title>Параметры поиска</title>
</svelte:head>

<div class="relative">
    {#if message}
        <div transition:slide={{ duration: 300, axis: 'y' }}
             class="absolute top-0 left-0 z-50 w-full bg-indigo-800 px-3 py-2 rounded-md text-neutral-200">
            <Message bind:message={message}/>
        </div>
    {/if}
</div>

{#if $userStore && !$userStore.is_guest}

    {#if errorMessage}
        <Flash type="error" message={errorMessage}/>
    {/if}
    <Input type="select"
           name="search_sex"
           label="Пол"
           placeholder="Пол"
           bind:bindValue="{$userStore.search_sex}"
           options="{[{'value': 'M', 'label': 'Мужской'}, {'value': 'F', 'label': 'Женский'}]}"
           on:change={save}/>

    <div class="mb-3">
        Радиус поиска {$userStore.search_radius} км
        <Slider min="{3}" max="{350}" bind:rangeFrom={$userStore.search_radius}/>
    </div>

    <div class="mb-3">
        Возраст {$userStore.search_from} - {$userStore.search_to}
        <Slider min="{18}" max="{60}" bind:rangeFrom={$userStore.search_from} bind:rangeTo={$userStore.search_to}
                range="{true}"/>
    </div>

    <div class="mb-3">
        Рост {$userStore.search_height_from} - {$userStore.search_height_to}
        <Slider min="{130}" max="{210}" bind:rangeFrom={$userStore.search_height_from}
                bind:rangeTo={$userStore.search_height_to} range="{true}"/>
    </div>

    <div class="mb-3">
        Вес {$userStore.search_weight_from} - {$userStore.search_weight_to}
        <Slider min="{40}" max="{150}" bind:rangeFrom={$userStore.search_weight_from}
                bind:rangeTo={$userStore.search_weight_to} range="{true}"/>
    </div>


    {#if saving}
        <button class="border rounded-md p-3 mb-2 text-center w-full">Сохранение...</button>
    {:else}
        <button class="border rounded-md p-3 mb-2 text-center w-full" on:click={save}>Сохранить</button>
    {/if}
{/if}
