<script lang="ts">
    export let name : String;
    export let anchorName : String;
    import { onMount } from "svelte";

    let squareButton : HTMLDivElement;
    let label : HTMLParagraphElement;


    onMount(() =>
    {
        squareButton.addEventListener("mouseover", () => {
            squareButton.style.opacity = "90%";
            squareButton.style.backgroundColor = "black";
            label.style.opacity = "100%";
        });
        squareButton.addEventListener("mouseout", () => {
            squareButton.style.opacity = "50%";
            squareButton.style.backgroundColor = "black";
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
        width: 20px;
        height: 35px;
        background-color: black;
        border-radius: 10%;
        opacity: 50%;
        margin: 0.2rem;
        border: 2px solid transparent;
    }

    .label{
        transition-duration: 0.25s;
        padding-right: 0.1rem;
        opacity: 0%;
        font: 460 0.9rem 'Lora', serif;
    }
    
</style>