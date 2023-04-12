<script lang="ts">
    export let link : string;
</script>


<div class="content_wrapper">
    <a href={link}>
        <div class="content">
        </div>
    </a>
</div>

<style>
    .content_wrapper{
        width: 300px;
        height: 200px;
        padding: 1rem;
    }
    .content{
        width: 300px;
        height: 200px;
        background-color: black;
        border-radius: 0.8rem;
        background-image: img;
        background-size: cover;
        background-position: center top;
    }
</style>