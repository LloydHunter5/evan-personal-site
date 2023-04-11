<script lang="ts">
    import NavBarElement from "./NavBarElement.svelte";
</script>

<div class="navbar">
    <NavBarElement name={"Home"} anchorName="hero"/>
    <NavBarElement name={"About"} anchorName="about"/>
    <NavBarElement name={"Projects"} anchorName="projects"/>
    <NavBarElement name={"Contact"} anchorName="footer"/>
</div>

<style>
    .navbar{
        position:fixed;
        right: 20px;
        top: 30px;
        z-index: 10;
        padding:0;
        margin:0;
    }
</style>