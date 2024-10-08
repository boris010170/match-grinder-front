<script lang="ts">
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();
    let pos, active;
    export {pos};

    function handle(node) {
        const onDown = getOnDown(node);

        node.addEventListener("touchstart", onDown);
        node.addEventListener("mousedown", onDown);
        return {
            destroy() {
                node.removeEventListener("touchstart", onDown);
                node.removeEventListener("mousedown", onDown);
            }
        };
    }

    function getOnDown(node) {
        const onMove = getOnMove(node);

        return function (e) {
            e.preventDefault();
            node.dispatchEvent(new CustomEvent("dragstart"));

            const moveevent = "touches" in e ? "touchmove" : "mousemove";
            const upevent = "touches" in e ? "touchend" : "mouseup";

            document.addEventListener(moveevent, onMove);
            document.addEventListener(upevent, onUp);

            function onUp(e) {
                e.stopPropagation();

                document.removeEventListener(moveevent, onMove);
                document.removeEventListener(upevent, onUp);

                node.dispatchEvent(new CustomEvent("dragend"));
            };
        };
    }

    function getOnMove(node) {
        const track = node.parentNode;

        return function (e) {
            const {left, width} = track.getBoundingClientRect();
            const clickOffset = "touches" in e ? e.touches[0].clientX : e.clientX;
            const clickPos = Math.min(Math.max((clickOffset - left) / width, 0), 1) || 0;
            node.dispatchEvent(new CustomEvent("drag", {detail: clickPos}));
        };
    }
</script>

<div class="thumb"
     role="progressbar"
     style={`left: ${pos * 100}%;`}
     use:handle
     on:dragstart={() => ((active = true), dispatch('active', true))}
     on:drag={({ detail: v }) => (pos = v)}
     on:dragend={() => ((active = false), dispatch('active', false))}>
    <div class="thumb-content" class:active>
        <slot/>
    </div>
</div>

<style>
    .thumb {
        position: absolute;
        top: 50%;
        width: 0;
        height: 0;
    }

    .thumb-content {
        position: relative;
        width: fit-content;
        height: fit-content;
        transform: translate(-50%, -50%);
    }

    .thumb-content::before {
        content: "";
        position: absolute;
        width: 200%;
        height: 200%;
        transform: translate(-25%, -25%) scale(0);
        border-radius: 100vh;
        background: var(--thumb-bg, #5784fd);
        opacity: 30%;
        transition: transform 100ms ease-in-out;
    }

    .thumb-content.active::before {
        transform: translate(-25%, -25%) scale(1);
    }
</style>