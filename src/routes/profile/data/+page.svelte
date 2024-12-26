<script lang="ts">
    import { apiUrl, userStore, uuid, titleMain } from '$lib/store.js';
    import Input from '$lib/Input.svelte';
    import Flash from '$lib/Flash.svelte';
    import Message from '$lib/Message.svelte';
    import { slide } from 'svelte/transition';

    let errorMessage = '';
    let saving = false;
    let message = '';

    async function save() {
        errorMessage = '';
        saving = true;
        try {
            const response = await fetch(`${$apiUrl}/api/v1/user/update`, {
                method: 'POST',
                body: JSON.stringify($userStore),
                headers: new Headers({
                    uuid: $uuid,
                    'Content-Type': 'application/json'
                })
            });

            if (response.ok) {
                $userStore = await response.json();
                message = 'Данные успешно сохранены';
                setTimeout(() => {
                    message = '';
                }, 1500);
            } else {
                let responseMessage = await response.json();
                errorMessage = responseMessage.message;
                console.log(errorMessage);
            }
        } catch (e) {
            errorMessage = e.message;
        }
        saving = false;
    }

    let theMap: object | null = null;
    let theMarker: object | null = null;

    async function mapInit() {
        try {
            ymaps.ready(TheMapInit);
        } catch (e) {
            console.log(e);
            setTimeout(mapInit, 300);
        }
    }

    async function TheMapInit() {
        if (!theMap) {
            if ($userStore.lat == 0.0) {
                $userStore.lat = 55.76;
            }
            if ($userStore.lng == 0.0) {
                $userStore.lng = 37.64;
            }
            theMap = new ymaps.Map(
                'theMap',
                {
                    center: [$userStore.lat, $userStore.lng],
                    zoom: 12
                },
                { searchControlProvider: 'yandex#search' }
            );
            theMarker = new ymaps.Placemark(theMap.getCenter());
            theMap.geoObjects.add(theMarker);
            // Отслеживает все перемещения карты, даже перетаскивание пользователем и плавное масштабирование
            theMap.events.add('actionend', () => {
                theMarker.geometry.setCoordinates(theMap.getCenter());
                [$userStore.lat, $userStore.lng] = theMap.getCenter();
                save();
            });
        }
    }

    $: if ($userStore && !$userStore.is_guest) {
        mapInit();
    }
</script>

<svelte:head>
    <title>Профиль - {$titleMain}</title>
    <script
        defer
        async
        src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=cf1b8beb-bb0c-4563-9d28-c603002dd2ad"
    >
    </script>
</svelte:head>

<div class="relative">
    {#if message}
        <div
            transition:slide={{ duration: 300, axis: 'y' }}
            class="absolute top-0 left-0 z-50 w-full bg-indigo-800 px-3 py-2 rounded-md text-neutral-200"
        >
            <Message bind:message />
        </div>
    {/if}
</div>

{#if $userStore && !$userStore.is_guest}
    {#if errorMessage}
        <Flash type="error" message={errorMessage} />
    {/if}

    <Input name="name" label="Имя" placeholder="Имя" bind:bindValue={$userStore.name} />
    <Input
        type="select"
        name="sex"
        label="Пол"
        placeholder="Пол"
        bind:bindValue={$userStore.sex}
        options={[
            { value: 'M', label: 'Мужской' },
            { value: 'F', label: 'Женский' }
        ]}
    />

    <Input
        name="birth_year"
        label="Год рождения"
        placeholder="Год рождения"
        bind:bindValue={$userStore.birth_year}
    />
    <Input name="height" label="Рост" placeholder="Рост" bind:bindValue={$userStore.height} />
    <Input name="weight" label="Вес" placeholder="Вес" bind:bindValue={$userStore.weight} />

    <Input
        type="select"
        name="zodiac"
        label="Знак зодиака"
        placeholder="Знак зодиака"
        bind:bindValue={$userStore.zodiac}
        options={[
            { value: 'Aries', label: 'Овен' },
            { value: 'Taurus', label: 'Телец' },
            { value: 'Gemini', label: 'Близнецы' },
            { value: 'Cancer', label: 'Рак' },
            { value: 'Leo', label: 'Лев' },
            { value: 'Virgo', label: 'Дева' },
            { value: 'Libra', label: 'Весы' },
            { value: 'Scorpio', label: 'Скорпион' },
            { value: 'Sagittarius', label: 'Стрелец' },
            { value: 'Capricorn', label: 'Козерог' },
            { value: 'Aquarius', label: 'Водолей' },
            { value: 'Pisces', label: 'Рыбы' }
        ]}
    />

    {#if saving}
        <button class="border rounded-md p-3 mb-2 text-center w-full">Сохранение...</button>
    {:else}
        <button class="border rounded-md p-3 mb-2 text-center w-full" on:click={save}
            >Сохранить</button
        >
    {/if}

    <div id="theMap" class="h-96 border"></div>
{/if}
