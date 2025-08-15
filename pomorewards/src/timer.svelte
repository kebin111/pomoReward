<!-- TIMER -->
<script module>
import { getModeText } from './navBar.svelte';
import { openModal, closeModal,  showRewardButton, hideRewardButton, getClaimReward, playSound, resetPuzzle, restrictVideo, unrestrictVideo, pauseVideo } from './rewardModal.svelte';
let modeText = $derived(getModeText());

let workMin = $state(25);
let breakMin = $state(5); 
let minutes = $derived(workMin);
let seconds = $state(0);

let timerRunning = $state(false);
let breakTime = $state(false);
  
let interval;
let formattedTime = $derived(String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0'));

let claimReward = $derived(getClaimReward());
export function startTimer() {
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


  export function pauseTimer() {
    if (!timerRunning) return;

    clearInterval(interval);
    timerRunning = false;
    return;

  }

  export function resetTimer() {
    clearInterval(interval);
    minutes = 25;
    seconds = 0;
    timerRunning = false;
    breakTime = false;
    
    resetPuzzle();
  }

  export function getTimerRunning(){
    return timerRunning;
  }

</script>

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
          hideRewardButton();
        }}>Reset</button>

        {#if claimReward}
        <button class="reward-button" on:click={() => {
          openModal();
          hideRewardButton();
          startTimer();
        }}>Claim Reward!</button>
        {/if}
 </div>

 <style>

h2{
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


 </style>





