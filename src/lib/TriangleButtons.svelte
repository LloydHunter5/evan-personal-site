<script lang="ts">
    import { onMount } from 'svelte';
    import { setColor1,setColor2} from './triangles';
    import type { Color } from './triangles';

    let hoverColor : string = "#9fcbbe";
    let baseColor : string = "#000000";
    let clickColor : string = "#01016f";

    let div1 : HTMLDivElement;
    let div2 : HTMLDivElement;
    let div3 : HTMLDivElement;
    let div4 : HTMLDivElement;
    let div5 : HTMLDivElement;

    const addListners = (div : HTMLDivElement, color1 : Color, color2 : Color) => {
        div.addEventListener("click", () => {
            div.style.borderColor = "transparent " + clickColor + " transparent transparent";
            setTimeout(() => {
                div.style.borderColor = "transparent " + baseColor + " transparent transparent";
            }, 100);
            setColor1(color1);
            setColor2(color2);
        });
        div.addEventListener("mouseover", () => {
            div.style.borderColor = "transparent " + colorToString(color1) + " transparent transparent";
        });
        div.addEventListener("mouseout", () => {
            div.style.borderColor = "transparent " + baseColor + " transparent transparent";
        });


    }
    const colorToString = (color : Color) => {
        return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
    }

    onMount(() => {
        addListners(div1, {r: 0x3A, g: 0x07, b: 0x51}, {r: 0xEE, g: 0x3E, b: 0x38});
        addListners(div2, {r: 0x26, g: 0x46, b: 0x53}, {r: 0x2A, g: 0x9D, b: 0x8F});
        addListners(div3, {r: 255, g: 255, b: 255}, {r: 0, g: 0, b: 0});
        addListners(div4, {r: 0xB0, g: 0x88, b: 0xAD}, {r: 0xFE, g: 0xB8, b: 0x73});
        addListners(div5, {r: 0xF9, g: 0x2D, b: 0x8B}, {r: 0x00, g: 0x9E, b: 0x9E});
    });

    

</script>
<div class="button_container">
    <div bind:this={div1} class="triangle_button b1"></div>
    <div bind:this={div2} class="triangle_button b2"></div>
    <div bind:this={div3} class="triangle_button b3"></div>
    <div bind:this={div4} class="triangle_button b4"></div>
    <div bind:this={div5} class="triangle_button b5"></div>
</div>
<style>
    .button_container{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 1rem;
        height: 1rem;
    }
    .triangle_button{
        position: absolute;
        z-index: 1;
        color: white;
        width: 0;
        height: 0;
        opacity: 60%;
        border-style: solid;
        border-width: 2rem 3.465rem 2rem 0;
        transition-duration: 0.3s;
        transition-timing-function: cubic-bezier(0,.88,.78,.86);
        border-color: transparent #000000 transparent transparent;
    }
    .b1{
        rotate: 60deg;
    }
    .b2{
        animation: 0.75s cubic-bezier(.56,.02,.91,.28) dropInButtonTwo;
        transform: translate(16px,48px);
    }
    .b3{
        animation: 1.5s cubic-bezier(.56,.02,.91,.28) dropInButtonThree;
        transform: translate(0px,80px) rotate(60deg);
    }
    .b4{
        animation: 2.25s cubic-bezier(.56,.02,.91,.28) dropInButtonFour;
        transform: translate(16px, 128px);
    }
    .b5{
        animation: 3s cubic-bezier(.56,.02,.91,.28) dropInButtonFive;
        transform: translate(0px,160px) rotate(60deg);
    }


    @keyframes dropInButtonTwo {
        0% {
            transform: translate(0, 0) rotate(60deg);
        }
        100% {
            transform: translate(16px,48px);
        }
    }

    @keyframes dropInButtonThree {
        0% {
            transform: translate(0, 0)  rotate(60deg);
        }
        50% {
            transform: translate(16px, 48px);
        }
        100% {
            transform: translate(0px, 80px) rotate(60deg);
        }
    }

    @keyframes dropInButtonFour {
        0% {
            transform: translate(0, 0)  rotate(60deg);
        }
        33% {
            transform: translate(16px, 48px);
        }
        66% {
            transform: translate(0px, 80px) rotate(60deg);
        }
        100% {
            transform: translate(16px, 128px);
        }
    }

    @keyframes dropInButtonFive {
        0% {
            transform: translate(0, 0)  rotate(60deg);
        }
        25% {
            transform: translate(16px, 48px);
        }
        50% {
            transform: translate(0px, 80px) rotate(60deg);
        }
        75% {
            transform: translate(16px, 128px);
        }
        100% {
            transform: translate(0px, 160px) rotate(60deg);
        }
    }
</style>