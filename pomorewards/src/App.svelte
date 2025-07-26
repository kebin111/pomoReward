<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'

  import { onMount, tick, onDestroy } from 'svelte';

  let navItems = ["Chill", "Puzzle", "BRAINROT", "Normal"];

  //timer 

  let workMin = 1;
  let breakMin = 5; 
  let minutes = workMin;
  let seconds = 0;

  let timerRunning = false;
  let breakTime = false;
  
  let interval;

  let modes = ["Normal Mode", "Chill Mode", "Puzzle Mode", "Brainrot Mode"];
  let mode = "Normal Mode"

  let t_hero_color = '#4E4E64'; 

  let showModal = false;
  let claimReward = false;

  let player;
  let player_v = 'hidden';

  let ytReady = false;
  //TIMER FUNCTIONS
  function startTimer() {
    if (timerRunning) return;
    timerRunning = true;

    interval = setInterval(() => {
      if (minutes === 0 && seconds === 0) {
        clearInterval(interval);
        timerRunning = false;
        
        if(!breakTime){
          breakTime = true;
          minutes = breakMin;
          seconds = 0;
          showRewardButton();
        }else{
          resetTimer();
          closeModal();
          hidePlayer();
        }
        return;
      }

      if (seconds === 0) {
        minutes--;
        seconds = 59;
      } else {
        seconds--;
      }
    }, 1000);
  }


  function pauseTimer() {
    if (!timerRunning) return;

    clearInterval(interval);
    timerRunning = false;
    return;

  }

  function resetTimer() {
    clearInterval(interval);
    minutes = 25;
    seconds = 0;
    timerRunning = false;
  }

   // Format with leading zero
  $: formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // PAGE CHANGE FUNCTIONS
  function normalMode(){
     //change page colors
    t_hero_color = '#4E4E64'
    //change text
    mode = "Normal Mode ✅"
  }
  function brainrotMode(){
    //change page colors
    t_hero_color = '#FF2300'
    //change text
    mode = "BRAINROT Mode 💀"
  }

  function handleClick(item){
    switch(item){
      case "Normal":
        normalMode();
        break;
      case "Chill":
        break;
      case "Puzzle":
        break;
      case "BRAINROT":
        brainrotMode();
        break;
    }
  }

  //MODAL FUNCTIONS


//   function onYouTubeIframeAPIReady() {
//   // player = new YT.Player('player', {
//   //   height: '360',
//   //   width: '640',
//   //   videoId: 'ZVvya99OtnQ'
//   // });
//   console.log("YouTube API Ready!");
//   window.ytApiReady = true;
// }

  onMount(() => {
    // Define the global callback BEFORE loading the script
    window.onYouTubeIframeAPIReady = () => {
      console.log("YouTube API ready");
      ytReady = true;
     
    };

    // Now add the script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  });

  onDestroy(() => {
    if (player) {
      player.destroy();
      player = null;
    }
  });
  
  async function openModal(){
    showModal = true;
    await tick();
    if (ytReady && !player) {
      player = new YT.Player('player', {
        height: '640',
        width: '360',
        videoId: 'ZVvya99OtnQ'
      });
    } else if(player){
      player.playVideo();
    } else {
      if (player) player.pauseVideo();
    }

  }

  function closeModal(){
    showModal = false;
  }

  function showRewardButton(){
    claimReward = true;
  }

   function hideRewardButton(){
    claimReward = false;
  }

  function displayPlayer(){
    player_v = 'visible';
  }

  function hidePlayer(){
    player_v = 'hidden';
  }
  function pauseVideo(){
    if (player){
      player.pauseVideo();
    }
  }

  function playVideo(){
    if (player){
      player.playVideo();
    }
  }
</script>

<main>

  <!-- From Uiverse.io by SelfMadeSystem --> 
<div class="nav">
  <div class="container">
     {#each navItems as item}
          <!-- <li><a href="#">{item}</a></li> -->
           <div class="btn" on:click={() => handleClick(item)}>{item}</div>
        {/each}
    <!-- <div class="btn">Home</div>
    <div class="btn">Contact</div>
    <div class="btn">About</div>
    <div class="btn">FAQ</div> -->
    <svg
      class="outline"
      overflow="visible"
      width="400"
      height="60"
      viewBox="0 0 400 60"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        class="rect"
        pathLength="100"
        x="0"
        y="0"
        width="400"
        height="60"
        fill="transparent"
        stroke-width="5"
      ></rect>
    </svg>
  </div>
</div>


  <!-- <div class="nav-class">
    <nav>
      <ul>
        {#each navItems as item}
          <li><a href="#">{item}</a></li>
        {/each}
      </ul>
    </nav>
  </div> -->

   <div class="timer-hero" style="background-color: {t_hero_color}">
      <h2>{mode}</h2>
      <div class="timer-box">
        <h1>{formattedTime}</h1>
        {#if !timerRunning}
        <button class="start-button" on:click={startTimer}>Start</button>
        {:else}
        <button class="start-button" on:click={pauseTimer}>Pause</button>
        {/if}

        <button class="reset-button" on:click={resetTimer}>Reset</button>

        {#if claimReward}
        <button class="reward-button" on:click={() => {
          openModal();
          hideRewardButton();
          startTimer();
          displayPlayer();
        }}>Claim Reward!</button>
        {/if}
      </div>
  </div>

  {#if showModal}
    <div class="modal-backdrop" on:click={closeModal}>
      <div class="modal-content" on:click|stopPropagation>
        <h2>REWARD</h2>
        <p>Congratulations! you get 5 minutes of REELS</p>
        <button on:click={() => {
          hidePlayer();
          closeModal();}}>Close</button>
          <div id="player" >words</div>
      </div>
    </div>
  {/if}


  
</main>

<style>
  :root {
  /* font-family: system-ui, Avenir, Helvetica, Arial, sans-serif; */
  font-family: 'Chillax', sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
main{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
  .nav-class{
    background-color: rgb(255, 255, 255);
    min-width: 50rem;
    
  } 

  nav{ 
    padding: 1rem 2rem;
  }

  .nav-class li a {
    color: black; /* 🔹 Change this to any color you want */
    text-decoration: none;
    font-weight: bold;
    font-size: 1.1rem;
    transition: color 0.2s ease;
  }


  ul{
    display: flex;
    gap: 1.5rem;               /* Space between nav items */
    list-style: none;
    margin: 0;
    padding: 0;
    justify-content: center;
    color: black;
  }

 
  .timer-hero{
    display: flex;
    flex-direction: column;
    /* background-color: rgb(78, 78, 78);     */
    justify-content: center;  
    align-items: center;  
    min-height: 25rem;
    max-height: 50rem;
    width: 100%;
  }

  .timer-hero h2{
    font-weight: 500;
  }

  .timer-box{
    background-color:rgb(255, 255, 255); 
    color: black;
    min-width: 25rem;
    max-width: 25rem;
    min-height: 10rem;
    max-height: 15rem;  
    text-align: center;
    padding: 2rem;
    border-radius: 1rem;
    font-size: 2rem;  
    padding: 1rem;
  } 

 
  .start-button{  
    background-color: black;
    color: white;
    border-radius: 1rem;
  }

  .reset-button{  
    background-color: black;
    color: white;
    border-radius: 1rem;
  }

  .reward-button{  
    background-color: rgb(25, 148, 0);
    color: white;
    border-radius: 1rem;
  }



  /* From Uiverse.io by SelfMadeSystem */ 
.outline {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.rect {
  stroke-dashoffset: 5;
  stroke-dasharray: 0 0 10 40 10 40;
  transition: 0.5s;
  stroke: #000000;
}

.nav {
  position: relative;
  width: 400px;
  height: 60px;
}

.container:hover .outline .rect {
  transition: 999999s;
  /* Must specify these values here as something *different* just so that the transition works properly */
  stroke-dashoffset: 1;
  stroke-dasharray: 0;
}

.container {
  position: absolute;
  inset: 0;
  background: rgb(255, 255, 255);    
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 0.5em;
}

.btn {
  padding: 0.5em 1.5em;
  color: #000000;
  cursor: pointer;
  transition: 0.1s;
}

.btn:hover {
  background: #fff3;
}

.btn:nth-child(1):hover ~ svg .rect {
  stroke-dashoffset: 0;
  stroke-dasharray: 0 2 8 73.3 8 10.7;
}

.btn:nth-child(2):hover ~ svg .rect {
  stroke-dashoffset: 0;
  stroke-dasharray: 0 12.6 9.5 49.3 9.5 31.6;
}

.btn:nth-child(3):hover ~ svg .rect {
  stroke-dashoffset: 0;
  stroke-dasharray: 0 24.5 8.5 27.5 8.5 55.5;
}

.btn:nth-child(4):hover ~ svg .rect {
  stroke-dashoffset: 0;
  stroke-dasharray: 0 34.7 6.9 10.2 6.9 76;
}

.btn:hover ~ .outline .rect {
  stroke-dashoffset: 0;
  stroke-dasharray: 0 0 10 40 10 40;
  transition: 0.5s !important;
}


</style>


