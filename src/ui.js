export function drawHUD(hudEl, player, stage) {
  hudEl.innerHTML = `Age: ${player.age} • 
    💚 ${player.stats.health} 😀 ${player.stats.happiness} 📚 ${player.stats.knowledge}
    ❤️ ${player.stats.relationships} 💰 ${player.stats.wealth}`;
}

export function showOverlay(ctx, text) {
  const { width:W, height:H } = ctx.canvas;
  ctx.fillStyle = "rgba(0,0,0,.58)"; ctx.fillRect(0,0,W,H);
  ctx.fillStyle = "#eaf0ff"; ctx.font="20px system-ui";
  wrapText(ctx, text, 40, 80, W-80, 24);
}
function wrapText(ctx, text, x, y, max, lh){
  const words=text.split(" "); let line=""; for (let w of words){
    const test=line?line+" "+w:w; if (ctx.measureText(test).width>max){
      ctx.fillText(line,x,y); y+=lh; line=w;
    } else line=test;
  } ctx.fillText(line,x,y);
}