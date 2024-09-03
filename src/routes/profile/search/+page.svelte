<script>
    import {apiUrl, userStore, uuid} from "$lib/store.js";
    import Input from "$lib/Input.svelte";
    import Flash from "$lib/Flash.svelte";

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

    <Input name="search_radius" label="Радиус поиска" placeholder="Радиус поиск"
           bind:bindValue="{$userStore.search_radius}" on:change={save}/>

    <Input name="search_height_from" label="Рост от" placeholder="Рост от"
           bind:bindValue="{$userStore.search_height_from}" on:change={save}/>
    <Input name="search_height_to" label="Рост до" placeholder="Рост до" bind:bindValue="{$userStore.search_height_to}"
           on:change={save}/>

    <Input name="search_weight_from" label="Вес от" placeholder="Вес от"
           bind:bindValue="{$userStore.search_weight_from}" on:change={save}/>
    <Input name="search_weight_to" label="Вес до" placeholder="Вес до" bind:bindValue="{$userStore.search_weight_to}"
           on:change={save}/>


{/if}
