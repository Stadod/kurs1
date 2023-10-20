const players = {};
 
width = 1920 - 300 - 10;
height = 1080 - 150 - 10;
const WINDOW_WIDTH = width;
const WINDOW_HIGHT = height;

class Player {
    constructor(props){
        this._name = props.name;
        this._id = props.id;
        this._playerRadius = 30;
        this._space = false;
        
        this.x1 = Math.floor(Math.random()* (280) + 20);
        this.y1 = Math.floor(Math.random()* (280) + 20);
        this.c1 = Math.floor(Math.random()* (205) + 50);
        this.c2 = Math.floor(Math.random()* (205) + 50);
        this.c3 = Math.floor(Math.random()* (205) + 50);
        this.c4 = Math.random()

        this._hide = false;
        this._visible = true;

        this.positionX = 50;//Math.floor(Math.random()* 1610);// (max - min) + min 300;
        this.positionY = 80;//Math.floor(Math.random()* 920);
    }
}

module.exports.getPlayers = (socket) => {
    socket.on("new player", (_name) => {
        players[socket.id] = new Player({
            id: socket.id,
            name: _name,
        });
    });

    //получим результаты из move.js
    socket.on("movement", (move) => {
        const player = players[socket.id] || {};
        const speed = 10;

        if(move.left && player.positionX > 0){
            player.positionX -= speed;
        }
        if(move.up && player.positionY > 0){
            player.positionY -= speed;
        }
        if(move.right && player.positionX < WINDOW_WIDTH ){
            player.positionX += speed;
        }
        if(move.down && player.positionY < WINDOW_HIGHT){
            player.positionY += speed;
        }
        player._space = move.space;
    })

    socket.on("disconnect", () => {
        delete players[socket.id];
    })

    return players;
}