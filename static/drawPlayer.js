const drawPlayer = (context, player) => {
    const playerX = player.positionX;
    const playerY = player.positionY;

    // context.beginPath();
    // context.fillStyle = "rgb(255, 152, 8)";
    // context.font = "30px sans-serif";
    // context.textAlign = "center";
    // context.fillText(`${player._name}`, playerX, playerY - 50);
    // context.closePath();

    if(player._hide == false){
        context.beginPath();        
        context.fillStyle = "rgb(255, 152, 8)";
        context.font = "30px sans-serif";
        context.textAlign = "center";
        context.fillText(`${player._name}`, playerX, playerY - 50);
        context.strokeStyle = "white";
        context.lineWidth = 10;
        context.arc(playerX, playerY, player._playerRadius, 0, Math.PI * 2);
        context.stroke();
        context.closePath();
    }else{
        context.beginPath();
        let posx = Math.random()
        let posy = Math.random()
        context.fillRect(playerX + posx ,playerY + posy, player.x1, player.y1);
        context.fillStyle = "rgb("+player.c1+","+player.c2+","+player.c3+","+player.c4+")";
        context.closePath();
    }
}