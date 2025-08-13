<!-- NAVBAR -->
<script module>
  import { getTimerRunning } from './timer.svelte';
 let navItems = ["Chill", "Puzzle", "Brainrot", "Normal"];

 let modes = ["Normal", "Chill", "Puzzle", "Brainrot"];
 let mode = $derived(modes[0]);
 let modeText = $state("Normal Mode✅");
 let modeIndex = $state(0);
 let rewardText = $state("");

 let t_hero_color = $state('linear-gradient(to top left, #4E4E64, #20203d );'); 


// PAGE CHANGE FUNCTIONS

export function normalMode(){
     //change page colors
    t_hero_color = 'linear-gradient(to top left, #4E4E64, #20203d );';
    //change text
    mode = modes[0];
    modeText =  "Normal Mode ✅";
    modeIndex = modes.indexOf(mode);
    rewardText = "";
  }
export  function brainrotMode(){
    //change page colors
    t_hero_color = 'linear-gradient(to top left, #520000, #ff1e00 );';
    //change text
    mode = modes[3];
    modeText = "BRAINROT Mode 💀";
    modeIndex = modes.indexOf(mode);
    rewardText = "Congratulations! you get 5 minutes of SHORTS!";
  }
export  function chillMode(){
    //change page colors
    t_hero_color = 'linear-gradient(to top left, #63B9EB, #0062a3 );';
    //change text
    mode = modes[1];
    modeText = "Chill Mode 😌";
    modeIndex = modes.indexOf(mode);
    rewardText = "Congratulations! you get a calming video for 5 minutes!";
  }
export  function puzzleMode(){
    //change page colors
    t_hero_color = 'linear-gradient(to top left, #A2C700, #648002 );';
    //change text
    mode = modes[2];
    modeText = "Puzzle Mode 🧠";
    modeIndex = modes.indexOf(mode);
    rewardText = "Try to solve this puzzle in 5 minutes!";
    //jumbleWord(anagram);
  }

export function handleClick(item){
  if(getTimerRunning()){
    alert("Please wait for timer to finish or click reset to change mode.");
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
export function getColor(){
  return t_hero_color;
}

export function getModeText(){
    return modeText;
}

export function getMode(){
  return mode;
}

export function getModeIndex(){
  return modeIndex;
}

export function getRewardText(){
  return rewardText;
}

</script>

<div class="nav-class">
  <nav>
    {#each navItems as item}
    <div class="btn {item === mode ? 'active' : '' }" 
    on:click={() => handleClick(item)}>{item}</div>
    {/each}
  </nav>
</div>


<style>
.nav-class{
    display: flex;
    background-color: rgb(255, 255, 255);
    
    align-items: center;
    border-radius: 100px;
    overflow: hidden;

    border: 1px solid #000000;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 30rem;

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
</style>