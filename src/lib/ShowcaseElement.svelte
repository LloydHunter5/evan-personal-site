<script lang="ts">
    export let link : string;
    export let title : string;
    export let text : string;
</script>


<div class="wrapper container">
    <a href={link}>
        <div class="content container">
            <h1>{title}</h1>
            <p>{text}</p>
        </div>
    </a>
</div>

<style>
    .container{
        transition-duration: 0.1s;
        margin: 1rem;
        border-radius: 0.8rem;
    }
    .wrapper{
        width: 300px;
        height: 220px;
    }
    .wrapper a{
        text-decoration: none;
    }
    .content:hover{
        background-color: lightblue;
    }
    .content{
        width: 300px;
        height: 220px;
        background-color: white;
        background-position: center top;
        padding: 0;
        margin: 0;
    }

    .content h1{
        text-align: center;
        text-decoration: none;
        color: black;
        padding-bottom: 8px;
        padding-top: 8px;
        margin: 0;
    }
    .content p{
        color:black;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 0px;
        padding-bottom: 0px;
    }
</style>