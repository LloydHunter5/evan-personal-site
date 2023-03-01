import './app.css'
import App from './App.svelte'

const app = new App({
  // assert that the element exists
  target: document.getElementById('app')!,
})

export default app
