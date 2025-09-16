import { makeGame } from "./engine.js";
import { drawHUD, showOverlay } from "./ui.js";

export function boot(){
  const canvas = document.getElementById("game");
  const hudEl = document.getElementById("hud");
  const game = makeGame(canvas, hudEl);

  // input (touch/mouse)
  function setX(clientX){
    const r = canvas.getBoundingClientRect();
    game.setTargetFromX(clientX - r.left);
  }
  canvas.addEventListener("mousemove", e=> setX(e.clientX));
  canvas.addEventListener("touchmove", e=> { setX(e.touches[0].clientX); }, {passive:true});

  function loop(){
    game.step();
    game.draw();
    drawHUD(hudEl, game.player, game.player.stage);

    // brief overlay after outcomes/stage summaries (you can add timers)
    if (game.state.phase==="STAGE_SUMMARY" && game.state.text) {
      const ctx = canvas.getContext("2d"); showOverlay(ctx, game.state.text);
      // tap/space to continue
      window.onkeydown = () => { game.state.phase="RUN"; game.state.text=null; window.onkeydown=null; };
      canvas.onclick = () => { game.state.phase="RUN"; game.state.text=null; canvas.onclick=null; };
    }
    if (game.state.phase==="GAME_OVER") {
      const ctx = canvas.getContext("2d"); showOverlay(ctx, "Life summary… (TODO)");
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}