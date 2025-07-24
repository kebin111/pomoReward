<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  let navItems = ["Chill", "Puzzle", "BRAINROT"];

  //timer 
  let minutes = 25;
  let seconds = 0;
  let timerRunning = false;
  let interval;

  function startTimer() {
    if (timerRunning) return;
    timerRunning = true;

    interval = setInterval(() => {
      if (minutes === 0 && seconds === 0) {
        clearInterval(interval);
        timerRunning = false;
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

  function resetTimer() {
    clearInterval(interval);
    minutes = 25;
    seconds = 0;
    timerRunning = false;
  }

   // Format with leading zero
  $: formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

</script>

<main>

  <div class="nav-class">
    <nav>
      <ul>
        {#each navItems as item}
          <li><a href="#">{item}</a></li>
        {/each}
      </ul>
    </nav>
  </div>

   <div class="timer-hero">
      <div class="timer-box">
        <h1>{formattedTime}</h1>
        <button class="start-button" on:click={startTimer}>Start</button>
        <button class="reset-button" on:click={resetTimer}>Reset</button>
      </div>
  </div>
</main>

<style>
  :root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
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
}
  .nav-class{
    background-color: rgb(107, 107, 107);
    min-width: 50rem;
    
  } 

  nav{
    padding: 1rem 2rem;
   
  }

  ul{
    display: flex;
    gap: 1.5rem;               /* Space between nav items */
    list-style: none;
    margin: 0;
    padding: 0;
    justify-content: center;
  }


  .timer-hero{
    display: flex;
    background-color: red;    
    justify-content: center;  
    align-items: center;  
    min-height: 25rem;
    max-height: 50rem;
  }

  .timer-box{
    background-color:rgb(22, 0, 117); 
    min-width: 25rem;
    max-width: 25rem;
    min-height: 10rem;
    max-height: 10rem;
    text-align: center;
    padding: 2rem;
    border-radius: 1rem;
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
</style>
