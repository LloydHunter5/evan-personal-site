<script lang="ts">
  import NavBar from './lib/NavBar.svelte';
  import TriangleButton from './lib/TriangleButtons.svelte';
  import Triangles from './lib/Triangles.svelte';
  import Showcase from './lib/Showcase.svelte';
  import resume from './assets/evanstrohman_resume_software_engineer.pdf';
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
    <p class="about_text"> I'm a student developing his skills in interesting algorithms and techniques. This site serves as a hub for all of my projects and experience for anyone interested. </p>
  </div>

  <div class="projects page" id="projects">
    <h1 class="projects_title">Recent Projects</h1>
    <Showcase link1="https://github.com/LloydHunter5/Toy-Compiler" 
              link2="https://github.com/LloydHunter5/wpod" 
              link3="https://github.com/LloydHunter5/evan-personal-site"
              title1="Toy Compiler"
              title2="wpod"
              title3="This website!"
              text1="I've been working on this for around about a year now, as a long lasting project for my compilers class at school. It has an LL(1) recursive descent parser, type-checking, and code generation all (mostly) implemented for a language called 'toy'"
              text2="This is a project I decided to undertake to learn the basics of programming in Rust. It fetches publicly available images from a few selectable sources, and automatically sets your desktop background to that image using a minimal CLI"
              text3="This site serves as a hub for all of my projects now and in the future. I decided to develop it to aid my job application process, as well as learning a bit about HTML, CSS, Javascript, Typescript, Three.js, and the Svelte framework"
    />
  </div>

  <div class="footer" id="footer">
    <div class="links">
      <a href="https://github.com/LloydHunter5">github</a>
      <a href="https://www.linkedin.com/in/evan-strohman-4b5333265/">linkedin</a>
      <a href={resume}>resume</a>
    </div>
    <p class="footer_text">Built by Evan Strohman using <a href="https://svelte.dev/">Svelte</a> + <a href="https://threejs.org/">Three.js</a></p>
  </div>
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

.about_text{
  padding: 50px;
  padding-left: 200px;
  padding-right: 200px;
  font-size: 2rem;
}
.projects{
  min-height: 100vh;
  background-color: gray;
  scroll-snap-align: start;
  background-image: url('./assets/star_nasa.png');
  background-position: center top;
  background-repeat: no-repeat;
  background-size: cover;
  padding-bottom: 40px;
}

.projects_title{
  margin: 0;
  padding: 2rem;
  font: 300 3rem 'Lora', serif;
  color: white;
}
.footer{
  height: 30vh;
  background-color: darkgray;
  scroll-snap-align: end;
  display: flex;
  align-items: center;
  font: 300 1rem 'Lora', serif;
}
.footer_text{
  margin:0;
  color: black;
  position: absolute;
  right: 10%;
}

.links{
  margin: 0;
  padding: 1rem;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 5%;
  display: flex;
}
.links a{
  padding: 1rem;
}

</style>