<script lang="ts">
    import {apiUrl, uploadsUrl, uuid, userStore} from "$lib/store.js";

    export let images: Image[] = [];
    let errorMessage;

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

    async function imageDelete(index: number) {

        const response = await fetch(`${$apiUrl}/api/v1/user/delete-image?id=${images[index].id}`, {
            method: 'DELETE',
            headers: new Headers({
                'uuid': $uuid,
                'Content-Type': 'application/json',
            }),
        });
        if (response.ok) {
            images = await response.json();
        } else {
            errorMessage = await response.json();
            console.log(errorMessage);
        }
    }

    function imageSort(index: number, up = 1) {
        if (up === 1) {
            images = imageMoveUp(images, index);
        } else {
            images = imageMoveDown(images, index);
        }
        images.reduce((acc, item, index) => {
            images[index].sort = index + 1;
            return acc + 1;
        }, 0);

        save();
    }

    // Функция для перемещения элемента массива вверх
    function imageMoveUp(arr: Image[], index: number) {
        if (index <= 0 || index >= arr.length) {
            return arr; // Невозможно переместить вверх
        }
        [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
        return arr;
    }

    // Функция для перемещения элемента массива вниз
    function imageMoveDown(arr: Image[], index: number) {
        if (index < 0 || index >= arr.length - 1) {
            return arr; // Невозможно переместить вниз
        }
        [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
        return arr;
    }
</script>
{#if images}
    <div class="grid grid-cols-3 gap-2">
        {#each images as image, i}
            <div>
                <div class="w-full aspect-square items-center justify-center">
                    <img src="{$uploadsUrl}/{image.url}"
                         class="h-full mx-auto object-cover"
                         alt="{image.name}"/>
                </div>
                <div class="flex gap-2">
                    <div>
                        <button on:click={()=>imageSort(i,1)}> ⬆️</button>
                    </div>
                    <div>
                        <button on:click={()=>imageSort(i,0)}> ⬇️</button>
                    </div>
                    <div class="flex-auto">
                    </div>
                    <div class="text-right">
                        <button class="" on:click={()=>imageDelete(i)}>[X]</button>
                    </div>
                </div>
            </div>
        {/each}
    </div>
{/if}