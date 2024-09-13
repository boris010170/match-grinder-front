<script>
    import {apiUrl, userStore, uuid} from "$lib/store.js";
    import Input from "$lib/Input.svelte";
    import Flash from "$lib/Flash.svelte";
    import Slider from "$lib/Slider.svelte";

    let errorMessage = "";

    async function save() {
        errorMessage = "";
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
</script>

<svelte:head>
    <title>Параметры поиска</title>
</svelte:head>

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


    <button class="border rounded-md p-3 mb-2 text-center w-full" on:click={save}>Сохранить</button>
{/if}
