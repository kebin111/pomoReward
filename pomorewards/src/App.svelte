<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'

  import { onMount, tick, onDestroy } from 'svelte';
  import { audioData } from './audioData.js';

  let navItems = ["Chill", "Puzzle", "BRAINROT", "Normal"];

  //timer 

  let workMin = 1;
  let breakMin = 5; 
  let minutes = workMin;
  let seconds = 0;

  let timerRunning = false;
  let breakTime = false;
  
  let interval;

  let modes = ["Normal", "Chill", "Puzzle", "Brainrot"];
  let mode = modes[0];
  let modeText = "Normal Mode✅";
  let modeIndex;
  let rewardText;

  let t_hero_color = '#4E4E64'; 

  let showModal = false;
  let claimReward = false;

  let player;
  let longPlayer;

  let ytReady = false;

  let playlistLength;
  let index;

  let longLength;
  let longIndex;

  let restrict = false;

  let audioIndex = 0;
  let audioFile = new Audio(audioData[audioIndex].url);


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
          playSound(0);
        }else{
          resetTimer();
          closeModal();
          playSound(1);
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
    breakTime = false;
  }

   // Format with leading zero
  $: formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // PAGE CHANGE FUNCTIONS
  function normalMode(){
     //change page colors
    t_hero_color = '#4E4E64';
    //change text
    mode = modes[0];
    modeText =  "Normal Mode ✅";
    modeIndex = modes.indexOf(mode);
    rewardText = "";
  }
  function brainrotMode(){
    //change page colors
    t_hero_color = '#FF2300';
    //change text
    mode = modes[3];
    modeText = "BRAINROT Mode 💀";
    modeIndex = modes.indexOf(mode);
    rewardText = "Congratulations! you get 5 minutes of SHORTS!";
  }
  function chillMode(){
    //change page colors
    t_hero_color = '#63B9EB';
    //change text
    mode = modes[1];
    modeText = "Chill Mode 😌";
    modeIndex = modes.indexOf(mode);
    rewardText = "Congratulations! you get a calming video for 5 minutes!";
  }
  function puzzleMode(){
    //change page colors
    t_hero_color = '#A2C700';
    //change text
    mode = modes[2];
    modeText = "Puzzle Mode 🧠";
    modeIndex = modes.indexOf(mode);
    rewardText = "Try to solve this puzzle in 5 minutes!";
  }

  function handleClick(item){
    if(breakTime){
      alert("Please wait for break to finish or click reset to change mode.");
      return;
    }
    switch(item){
      case "Normal":
        normalMode();
        break;
      case "Chill":
        chillMode();
        break;
      case "Puzzle":
        puzzleMode();
        break;
      case "BRAINROT":
        brainrotMode();
        break;
    }
  }

  //MODAL FUNCTIONS


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

    if (longPlayer){
      longPlayer.destroy()
      longPlayer = null;
    }
  });

  function reloadPlayer(){
    if (player) {
      player.destroy();
      player = null;
    }
     player = new YT.Player('player', {
        height: '640',
        width: '360',
        playerVars: {
          listType: 'playlist',
          list: 'PL3RN74kSDDcibI-VWFrYvjI_F4asqPjYV', 
          index: index,
          autoplay: 1,
          mute: 1,
          controls: 1,
          loop: 1,
          playlist: 'PL3RN74kSDDcibI-VWFrYvjI_F4asqPjYV'
        },
         events: {
          onReady: () => {
            player.setShuffle(true);
            player.shufflePlaylist();
          }
    
        }
      });
    
  }
  
  function reloadLongPlayer(){
    if (longPlayer){
      longPlayer.destroy()
      longPlayer = null;
    }

     longPlayer = new YT.Player('long-player', {
          height: '360',
          width: '640',
          playerVars: {
            listType: 'playlist',
            list: 'PLXYsPmU7pEccto5sP51U66Ggk4kqDxuVY', 
            index: longIndex,
            autoplay: 1,
            mute: 0,
            controls: 1,
            loop: 1,
            playlist: 'PLXYsPmU7pEccto5sP51U66Ggk4kqDxuVY'
          },
          events: {
            onReady: () => {
              longPlayer.setShuffle(true);
              longPlayer.shufflePlaylist();
            },
            onError: (event) => {
              console.warn('Player error, reloading...');
              reloadPlayer();
            }
          }
        });
  }

  async function openModal(){
    playlistLength = 202;
    longLength = 10;
    index = Math.floor(Math.random() * playlistLength);
    longIndex = Math.floor(Math.random() * longLength);
    showModal = true;
    await tick();

    if(modeIndex === 3){
      if (ytReady && !player) {
        player = new YT.Player('player', {
          height: '640',
          width: '360',
          playerVars: {
            listType: 'playlist',
            list: 'PL3RN74kSDDcibI-VWFrYvjI_F4asqPjYV', 
            index: index,
            autoplay: 1,
            mute: 1,
            controls: 1,
            loop: 1,
            playlist: 'PL3RN74kSDDcibI-VWFrYvjI_F4asqPjYV'
          },
          events: {
            onReady: () => {
              player.setShuffle(true);
              player.shufflePlaylist();
            },
            onError: (event) => {
              console.warn('Player error, reloading...');
              reloadPlayer();
            }
          }
        });

        
      } else if(player){
        player.playVideo();
      } else {
        if (player) player.pauseVideo();
      }
    }else if(modeIndex === 1){
        if (ytReady && !longPlayer) {
        longPlayer = new YT.Player('long-player', {
          height: '360',
          width: '640',
          playerVars: {
            listType: 'playlist',
            list: 'PLXYsPmU7pEccto5sP51U66Ggk4kqDxuVY', 
            index: longIndex,
            autoplay: 1,
            mute: 0,
            controls: 1,
            loop: 1,
            playlist: 'PLXYsPmU7pEccto5sP51U66Ggk4kqDxuVY'
          },
          events: {
            onReady: () => {
              longPlayer.setShuffle(true);
              longPlayer.shufflePlaylist();
            },
            onError: (event) => {
              console.warn('Player error, reloading...');
              reloadPlayer();
            }
          }
        });

        
      } else if(longPlayer){
        longPlayer.playVideo();
      } else {
        if (longPlayer) longPlayer.pauseVideo();
      }
    }

  }

  function closeModal(){
    showModal = false;

    if (player) {
    player.destroy();
    player = null;
    }

    if (longPlayer){
      longPlayer.destroy()
      longPlayer = null;
    }
  }

  function showRewardButton(){
    claimReward = true;
  }

   function hideRewardButton(){
    claimReward = false;
  }

  function pauseVideo(){
    if (player){
      player.pauseVideo();
    }
    if (longPlayer){
      longPlayer.pauseVideo();
    }
  }

  function playVideo(){
    if (player){
      player.playVideo();
    }
    if (longPlayer){
      longPlayer.playVideo();
    }
  }

  function restrictVideo(){
    restrict = true;
  }

  function unrestrictVideo(){
    restrict = false;
  }

  function playSound(audioIndex){
    audioFile.src = audioData[audioIndex].url;
    audioFile.load();
    audioFile.play();
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
      <h2>{modeText}</h2>
      <div class="timer-box">
        <h1>{formattedTime}</h1>
        {#if !timerRunning}
        <button class="start-button" on:click={() => {
          startTimer();
          unrestrictVideo();
          
        }}>Start</button>
        {:else}
        <button class="start-button" on:click={() => {
          pauseTimer();
          pauseVideo();
          restrictVideo();
        }}>Pause</button>
        {/if}

        <button class="reset-button" on:click={() => {
          resetTimer();
          closeModal();
        }}>Reset</button>

        {#if claimReward}
        <button class="reward-button" on:click={() => {
          openModal();
          hideRewardButton();
          startTimer();
        }}>Claim Reward!</button>
        {/if}
      </div>


        {#if showModal}
    <div class="modal-backdrop" >
      <div class="modal-content" on:click|stopPropagation>
        <h2>REWARD</h2>
        <p>{rewardText}</p>
        <button on:click={() => {
          closeModal();}}>Close</button>
          {#if modeIndex === 3}
          <div id="player-container">
          <div id="player" >error loading video<button on:click={reloadPlayer}>Reload</button> </div>
            {#if restrict}
            <div class="blocker">
              Blocked
            </div>
            {/if}
          </div>  
          {:else if modeIndex === 1}
          <div id="long-container">
          <div id="long-player">error loading video <button on:click={reloadLongPlayer}>Reload</button></div>
            {#if restrict}
            <div class="long-blocker">
              Blocked
            </div>
            {/if}
        </div>
          {:else}
          <p>error loading reward</p>
          {/if}
          
      </div>
    </div>
  {/if}
  </div>




  
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
    /* max-height: 50rem; */
    width: 100%;
    border-radius: 1rem;
    margin: 1rem;
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



.modal-backdrop{
  margin: 1rem;
  background-color: #FFFFFF;
  min-width: 20rem;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  padding-right: 2rem;
  padding-left: 2rem;
}

.modal-content{
  color:#000000;
  padding-bottom: 1rem;
}
#player-container {
    background-color: #000000;
    position: relative; /* Needed to position the blocker over the player */
    width: 360px;
    height: 640px;
    border-radius: 1rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

#long-container {
    background-color: #000000;
    position: relative; /* Needed to position the blocker over the player */
    width: 640px;
    height: 360px;
    border-radius: 1rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.long-blocker {
    position: absolute;
    top: 0;
    left: 0;
    width: 640px;
    height: 360px;
    background: rgba(0, 0, 0, 0.5); /* Semi-transparent overlay */
    z-index: 10; /* Higher than player */
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 18px;
    cursor: pointer;
}

   .blocker {
    position: absolute;
    top: 0;
    left: 0;
    width: 360px;
    height: 640px;
    background: rgba(0, 0, 0, 0.5); /* Semi-transparent overlay */
    z-index: 10; /* Higher than player */
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 18px;
    cursor: pointer;
  }

</style>


