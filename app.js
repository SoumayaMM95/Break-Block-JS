
const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')

const blockWidth = 100
const blockHeight = 20

const boardWidth = 560
const boardHeight = 300

const ballDiameter = 20

const userStart = [230, 10]
let currentPosition = userStart

const ballStart = [270, 40]
let ballCurrentPosition = ballStart

let randomDirection = [2, -2]

let xDirection = randomDirection[Math.floor(Math.random()*randomDirection.length)]
let yDirection = randomDirection[Math.floor(Math.random()*randomDirection.length)]

let timerId
let score = 0

//Create block class
class Block{
    // to add the bottom left of the blocks 
    // to determine the position of the block in the grid 
    constructor(xAxis, yAxis){
        this.bottomLeft = [xAxis,yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
        this.topLeft = [xAxis, yAxis + blockHeight]
    }

}

//array of all the blocks
const blocks = [
    //each row has 5 blocks,
    // the xAxis move along left for 110px(100px width of the block and 10px margin)
    // the yAxis move along bottom for 30px(20px height of the block and 10px margin)
    
    //first row
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    //second row
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    //third row
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210),
]

//Add the blocks
function addBlocks(){
     for (let i = 0; i < blocks.length; i++){
        const block = document.createElement('div')
        block.classList.add('block')
        block.style.left = blocks[i].bottomLeft[0] + 'px'
        block.style.bottom = blocks[i].bottomLeft[1] + 'px' 
        grid.appendChild(block) //grab the grid
    }
}
addBlocks()

//Add user
const user = document.createElement('div')
user.classList.add('user')
grid.appendChild(user)
drawUser()
//draw user
function drawUser() {
    user.style.left = currentPosition[0] + 'px'
    user.style.bottom = currentPosition[1] + 'px'
}


//move user
function moveUser(e) { 
    //use a switch case to listen for keys(ArrowLeft & ArrowRight)
    switch (e.key) {
        case 'ArrowLeft':
          if (currentPosition[0] > 0) {
            currentPosition[0] -= 10
            console.log(currentPosition[0] > 0)
            drawUser()   
          }
          break;
        case 'ArrowRight':
          if (currentPosition[0] < (boardWidth - blockWidth)) {
            currentPosition[0] += 10
            console.log(currentPosition[0])
            drawUser()   
          }
          break;
      }
}
document.addEventListener('keydown', moveUser)


//add ball
const ball = document.createElement('ball')
ball.classList.add('ball')
grid.appendChild(ball)
drawBall()
//draw Ball
function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px'
    ball.style.bottom = ballCurrentPosition[1] + 'px'
  }


//move ball
function moveBall(){
    ballCurrentPosition[0] += xDirection
    ballCurrentPosition[1] += yDirection
    drawBall()
    checkForHits()
}
timerId = setInterval(moveBall, 30) //call the moveBall function every 30ms

//check for hits
function checkForHits() {

  //check for block hits
  for (let i = 0; i < blocks.length; i++){
    if
    (
      (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
      ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1]) 
    )
      {
      const allBlocks = Array.from(document.querySelectorAll('.block')) //get all blocks
      allBlocks[i].classList.remove('block') //if the ball hits the block, remove the class of block
      blocks.splice(i,1) //remove the block from the 'blocks' array
      changeDirection()   
      score++
      scoreDisplay.innerHTML = score
      if (blocks.length == 0) {
        scoreDisplay.innerHTML = 'You Win!'
        clearInterval(timerId)
        document.removeEventListener('keydown', moveUser)
      }
    }
  }

   // check for wall hits
   if (ballCurrentPosition[0] >= (boardWidth - ballDiameter) || ballCurrentPosition[0] <= 0 || ballCurrentPosition[1] >= (boardHeight - ballDiameter))
  {
    changeDirection()
  }

   //check for user hits
   if
   (
     (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
     (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight ) 
   )
   {
     changeDirection()
   }

   // if the ball hits the bottom border game over
   if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerId)
    scoreDisplay.innerHTML = 'GAME OVER, You lose!'
    document.removeEventListener('keydown', moveUser)
  }
}

function changeDirection() {
    if (xDirection === 2 && yDirection === 2) {
    // if the ball is moving to the top right of the grid change direction
      yDirection = -2
      return
    }
    if (xDirection === 2 && yDirection === -2) {
    // if the ball is moving to the bottom right of the grid change direction
      xDirection = -2
      return
    }
    if (xDirection === -2 && yDirection === -2) {
    // if the ball is moving to the bottom left of the grid change direction
      yDirection = 2
      return
    }
    if (xDirection === -2 && yDirection === 2) {
    // if the ball is moving to the top lef of the grid change direction
      xDirection = 2
      return
    }
}
