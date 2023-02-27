<script lang="ts">
  import Triangles from './lib/Triangles.svelte';
</script>

<main>
  <div class="hero">
    <div class="namecard">        
        <h1 class="name_header">Evan Strohman</h1>
        <div class="name_header_underscore"></div>
    </div>
  </div>
  <Triangles />
</main>

<style>

main{
  padding: 0;
  margin: 0;
  width: calc(clientWidth);
}

.hero {
  background-image: linear-gradient(to bottom,lightblue,white);
  height: 100vh;
  padding: 0;
  margin: 0;
  width: calc(clientWidth);
  position: relative;
}

.namecard {
  position: absolute;
  padding:0;
  margin:0;
  bottom: 10vh;
  left: 5vw; 
}

.name_header{
  font: 300 4rem 'Lora', serif;
  position: absolute;
  bottom:0;
  left:0;
  padding-bottom: 0.5rem;
  margin:0;
}

.name_header_underscore{
  position: relative;
  width: 18.4rem;
  height: 0.2rem;
  background-color:black;
  border-radius: 0.15rem;
  z-index: 0;
}


</style>