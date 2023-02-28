<script lang="ts">
    import { onMount } from 'svelte';
    import { createScene, updateScene } from "./triangles";

    let el : HTMLCanvasElement;

    onMount(() => {
        createScene(el);
    });
</script>

<canvas bind:this={el}></canvas>


<style>

canvas{
  position: relative;
  top: 0;
  left: 0;
  z-index: -10;
  background-color: black;
}

</style>

