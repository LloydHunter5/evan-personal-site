<script lang="ts">
  import NavBar from './lib/NavBar.svelte';
  import TriangleButton from './lib/TriangleButtons.svelte';
  import Triangles from './lib/Triangles.svelte';
  import halfMoonBayImage from './assets/IMG_1604.jpg';
</script>

<main>
  <NavBar />
  <div class="hero page" id="hero">
    <div class="namecard">        
        <h1 class="name_header">Evan Strohman</h1>
        <div class="name_header_underscore"></div>
    </div>
    <TriangleButton/>
    <Triangles />
  </div>
  <div class="about page" id="about">
    <h1 class="about_title">About Me</h1>
  </div>

  <div class="projects page" id="projects">
    <h1 class="projects_title">Recent Projects</h1>
  </div>

  <div class="footer" id="footer"></div>
</main>

<style>

main{
  padding: 0;
  margin: 0;
  scroll-snap-type: mandatory;
}

main::-webkit-scrollbar{
  display:none;
}

.page{
  scroll-snap-align: start;
}

.hero {
  height: 100vh;
  padding: 0;
  margin: 0;
  position: relative;
  scroll-snap-align: start;
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
  background-color: white;
  position: relative;
  padding: 0;
  margin: 0%;
  background-image: url('./assets/IMG_1604.jpg');
  background-size: cover;
  scroll-snap-align: start;
}

.about_title{
  margin: 0;
  padding: 2rem;
  font: 300 3rem 'Lora', serif;
}
.projects{
  height: 100vh;
  background-color: gray;
  scroll-snap-align: start;
}
.projects_title{
  margin: 0;
  padding: 2rem;
  font: 300 3rem 'Lora', serif;
}
.footer{
  height: 30vh;
  background-color: darkgray;
  scroll-snap-align: end;
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