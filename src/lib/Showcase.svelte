<script lang="ts">
    import ShowcaseElement from "./ShowcaseElement.svelte";
    export let link1 : string;
    export let link2 : string;
    export let link3 : string;

    export let title1 : string;
    export let title2 : string;
    export let title3 : string;

    export let text1 : string;
    export let text2 : string;
    export let text3 : string;

</script>

<div class="showcase">
    <ShowcaseElement link={link1} title={title1} text={text1} />
    <ShowcaseElement link={link2} title={title2} text={text2} />
    <ShowcaseElement link={link3} title={title3} text={text3} />
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