const movement = {
    up: false,
    down: false,
    left: false,
    right: false,
    space: false,
    action: false,
    prison: false,
}

document.addEventListener("keydown", (event) => {
    switch(event.keyCode){
        case 65: //A
            movement.left = true;
            break;
        case 87: //W
            movement.up = true;
            break;
        case 68: //D
            movement.right = true;
            break;
        case 83: //S
            movement.down = true;
            break;
        case 76: //space
            movement.space = true;
            break;
        case 69: //action
            movement.action = true;
            break;
        case 81: //prison
            movement.prison = true;
            break;
    }
});

document.addEventListener("keyup", (event) => {
    switch(event.keyCode){
        case 65: //A
            movement.left = false;
            break;
        case 87: //W
            movement.up = false;
            break;
        case 68: //D
            movement.right = false;
            break;
        case 83: //S
            movement.down = false;
            break;
        case 76: //L (осалить)
            movement.space = false;
            break;
        case 69: //action
            movement.action = false;
            break;
        case 81: //prison
            movement.prison = false;
            break;
    }
});

setInterval(() => {
    socket.emit("movement", movement);
}, 1000 / 60)