<script lang="ts">
    import NavBar from './lib/NavBar.svelte';
import TriangleButton from './lib/TriangleButtons.svelte';
import Triangles from './lib/Triangles.svelte';
</script>

<main>
  <NavBar />
  <div class="hero" id="hero">
    <div class="namecard">        
        <h1 class="name_header">Evan Strohman</h1>
        <div class="name_header_underscore"></div>
    </div>
    <TriangleButton/>
    <Triangles />
  </div>
  <div class="about" id="about">
    
  </div>

  <div class="projects" id="projects">

  </div>

  <div class="footer" id="footer"></div>
  
</main>

<style>

main{
  padding: 0;
  margin: 0;
  width: calc(clientWidth);
}

.hero {
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

.about{
  height: 100vh;
  width: calc(clientWidth);
  background-color: white;
}
.projects{
  height: 100vh;
  width: calc(clientWidth);
  background-color: gray;
}
.footer{
  height: 30vh;
  width: calc(clientWidth);
  background-color: darkgray;
}

@keyframes namecard_rise_in {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateX(0);
  }
}

</style>