<script>
    import { current_component } from 'svelte/internal';
    import { bubble, listen } from 'svelte/internal';

    export let error = undefined;
    export let type = 'text';
    export let name;
    export let bindValue = undefined;
    export let label = undefined;
    export let placeholder = undefined;
    export let rows = 3;

    const events = getEventsAction(current_component);

    function getEventsAction(component) {
        return (node) => {
            const events = Object.keys(component.$$.callbacks);
            const listeners = [];
            events.forEach((event) => listeners.push(listen(node, event, (e) => bubble(component, e))));
            return {
                destroy: () => {
                    listeners.forEach((listener) => listener());
                }
            };
        };
    }
</script>

{#if name}
    <div class="my-2">
        {#if label}
            <div class="mb-1">
                <label for={name} class="capitalize">{label}</label>
            </div>
        {/if}
        <div>
            {#if type === 'text'}
                <input
                        type="text"
                        id={name}
                        {name}
                        bind:value={bindValue}
                        {placeholder}
                        class="focus:outline-0 w-full text-lg border p-2 rounded-md"
                        use:events
                />
            {/if}

            {#if type === 'date'}
                <input
                        type="date"
                        id={name}
                        {name}
                        bind:value={bindValue}
                        {placeholder}
                        class="focus:outline-0 w-full text-lg border p-2 rounded-md"
                        use:events
                />
            {/if}

            {#if type === 'password'}
                <input
                        type="password"
                        id={name}
                        {name}
                        bind:value={bindValue}
                        {placeholder}
                        use:events
                        class="focus:outline-0 w-full text-lg border p-2 rounded-md"
                />
            {/if}

            {#if type === 'textarea'}
				<textarea
                        id={name}
                        {name}
                        bind:value={bindValue}
                        {placeholder}
                        use:events
                        class="focus:outline-0 w-full text-lg border p-2 rounded-md"
                        {rows}
                ></textarea>
            {/if}

            {#if type === 'hidden'}
                <input type="hidden" id={name} {name} bind:value={bindValue} use:events />
            {/if}

            {#if type === 'checkbox'}
                <input type="checkbox" id={name} bind:checked={bindValue} use:events />
                <label for={name}>{name}</label>
            {/if}
        </div>
    </div>
    {#if error}
        <div class="text-red-800 mb-3">{error}</div>
    {/if}
{:else}
    <div>Необходимо заполнить обязательные параметры: name;</div>
{/if}
