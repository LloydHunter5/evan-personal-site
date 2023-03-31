<script lang="ts">
    export let name : String;
    export let anchorName : String;
    import { onMount } from "svelte";

    let squareButton : HTMLDivElement;
    let label : HTMLParagraphElement;


    onMount(() =>
    {
        squareButton.addEventListener("mouseover", () => {
            squareButton.style.border = "2px solid white";
            label.style.opacity = "100%";
        });
        squareButton.addEventListener("mouseout", () => {
            squareButton.style.border = "2px solid transparent";
            label.style.opacity = "0%";
        });
    }
    )


</script>

<div class="element">
    <p bind:this={label} class="label">{name}</p>
    <a href="#{anchorName}">
        <div bind:this={squareButton} class="square-button"></div>
    </a>
</div>

<style>
    .element {
        display: flex;
        justify-content: right;
    }
    .square-button{
        width: 45px;
        height: 45px;
        background-color: black;
        border-radius: 20%;
        opacity: 50%;
        margin: 0.2rem;
    }

    .label{
        transition-duration: 0.1s;
        padding-right: 0.5rem;
        opacity: 0%;
    }

    

    
</style>