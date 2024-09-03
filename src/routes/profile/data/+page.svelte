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
    <title>Профиль</title>
</svelte:head>

{#if $userStore && !$userStore.is_guest}

    {#if errorMessage}
        <Flash type="error" message={errorMessage}/>
    {/if}

    <Input name="name" label="Имя" placeholder="Имя" bind:bindValue="{$userStore.name}" on:change={save}/>
    <Input type="select"
           name="sex"
           label="Пол"
           placeholder="Пол"
           bind:bindValue="{$userStore.sex}"
           options="{[{'value': 'M', 'label': 'Мужской'}, {'value': 'F', 'label': 'Женский'}]}"
           on:change={save}/>

    <Input name="birth_year" label="Год рождения" placeholder="Год рождения" bind:bindValue="{$userStore.birth_year}"
           on:change={save}/>
    <Input name="height" label="Рост" placeholder="Рост" bind:bindValue="{$userStore.height}" on:change={save}/>
    <Input name="weight" label="Вес" placeholder="Вес" bind:bindValue="{$userStore.weight}" on:change={save}/>

    <Input type="select"
           name="zodiac"
           label="Знак зодиака"
           placeholder="Знак зодиака"
           bind:bindValue="{$userStore.zodiac}"
           options="{[
               {'value': 'Aries', 'label': 'Овен'},
               {'value': 'Taurus', 'label': 'Телец'},
               {'value': 'Gemini', 'label': 'Близнецы'},
               {'value': 'Cancer', 'label': 'Рак'},
               {'value': 'Leo', 'label': 'Лев'},
               {'value': 'Virgo', 'label': 'Дева'},
               {'value': 'Libra', 'label': 'Весы'},
               {'value': 'Scorpio', 'label': 'Скорпион'},
               {'value': 'Sagittarius', 'label': 'Стрелец'},
               {'value': 'Capricorn', 'label': 'Козерог'},
               {'value': 'Aquarius', 'label': 'Водолей'},
               {'value': 'Pisces', 'label': 'Рыбы'}
               ]}"
           on:change={save}/>
{/if}