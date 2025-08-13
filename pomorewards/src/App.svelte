

<script>
  // @ts-nocheck
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'

  import { onMount, onDestroy } from 'svelte';
  import NavBar from './navBar.svelte';
  import Timer from './timer.svelte';
  import RewardModal from './rewardModal.svelte';
  import { getColor } from './navBar.svelte';
  import { destroy, setYTREADY } from './rewardModal.svelte';

  let t_hero_color = $derived(getColor()); 
  let ytReady  = $state(false);

  onMount(() => {
     window.onYouTubeIframeAPIReady = () => {
      console.log("YouTube API ready");
      ytReady = true;
      setYTREADY(ytReady);
    };

    // Now add the script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  });

    onDestroy(() => {
      destroy();
  });


</script>

<main style= "background: {t_hero_color}">
<NavBar></NavBar>
  <div class="timer-hero" style="background-color: {t_hero_color}">
    <Timer></Timer>
    <RewardModal></RewardModal>
  </div>
  <footer>@pomorewards 2025 all rights reserved.</footer>
</main>

<style>
  :root {
  /* font-family: system-ui, Avenir, Helvetica, Arial, sans-serif; */
  font-family: 'Chillax', sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #24242400;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

   background: #000000;
 
}
main{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;

    border-radius: 2rem;

    padding: 1rem;
}


  .timer-hero{
    display: flex;
    flex-direction: column;
    /* background-color: rgb(78, 78, 78);     */
    justify-content: center;  
    align-items: center;  
    min-height: 25rem;
    /* max-height: 50rem; */
    width: 100%;
    border-radius: 1rem;
    margin: 1rem;
    
  }

 
footer{
  padding-top: 20rem;
}

</style>


