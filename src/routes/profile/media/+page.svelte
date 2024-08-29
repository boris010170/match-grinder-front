<script>
    import {apiUrl, baseUrl, userStore, uuid, uploadsUrl} from "$lib/store.js";
    import Flash from "$lib/Flash.svelte";
    import ProfileImageList from "$lib/profile/ProfileImageList.svelte";

    let uploadFile;
    let errorMessage = "";

    async function upload() {
        const formData = new FormData();
        formData.append('file', uploadFile[0]);

        const response = await fetch(`${$apiUrl}/api/v1/user/upload-image`, {
            method: 'POST',
            body: formData,
            headers: new Headers({'uuid': $uuid}),
        });

        if (response.ok) {
            $userStore.images.push(await response.json());
            $userStore.images = $userStore.images;
            console.log($userStore.images);
        } else {
            let responseMessage = await response.json();
            errorMessage = responseMessage.message;
            console.log(errorMessage);
        }
    }
</script>

{#if $userStore && !$userStore.is_guest}

    {#if errorMessage}
        <Flash type="error" message={errorMessage}/>
    {/if}

    {#if $userStore.images}
        <div class="mb-3">
            <ProfileImageList images="{$userStore.images}"/>
        </div>
    {/if}

    <div class="border rounded-md p-3 mb-2 text-center">
        <label for="uploadImage">Загрузить файл</label>
        <input id="uploadImage" type="file" bind:files={uploadFile} on:change={upload}
               accept="image/*"
               class="hidden"/>
    </div>
{/if}
