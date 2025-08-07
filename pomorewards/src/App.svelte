<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'

  import { onMount, tick, onDestroy } from 'svelte';
  import { audioData } from './audioData.js';
  import { anagramMap, countMap } from './anagrams.js';


  let navItems = ["Chill", "Puzzle", "Brainrot", "Normal"];

  //timer 

  let workMin = $state(1);
  let breakMin = $state(5); 
  let minutes = $derived(workMin);
  let seconds = $state(0);


  let timerRunning = $state(false);
  let breakTime = $state(false);
  
  let interval;

  let modes = ["Normal", "Chill", "Puzzle", "Brainrot"];
  let mode = $state(modes[0]);
  let modeText = $state("Normal Mode✅");
  let modeIndex = $state(0);
  let rewardText = $state("");

  let t_hero_color = $state('linear-gradient(to top left, #4E4E64, #20203d );'); 

  let showModal = $state(false);
  let claimReward = $state(false);

  let player;
  let longPlayer;

  let ytReady = $state(false);

  let playlistLength;
  let index;

  let longLength;
  let longIndex;

  let restrict = $state(false);

  let audioIndex = 0;
  let audioFile = $state(new Audio(audioData[audioIndex].url));


  let anagram = $state("scalp");
  let wordList = [
  "listen", "silent", "enlist", "inlets", "google", "gogole", "cat", "act", "tac", "dog", "god", "odg"
];

  let pWords = $state(0);
  let anaKey = $state("");
  let anaTemp = $derived([...anagram]);
  // let anaLength = $derived(anaTemp.length);

  let solve = $state(false);


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
          resetPuzzle();
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
    
    resetPuzzle();
  }


  let formattedTime = $derived(String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0'));

  // PAGE CHANGE FUNCTIONS
  function normalMode(){
     //change page colors
    t_hero_color = 'linear-gradient(to top left, #4E4E64, #20203d );';
    //change text
    mode = modes[0];
    modeText =  "Normal Mode ✅";
    modeIndex = modes.indexOf(mode);
    rewardText = "";
  }
  function brainrotMode(){
    //change page colors
    t_hero_color = 'linear-gradient(to top left, #520000, #ff1e00 );';
    //change text
    mode = modes[3];
    modeText = "BRAINROT Mode 💀";
    modeIndex = modes.indexOf(mode);
    rewardText = "Congratulations! you get 5 minutes of SHORTS!";
  }
  function chillMode(){
    //change page colors
    t_hero_color = 'linear-gradient(to top left, #63B9EB, #0062a3 );';
    //change text
    mode = modes[1];
    modeText = "Chill Mode 😌";
    modeIndex = modes.indexOf(mode);
    rewardText = "Congratulations! you get a calming video for 5 minutes!";
  }
  function puzzleMode(){
    //change page colors
    t_hero_color = 'linear-gradient(to top left, #A2C700, #648002 );';
    //change text
    mode = modes[2];
    modeText = "Puzzle Mode 🧠";
    modeIndex = modes.indexOf(mode);
    rewardText = "Try to solve this puzzle in 5 minutes!";
    jumbleWord(anagram);
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
      case "Brainrot":
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
    } else if(modeIndex === 2){
      initializePuzzle();
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

  function jumbleWord(word){
    const chars = word.split('');

    for  (let i = chars.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    anagram = chars.join('');
  }

function initializePuzzle(){
  //get random word from hashmap
  let keys = Object.keys(anagramMap);
  anaKey = keys[Math.floor(Math.random() * keys.length)];
  anagram = anagramMap[anaKey];
  // console.log("this is supposed to be anagram key: ");
  // console.log(anaKey);
  // console.log(anagram);
  
}

function loadTextInput(){
  let inputBox = document.getElementById("puzzle-input");
  let text = inputBox.value;
  let tIndex;

 
  
  if(anaTemp.includes(text)){
    console.log("CORRECT MINUS ONE WORD");
    tIndex = anaTemp.indexOf(text);
    if(tIndex !== -1){
      anaTemp.splice(tIndex, 1);
      anaTemp = [...anaTemp];
    }
    console.log(anaTemp);
    console.log(anaTemp.length);
    playSound(3);
    if(anaTemp.length === 0){
    console.log("CONGRATULATIONS!");
    solve = true;
    playSound(2);
  }
  }else{
    console.log("EEEENKK WRONG");
    playSound(4);
  }

inputBox.value = "";

} 


function resetPuzzle(){
   solve = false;
}

</script>

<main style= "background: {t_hero_color}">
  
  <div class="nav-class">
    <nav>
      {#each navItems as item}
      <div class="btn {item === mode ? 'active' : '' }" 
      on:click={() => handleClick(item)}>{item}</div>
      {/each}
    </nav>
  </div>
    

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
      <div class="modal-content" > <!--on:click|stopPropagation-->
        <h2>REWARD</h2>
        <p>{rewardText}</p>
        <button class="exit" on:click={() => {
          closeModal();}}>
          <img src="icons8-close.svg" alt="Close" class="icon"/>
          </button>
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
          {:else if modeIndex === 2}
          <div id="puzzle-container">
            <div id="text-container">
              {#if !solve}
              <p>Your anagram is...</p>
              <h2>{anaKey}</h2>
              <p>{anaTemp.length} possible words</p>
              {:else}
              <h3 style="padding: 1rem;">Congratulations!</h3>
              {/if}
              <input id="puzzle-input" placeholder="input your answer here">
              <button class="submit" on:click={loadTextInput}>submit</button>
              <!-- reward when they get all words -->
            </div>
            
          </div>
          {:else}
          <p>error loading reward</p>
          {/if}
          
      </div>
    </div>
  {/if}
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


  .nav-class{
    display: flex;
    background-color: rgb(255, 255, 255);
    
    align-items: center;
    border-radius: 100px;
    overflow: hidden;

    border: 1px solid #000000;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 25rem;

    justify-content: center;

   
  } 

  nav{ 
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 90%;
    max-width: 25rem;
    
  }

  .btn {
  padding: 0.5em 1.5em;
  color: #000000;
  background-color: rgb(255, 255, 255);
  cursor: pointer;
  border-radius: 100px;
  font-weight: bold;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  font-size: clamp(0.8rem, 1vw, 1rem);

}

.btn:hover{
  background: rgb(255, 255, 255);
  color: #000000;

  
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);

  transform: translateY(-5px);
}
.btn.active {
  background: rgb(0, 0, 0);
  color: #FFFFFF;
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
    font-weight: 600;
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6);
  }

  .timer-box{
    position: relative;
    background-color:rgb(255, 255, 255); 
    color: black;
    width: 90%;
    /* min-width: 25rem; */
    max-width: 25rem;
    min-height: 10rem;
    max-height: 15rem;  
    text-align: center;
    padding: 2rem;
    border-radius: 1rem;
    font-size: 2rem;  
    padding: 1.5rem;

    border: 1px solid #000000;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    margin-top: 3rem;
    margin-bottom: 1rem;
  } 

 
  .start-button{  
    font-family: 'Chillax', sans-serif;
    background-color: black;
    color: white;
    border-radius: 100px;
    padding: 10px;
    border-color: #000000;
    border-width: 2px;
    border-style: solid;
    font-weight: bold;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .start-button:hover{
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    transform: translateY(-5px);
  }

  .reset-button{ 
    font-family: 'Chillax', sans-serif; 
    background-color: rgb(255, 255, 255);
    color: rgb(0, 0, 0);
    border-radius: 100px;
    padding: 10px;
    border-color: rgb(0, 0, 0);
    border-width: 2px;
    border-style: solid;
    font-weight: bold;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .reset-button:hover{
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    transform: translateY(-5px);
  }


  .reward-button{  
    
    position: absolute;
    top: -1.5rem; /* moves button up to overlap */
    right: -1.5rem;
    
    
    background-color: #ff2a00;
 

    font-family: 'Chillax', sans-serif;
    color: white;
    border-radius: 100px;
    padding: 10px;
    border-color: #ff2a00;
    border-width: 2px;
    border-style: solid;
    font-weight: bold;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    z-index: 2;
  
    
  }

  .reward-button:hover{
   box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    transform: translateY(-5px);
  }








.modal-backdrop{
  margin: 1rem auto;
  background-color: #FFFFFF;
  width: 35%;
  max-width: 70rem;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  padding-right: 1rem;
  padding-left: 1rem;

  border: 1px, solid, #000000;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-content{
  color:#000000;
  padding-bottom: 1rem;
}
#player-container {
    margin-top: 1rem;
    background-color: #000000;
    position: relative; /* Needed to position the blocker over the player */
    width: 360px;
    height: 640px;
    border-radius: 1rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;

  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }

#long-container {
    background-color: #000000;
    position: relative; /* Needed to position the blocker over the player */
    width: 100%;
    max-width: 640px;
    aspect-ratio: 16 / 9;
    border-radius: 1rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

#long-player{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.long-blocker {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    max-width: 640px;
    aspect-ratio: 16 / 9;
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

  #text-container{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .submit{
    margin-top: 1rem;
    font-family: 'Chillax', sans-serif;
    background-color: black;
    color: white;
    border-radius: 100px;
    padding: 10px;
    border-color: #000000;
    border-width: 2px;
    border-style: solid;
    font-weight: bold;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .submit:hover{
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    transform: translateY(-5px);
  }

  .exit {
    background-color: #FFFFFF;
    border-style: solid;
    border-color: #000000;
    border-width: 1px;
    border-radius: 100px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    margin: 1rem;
  }

  .exit:hover{ 
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    transform: translateY(-5px);
  }
  .icon {
  background-color: #FFFFFF;
  width: 1rem;
  height: 1rem;
  vertical-align: middle;
}

#puzzle-input{
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0.4rem 0.8rem;
  font-size: 0.75rem;
  border: none;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  background-color: #f3f4f6;
  color: #333;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  outline: none;
}

footer{
  padding-top: 20rem;
}

</style>


