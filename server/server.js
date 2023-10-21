const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");

const getPlayers = require("./Player").getPlayers;

const app = express();
const server = http.Server(app);
const io = socketIO(server);


app.set("port", 5000);

app.use("/static", express.static(path.dirname(__dirname) + "/static"));


//при запросе на переход на localhost ответом отправляется index.html 
app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "index.html"));
});

//массив блоков
var array_blocks = [];
var posX = [];
var posY = [];

function clonePosition(){
    for(i=0; i < 5; i++){
        let x = Math.floor(Math.random()* ((1610 - 60)));
        let y = Math.floor(Math.random()* ((920 - 60)));
        
           posX[i] = x;
           posY[i] = y;
    }}
    
    clonePosition();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
server.listen(5000, () => {
    console.log("Starting server on port 5000");

    width = 1610;
    height = 920;
    const WINDOW_WIDTH = width;
    const WINDOW_HIGHT = height;
    
    /////////////////////////////////////////////////////////////////////////////////////////////////
    //рисуем блоки (при запуске сервера)
    for(i=0; i < 200; i++){
        let x0 = Math.floor(Math.random()* ((WINDOW_WIDTH - 60 )));
        let y0 = Math.floor(Math.random()* ((WINDOW_HIGHT - 60)));
        let x1 = Math.floor(Math.random()* (280) + 20);
        let y1 = Math.floor(Math.random()* (280) + 20);
        let c1 = Math.floor(Math.random()* (205) + 50);
        let c2 = Math.floor(Math.random()* (205) + 50);
        let c3 = Math.floor(Math.random()* (205) + 50);
        let c4 = Math.random()
        //console.log(c4)
    
           array_blocks.push([x0, y0, x1, y1, c1, c2, c3, c4]);
    }

    //отправка клиенту массива с данными о блоках
    setInterval(() => {
        io.sockets.emit("drawedBlocks", array_blocks);
    }, 1000 )
    

    //отправка клиенту массива с данными о блоках
    setInterval(() => {
        io.sockets.emit("position_blockX", posX);
    }, 1000 )

    //отправка клиенту массива с данными о блоках
    setInterval(() => {
        io.sockets.emit("position_blockY", posY);
    }, 1000 )
    
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var bcolor = false;

//таймер выбора воды
var timer;
var done = true;


//таймер поиска
var timer_game;
var done_game_timer = true;

//состояние игроков
let players = null;

io.on("connection", (socket) => {

    //добавляется игрок
    players = getPlayers(socket);

    /////////////////////////////////////////////////////////////////////////////////////////////////
    //начинается таймер выбора воды при нажатии на кнопку
    socket.on("start_game", (count) => {
        io.sockets.emit("timer_started");
        const intervalId = setInterval(() => {
            timer = count;
            io.sockets.emit("timer", count);
            if(count>0) count--;
            else {
                clearInterval(intervalId);//когда таймер закончится, перестать его выполнять
                io.sockets.emit("timer_stoped");
                done = false;
            }
        }, 1000)
    })
    /////////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////////////////
    //таймер поиска воды
    socket.on("timer_game_start", (count) => {
        io.sockets.emit("timer_game_started");
        const intervalId = setInterval(() => {
            timer_game = count;
            io.sockets.emit("timer_game", count);
            if(count>0) count--;
            else {
                clearInterval(intervalId);//когда таймер закончится, перестать его выполнять
                io.sockets.emit("timer_game_stoped");
                done_game_timer = false;
            }
        }, 1000)
    })
    /////////////////////////////////////////////////////////////////////////////////////////////////
})

//функция "осаливания"........................................................................................................
function hide(player_hide){
    player_hide._visible = false;
    done_game_timer = true
}
//функция перекраски
function recolor(playerc){
    var r = 5;
    var nc1 = playerc.c1 = Math.floor(Math.random()* (205) + 50);
    var nc2 = playerc.c2 = Math.floor(Math.random()* (205) + 50);
    var nc3 = playerc.c3 = Math.floor(Math.random()* (205) + 50);
    var nc4 = playerc.c4 = Math.random()
    io.sockets.emit("newPlayerColor1", nc1);
    io.sockets.emit("newPlayerColor2", nc2);
    io.sockets.emit("newPlayerColor3", nc3);
    io.sockets.emit("newPlayerColor4", nc4);
    io.sockets.emit("r", r);
}
//функция замены клонов и прячищевося
function newCloneAPlay(player_h){
    clonePosition();
    var newClones = true;
    io.sockets.emit("newClone",newClones);
    player_h.positionX = Math.floor(Math.random()* ((1610 - 60)));;
    player_h.positionY = Math.floor(Math.random()* ((920 - 60)));
    recolor(player_h);
}

////////////////////////////////////////////////////////////////////////////////////////////////sd//////////////////////////////////////////////////////////////////////////////////////////////
//состояние игры
const gameLoop = (players, io) => {

    //массив айдишников
    let array_id = [];
        let i = 0;
        for (const id in players) {
            array_id[i] = id;
            i++;
        }


    /////////////////////////////////////////////////////////////////////////////////////////////////
    //проверка соприкосновени игрока с другим игроком + "осаливание"
    players_1 = players;
    players_2 = players;
    for (const id_1 in players_1) {
        const player_1 = players_1[id_1];

        for (const id_2 in players_2) {
            const player_2 = players_2[id_2];

            //проверка, чтоб не тыкал сам на себя
            if(player_1?._id != player_2?._id){
                if(    player_1?.positionX > (player_2?.positionX)//? - чтоб не вылазила ошибка при undefined 
                && player_1?.positionX < (player_2?.positionX + player_2?.x1) 
                && player_1?.positionY < (player_2?.positionY + player_2?.y1) 
                && player_1?.positionY > player_2?.positionY 
                && player_1?._visible == true && player_2?._visible)
                {
                    if(player_1?._space == true || player_2?._space == true){
                        if(player_1?._space == true && player_1?._hide == false){
                            hide(player_2);
                        }else if(player_2?._space == true && player_2?._hide == false){
                            hide(player_1);
                        }
                    }
                }
            }

        }
    }

    for (const id_1 in players_1) {
        const player_1 = players_1[id_1];

        for (const id_2 in players_2) {
            const player_2 = players_2[id_2];
                        if(bcolor){
                            /////тот кто ищет
                        if(player_1?._hide != true && player_1?._action == true && player_1?._prison == false){
                            recolor(player_2);
                        }else if(player_2?._hide != true && player_2?._action == true && player_2?._prison == false){
                            recolor(player_1);
                        }
                        ////тот кто прячеться
                        else if(player_1?._hide != false && player_1?._action == true && player_2?._prison == false){
                            newCloneAPlay(player_1);
                        }
                        else if (player_2?._hide != false && player_2?._action == true && player_1?._prison == false){
                            newCloneAPlay(player_2);
                        }
                    }
        }
    }

    //создаём массив оставшихся (видимых) игроков
    let array_visible = [];
        let j = 0;
        for (const id in players) {
            if(players[id]._visible){
                array_visible[j] = id;
                j++;
            }
        }

    //срабатывание таймера воды
    if(timer == 0 && !done){
        let random = Math.round(Math.random()*(array_visible.length - 1));//к ближайшему целому
        players[array_visible[random]]._hide = true;
        done = true;     
        bcolor = true;

        for (i=0;i<players_limit;i++) {
            const player = players[array_id[i]];
            if(player?._visible){
                count_visibles++;
                visible_id = array_id[i];
            } 
        }
        for (const id in players) {
            const player = players[id];
            if(player._hide == true){
                player.positionX = Math.floor(Math.random()* ((1610 - 60)));;
                player.positionY = Math.floor(Math.random()* ((920 - 60)));
            }
        }
    
    }

    //срабатывание таймера игры
    if(timer_game == 0 && !done_game_timer){    
        bcolor = false;

        for (const id in players) {
            const player = players[id];
            if(player._hide == false && array_visible.length != 1){
                player._visible = false;
            }else{
                player._hide = false;
            } 
        }

        done_game_timer = true;
    }

    var players_limit = 2;

    for (i=players_limit;i<array_id.length;i++) {
        const player = players[array_id[i]];
        player._visible = false;
    }

    //отправляем данные о состоянии игры
    io.sockets.emit("state", players);
    if(array_visible.length == 1) io.sockets.emit("game_end", true);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//отправление клиенту данные о состоянии игры 60 раз в секунду
setInterval(() => {
    if (players && io){
        gameLoop(players, io);
    }
}, 1000 / 60)
