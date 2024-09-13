<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import Thumb from "./Thumb.svelte";

    const dispatch = createEventDispatcher();

    export let range = false;
    export let min = 0;
    export let max = 1000;
    export let step = 1;
    export let rangeFrom: number | undefined = undefined;
    export let rangeTo: number | undefined = undefined;

    let value = [rangeFrom || 0, rangeTo || 0];
    let pos = [0, 0];
    let active = false;
    export let order = false;

    $: if (active) setValue(pos);
    $: if (!active) setPos(value);
    $: if (range && order && active) pos = checkPos(pos);
    $: min, max, clamp();
    $: progress = `
    left: ${range ? Math.min(pos[0], pos[1]) * 100 : 0}%;
    right: ${100 - Math.max(pos[0], (range ? pos[1] : pos[0])) * 100}%;
  `;

    function setValue(pos) {
        const offset = min % step;
        const width = max - min
        value = pos
            .map(v => min + v * width)
            .map(v => Math.round((v - offset) / step) * step + offset);

        rangeFrom = value[0];
        rangeTo = value[1];
        dispatch("input", value);
    }

    function setPos(value) {
        pos = value
            .map(v => Math.min(Math.max(v, min), max))
            .map(v => (v - min) / (max - min));
    }

    function checkPos(pos) {
        return [Math.min(...pos), Math.max(...pos)];
    }

    function clamp() {
        setPos(value);
        setValue(pos);
    }
</script>

<div class="track">
    <div class="progress" style={progress}></div>
    <Thumb bind:pos={pos[0]} on:active={({ detail: v }) => active = v}>
        <slot name="left">
            <slot>
                <div class="thumb"></div>
            </slot>
        </slot>
    </Thumb>
    {#if range}
        <Thumb bind:pos={pos[1]} on:active={({ detail: v }) => active = v}>
            <slot name="right">
                <slot>
                    <div class="thumb"></div>
                </slot>
            </slot>
        </Thumb>
    {/if}
</div>

<style>
    .track {
        margin: 16px 0;
        position: relative;
        height: 4px;
        width: calc(100% - 0);
        border-radius: 100vh;
        background: var(--track-bg, #ebebeb);
    }

    .progress {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        border-radius: 100vh;
        background: var(--progress-bg, #8abdff);
    }

    .thumb {
        width: 16px;
        height: 16px;
        border-radius: 100vh;
        background: var(--thumb-bg, #5784fd);
    }
</style>