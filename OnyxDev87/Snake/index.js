const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

score = 0
bgcolor = 'white'

canvas.width = 1050
canvas.height = 576

class Apple {
  constructor({
    position,
    height,
    width
  }) {

    this.position = position
    this.height = height
    this.width = width
  }

  placeApple() {
    this.position.x = Math.floor(Math.random() * 1050)
    this.position.y = Math.floor(Math.random() * 576)
  }

  draw() {
    c.fillStyle = 'rgba(255, 0, 0, 1)'
    c.fillRect(this.position.x, this.position.y, this.height, this.width)
  }
}

class Snake {
  constructor({
    position,
    height,
    width,
    lastPosition
  }) {

    this.position = position
    this.height = height
    this.width = width
    this.lastPosition = lastPosition
  }

  draw() {
    c.fillStyle = 'rgba(14, 127, 22, 1)'
    c.fillRect(this.position.x, this.position.y, this.height, this.width)
  }
}

class Tail {
  constructor({
    position,
    height,
    width,
    lastPosition
  }) {
    this.position = position
    this.height = height
    this.width = width
    this.lastPosition = lastPosition
  }
  
  draw() {
    c.fillStyle = 'rgba(14, 127, 22, 1)'
    c.fillRect(this.position.x, this.position.y, this.height, this.width)
  }
}

function collision({ object1, object2 }) {
  return (
    object1.position.y + object1.height >= object2.position.y &&
    object1.position.y <= object2.position.y + object2.height &&
    object1.position.x <= object2.position.x + object2.height &&
    object1.position.x + object1.width >= object2.position.x
  )
}

const apple = new Apple({
  position: {
    x: 10,
    y: 10
  },
  height: 50,
  width: 50
})
apple.placeApple()

const snake = new Snake({
  position: {
    x: 10,
    y: 10
  },
  height: 50,
  width: 50,
  lastPosition: {
    x: 0,
    y: 0
  }
})

const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  w: {
    pressed: false
  },
  s: {
    pressed: false
  },
}

const tailPieces = []

function animate() {
  animationId = requestAnimationFrame(animate)
  c.fillStyle = bgcolor
  c.fillRect(0, 0, canvas.width, canvas.height)

  apple.draw()
  snake.draw()

  if (keys.d.pressed) {
    snake.lastPosition.x = snake.position.x
    snake.lastPosition.y = snake.position.y
    snake.position.x += 5
  } else if (keys.a.pressed) {
    snake.lastPosition.x = snake.position.x
    snake.lastPosition.y = snake.position.y
    snake.position.x -= 5
  } else if (keys.w.pressed) {
    snake.lastPosition.x = snake.position.x
    snake.lastPosition.y = snake.position.y
    snake.position.y -= 5
  } else if (keys.s.pressed) {
    snake.lastPosition.x = snake.position.x
    snake.lastPosition.y = snake.position.y
    snake.position.y += 5
  }

  if (collision({
    object1: snake,
    object2: apple
  })) {
    apple.placeApple()
    score++

    const tail = new Tail({
      position: {
        x: snake.position.x,
        y: snake.position.y
      },
      height: 50,
      width: 50,
      lastPosition: {
        x: this.position.x,
        y: this.position.y
      }
    })
    tailPieces.push(tail)
    tailPieces[0].position.x = snake.lastPosition.x
    tailPieces[0].position.y = snake.lastPosition.y

    tailPieces.forEach((tail) => {
      tail.draw()
    })
  }

  if (snake.position.x <= 0 ||
      snake.position.x + snake.height >= 1050 ||
      snake.position.y <= 0 ||
      snake.position.y + snake.width >= 576) {
    c.fillStyle = 'black'
    c.font = "50px serif"
    c.fillText('YOU DIED', (canvas.width / 2) - 100, canvas.height / 2)
    window.cancelAnimationFrame(animationId)
    location.reload()
  }
  c.fillStyle = 'black'
  c.font = "50px serif"
  c.fillText('Score: ' + String(score), 425, 50)
}

animate()

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      keys.w.pressed = false
      keys.a.pressed = false
      keys.s.pressed = false
      break
    case 'a':
      keys.a.pressed = true
      keys.d.pressed = false
      keys.w.pressed = false
      keys.s.pressed = false
      break
    case 'w':
      keys.w.pressed = true
      keys.a.pressed = false
      keys.s.pressed = false
      keys.d.pressed = false
      break
    case 's':
      keys.s.pressed = true
      keys.d.pressed = false
      keys.w.pressed = false
      keys.a.pressed = false
      break
  }
}
)
