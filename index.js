


const boxes = document.querySelectorAll(".grid-item");
const players = document.querySelector(".players").children;
const tictactoe = document.querySelector("#tictactoe");
let puck_sentence = document.querySelector(".pucks").children;
const pucks = [];

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

boxes.forEach(box => box.addEventListener("click", async box_event => {
    if (box_event.target.textContent) {
        console.warn("Cannot put it to this box");
    } 
    else{
        box_event.target.textContent = cur_puck.textContent;

        if (checkWinGame(box_event.target.value)){
            await sleep(2300);
            tictactoe.remove();
            const winElem = createElement("div");
            winElem.classList.add("status");
            const text = document.createTextNode(`Win: ${cur_player.querySelector("span").textContent}`);
            winElem.appendChild(text);
            const wrapper = document.querySelector(".wrapper");
            wrapper.appendChild(winElem);
            
        }else if (checkDraw()){
            await sleep(1000);
            boxes.forEach(box => box.style.backgroundColor = "blue");
            await sleep(2300);
            tictactoe.remove();
            const drawElem = createElement("div");
            drawElem.classList.add("status");
            const text = document.createTextNode(`Draw!`);
            drawElem.appendChild(text);
            const wrapper = document.querySelector(".wrapper");
            wrapper.appendChild(drawElem);
        }else {
            switch_player();
        }
    }
}));

