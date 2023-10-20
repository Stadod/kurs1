// var posX;
// var posY;
// socket.on("position_blockX", (array) => {
// posX = array;
// });
// socket.on("position_blockY", (array) => {
// posY = array
// });


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
        // console.log(player.c1)
        // console.log(player.c2)
        // console.log(player.c3)
        // console.log(player.c4)

        context.beginPath();
        let posx = Math.random()*1.5
        let posy = Math.random()*1.5
        context.fillRect(playerX + posx ,playerY + posy, player.x1, player.y1);
        context.fillStyle = "rgb("+player.c1+","+player.c2+","+player.c3+","+player.c4+")";
        context.closePath();
    }
}