var posX = [];
var posY = [];
socket.on("position_blockX", (arrayx) => {
posX = arrayx;
});
socket.on("position_blockY", (arrayy) => {
posY = arrayy
});
    

const drawClone = (context, player) => {
    for(i=0; i < 8; i++){
    
    // console.log(player.c1)
    // console.log(player.c2)
    // console.log(player.c3)
    // console.log(player.c4)
    
        
    context.beginPath();
    context.fillRect(posX[i] ,posY[i], player.x1, player.y1);
    context.fillStyle = "rgb("+player.c1+","+player.c2+","+player.c3+","+player.c4+")";
    context.closePath();
    }
    
}