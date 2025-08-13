<!-- REWARD MODAL -->

<script module>
   // @ts-nocheck
  import { audioData } from './audioData.js';
  import { getModeIndex, getRewardText } from './navBar.svelte';
  import { tick } from 'svelte';
  import { anagramMap } from './anagrams.js';


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

  let pWords = $state(0);
  let anaKey = $state("");
  let anaTemp = $derived([...anagram]);
  let anaLength = $derived(anaTemp.length);

  let solve = $state(false);

  let modeIndex = $derived(getModeIndex());
  let rewardText = $derived(getRewardText());

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

 export async function openModal(){
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

 export function closeModal(){
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

export function showRewardButton(){
    claimReward = true;
  }

export function hideRewardButton(){
    claimReward = false;
  }

export function pauseVideo(){
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

  export function restrictVideo(){
    restrict = true;
  }

  export function unrestrictVideo(){
    restrict = false;
  }

  export function playSound(audioIndex){
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

// puzzle

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


export function resetPuzzle(){
   solve = false;
}

export function open(){
  openModal();
}


export function getClaimReward(){
  return claimReward;
}

export function destroy(){
    if (player) {
      player.destroy();
      player = null;
    }

    if (longPlayer){
      longPlayer.destroy()
      longPlayer = null;
    }
}

export function setYTREADY(isYTready){
    ytReady = isYTready;
}


</script>


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

  <style>
.modal-backdrop{
  margin: 1rem auto;
  background-color: #FFFFFF;
  width: 90%;
  max-width: 25rem;
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
  </style>