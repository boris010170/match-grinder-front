<script lang="ts">
    export let message = "";
</script>
<div>
    <div class="text-right">
        <button on:click={()=>{message=""}}>X</button>
    </div>
    {message}
</div>