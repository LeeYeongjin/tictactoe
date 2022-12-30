

let game_end = false;
const boxes = document.querySelectorAll(".grid-item");
const players = document.querySelector(".players").children;
const tictactoe = document.querySelector("#tictactoe");
let puck_sentence = document.querySelector(".pucks").children;
const wrapper = document.querySelector(".wrapper");
const register = document.getElementById("register");
const loginForm = document.getElementById("login");
const pucks = [];

tictactoe.remove();

const playerNames = [];
const playerPucks = [];

// Login
loginForm.addEventListener("submit", submit_event => {
    submit_event.preventDefault();
    const inputs = submit_event.target.querySelectorAll("input");

    if (register.children.length > 1){
        const del_warning = register.children[1];
        register.removeChild(del_warning);
    }
    

    if (!(inputs[0].value && inputs[1].value)) {
        const warning = createElement("p");
        const text = document.createTextNode("You Need to put both Name and Puck");
        warning.appendChild(text);
        register.appendChild(warning);

    }else if (inputs[1].value.length > 1){
        const warning = createElement("p");
        const text = document.createTextNode("Puck needs to be 1 character");
        warning.appendChild(text);
        register.appendChild(warning);

    }else if (playerNames.length === 1){
        if (playerNames[0] === inputs[0].value || playerPucks[0] === inputs[1].value){
            const warning = createElement("div");
            const text = document.createTextNode(`You have same Name or Puck with`);
            const text2 = document.createTextNode(`Player 1: ${playerNames[0]}, Puck: ${playerPucks[0]}`);
            warning.appendChild(text);
            warning.appendChild(createElement('br'));
            warning.appendChild(text2);
            register.appendChild(warning);
        }else{
            playerNames.push(inputs[0].value);
            playerPucks.push(inputs[1].value);
        }
    }else {
        playerNames.push(inputs[0].value);
        playerPucks.push(inputs[1].value);
    }

    if (playerNames.length === 2) {
        for (let i=0; i<playerNames.length; i++){
            puck_sentence[i].querySelector("span").textContent = playerPucks[i];
            players[i].querySelector("span").textContent = playerNames[i];
        }
        register.remove()
        wrapper.appendChild(tictactoe);
    }

    inputs.forEach(input => input.value = "");
});



// wrapper.appendChild(tictactoe);


const board = [];
let pos = 0;
for (let i=0; i<3; i++){
    let row = [];
    for (let j=0; j<3; j++){
        boxes[pos].value = `${i}-${j}`
        row.push(boxes[pos]);
        pos++;
    }
    board.push(row);
}

const left_diag = [];
const right_diag = [];


function createElement(type, attrs){
    const elem = document.createElement(type);
    
    if (attrs){
        for (let attr of attrs){
            elem[attr] = attr.value;
        }
    }

    return elem;
}

// left diagonal and right diagonal
let [pos_i, pos_j] = [0, 2];
for (let i=0; i<3; i++) {
    for (let j=0; j<3; j++){
        i === j && left_diag.push(board[i][j]);
        if (pos_i === i && pos_j === j) {
            right_diag.push(board[i][j]);
            pos_i++;
            pos_j--;
        }
    }
}

for (let puck of puck_sentence){
    pucks.push(puck.querySelector("span"));
}


let cur_player_num = 0;
let cur_player = players[cur_player_num];
let cur_puck = pucks[cur_player_num];

function switch_player(){
    cur_player_num == 0 ? cur_player_num = 1 : cur_player_num = 0;
    cur_puck = pucks[cur_player_num];
    cur_player = players[cur_player_num];
}

function checkLineWin(i, j, arr) {
    let cur_puck = board[i][j].textContent;
    let count = 0;
    for (let elem of arr){
        elem.textContent && elem.textContent === cur_puck && count++;
    }
    return count === 3;
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function checkWinGame(pos){
    const [i, j] = pos.split('-');
    const row = board[i];
    const col = board.map(row=>row[j]);

    const lines = [row, col];

    if (!((i != 1) ? !(j != 1) : (j != 1))){
        lines.push(left_diag);
        lines.push(right_diag);
    }

    for (let line of lines) {
        if (checkLineWin(i, j, line)){
            for (let elem of line) {
                elem.style.backgroundColor = "red";
            }
            return true;
        }
    }
    return false;
}

function checkDraw(){
    for (let row of board){
        for (let elem of row){
            if (!elem.textContent){
                return false;
            }
        }
    }
    return true;
}

async function statusPrinter (textPrint) {
    await sleep(2300);
    tictactoe.remove();
    const elem = createElement("div");
    elem.classList.add("status");
    const textPrint_elem = document.createTextNode(textPrint);
    elem.appendChild(textPrint_elem);
    const wrapper = document.querySelector(".wrapper");
    wrapper.appendChild(elem);
}

function removeEvent (elem_event) {
    elem_event.forEach(elem => elem.removeEventListener("click"));
}

boxes.forEach(box => box.addEventListener("click", async box_event => {
    if (!game_end){
        if (box_event.target.textContent) {
            console.warn("Cannot put it to this box");
        } else{
            box_event.target.textContent = cur_puck.textContent;
            box_event.target.classList.remove("grid-item-hover");
        }

        // Winning Status
        if (checkWinGame(box_event.target.value)){
            game_end = true;
            await statusPrinter(`Win: ${cur_player.querySelector("span").textContent}`);
            const retry = createElement("button");
            
            
        // Draw Status
        }else if (checkDraw()){
            game_end = true;
            await sleep(1000);
            boxes.forEach(box => box.style.backgroundColor = "blue");
            await statusPrinter("Draw!");
            const retry = createElement("button");

        // Still in-game
        }else {
            switch_player();
        }
    }

}));

