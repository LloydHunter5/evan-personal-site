<script lang="ts">
    import { onMount } from 'svelte';
    import { createScene, updateScene } from "./triangles";

    let el : HTMLCanvasElement;

    let count: number = 0;
    const increment = () => {
        count += 1;
    }
    onMount(() => {
        createScene(el);
    });
</script>

<canvas bind:this={el}></canvas>

<button on:click={updateScene}>
    count is {count}
</button>

<style>

canvas{
  position: relative;
  top: 0;
  left: 0;
  width: calc(clientWidth);
  height: 99.5vh;
  z-index: -1;
  background-color: black;
}

</style>

