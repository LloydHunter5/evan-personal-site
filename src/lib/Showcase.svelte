<script lang="ts">
    import ShowcaseElement from "./ShowcaseElement.svelte";
    export let link1 : string;
    export let link2 : string;
    export let link3 : string;

</script>

<div class="showcase">
    <ShowcaseElement link={link1} />
    <ShowcaseElement link={link2} />
    <ShowcaseElement link={link3} />
</div>

<style>
    .showcase{
        align-items: center;
        justify-content: center;
        display: flex;
        flex-wrap: wrap;
        width: 100vw;
        max-width: 100%;
    }
</style>