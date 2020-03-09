
const lines = 6
const rows = 7
const caseSize = 50


let opponent = ""
let grid = []
let playerTurn = false

let nameInput = document.getElementById("nameInput")
let searchButton = document.getElementById("searchButton")
let canvas = document.getElementById("cv")
let tourMessage = document.getElementById("tourMessage")
let statusMessage = document.getElementById("statusMessage")

let errorMessage = document.getElementById("errorMessage")
canvas.width = rows * caseSize
canvas.height = lines * caseSize
canvas.style.background = "blue"

let context = canvas.getContext("2d")


for (let i = 0; i < rows; ++i) {
    let line = []
    for (let j = 0; j < lines; ++j) { line.push(0) }
    grid.push(line)
}

function draw() {
    for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < lines; ++j) {
            let x = caseSize / 2 + caseSize * i
            let y = caseSize / 2 + caseSize * j
            switch (grid[i][j]) {
                case 1:
                    context.fillStyle = "yellow"
                    break
                case 2:
                    context.fillStyle = "red"
                    break
                default:
                    context.fillStyle = "white"
                    break
            }
            context.beginPath()
            context.arc(x, y, caseSize / 3, 0, 360)
            context.fill()
            context.closePath()

        }

    }
}
canvas.addEventListener("mouseup", (ev) => {
    console.log(ev.offsetX, ev.offsetY)
    if (playerTurn) {
        let x = Math.floor(ev.offsetX / caseSize)
        let y = Math.floor(ev.offsetY / caseSize)
        console.log(x, y)
        socket.emit("place", x)

        playerTurn = false
        tourMessage.textContent = "tour de l'adversaire"
    }



})




function error(message) {
    errorMessage.style.display = "block"
    errorMessage.textContent = "an error occured : " + message
};


function status(message) {
    statusMessage.style.display = "block"
    statusMessage.textContent = "état : " + message
};

draw()


var socket = io();


searchButton.addEventListener("click", (ev) => {

    if (socket.connected) {
        let name = nameInput.value
        if (name == null || name == "") {
            error("name field is blank")
        } else {

            socket.emit("new player", name)
            socket.emit("search match")
        }
    }
    else {
        error("not connected")
    }
})

socket.on("error", error)
socket.on("errorMessage", error)

socket.on("connected", (c) => {
    console.log("connected !")

})
socket.on("your turn", () => {
    playerTurn = true
    tourMessage.textContent = "c'est votre tour"

})
socket.on("match ended", () => {
    playerTurn = false
    status("Le joueur s'est déconnecté")
})
socket.on("place", (sentGrid) => {
    console.log(grid, sentGrid)
    grid = sentGrid
    console.log(grid)
    draw()
})

socket.on("queued", () => {
    status("recherche de joueur")
})
socket.on("opponent name", (name) => {
    opponent = name

    status("Une partie a été trouvée, adversaire : " + name)



})



