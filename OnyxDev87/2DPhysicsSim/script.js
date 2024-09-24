//posydon worked on this too go follow me ->
// https://replit.com/@posydon
// https://github.com/p0syd0n

//also follow me pls im OnyxDev

//this has been commented to show someone who knows nothing about code what most things do

//brings the html  in to js, so that i can change them with code
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

//sets the canvas size
canvas.width = 1024
canvas.height = 576

//these are variable that can not be changed, and a list of all the balls in the simulation
const balls = []
const g = 0.5
const damping = 0.5
var bouncing = false;
var paused = false;
var G = false
//this is template for the balls, the arguments in the constructor are all the things it requires to be created
class Ball {
  //this happens when you make a ball
  constructor(position, velocity, radius, color, mass) {
    //saving the data within the ball instance
    this.position = position
    this.velocity = velocity
    this.radius = radius
    this.color = color
    this.mass = mass
    //adding itself to the global list of balls - balls.push(this) adds it to the list of balls above
    balls.push(this)
  }

  //the function for drawing the ball on the screen
  draw() {
    //update the ball drawing
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
    c.fillStyle = this.color
    c.fill()

  }

  update() {
    this.draw()

    //update the ball position
    this.wallCollisions()
    this.applyVelocity()
     
  }

  applyGravity() {
    this.velocity.y += g
  }

  //applies the velocity to the balls position, moving it
  applyVelocity() {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }

  wallCollisions() {
    
    if (this.position.y + this.velocity.y + this.radius >= canvas.height || this.position.y + this.velocity.y - this.radius <= 0) {
      this.velocity.y *= -1
    } else if (this.position.x + this.velocity.x + this.radius >= canvas.width || this.position.x + this.velocity.x - this.radius <= 0) {
      this.velocity.x *= -1
    }
  }
}

function xy_to_uv(ball1, ball2, xy) {
  // function converting xy vector (velocity or position) to uv vector
  const Rx  = ball2.position.x - ball1.position.x
  const Ry = ball2.position.y - ball1.position.y
  //c///onsole.log("xy to uv: ", xy)

  const u = xy.x * (Ry/Math.sqrt(Rx**2+Ry**2)) - xy.y * (Rx/Math.sqrt(Rx**2+Ry**2))

  const v = xy.x * (Rx/Math.sqrt(Rx**2+Ry**2)) + xy.y * (Ry/Math.sqrt(Rx**2+Ry**2))
  //console.log("xy to uv: ", u, v)
  return {u: u, v: v}
}

function uv_to_xy(ball1, ball2, uv)  {
  // function converting uv vector (velocity or position) to xy vector
  const Rx  = ball2.position.x - ball1.position.x
  const Ry = ball2.position.y - ball1.position.y

  //console.log("UV TO XY: ", uv)
  //console.log(uv.u)

  const x = uv.u * (Ry/Math.sqrt(Rx**2+Ry**2)) + uv.v * (Rx/Math.sqrt(Rx**2+Ry**2))

  const y = -uv.u * (Rx/Math.sqrt(Rx**2+Ry**2)) + uv.v * (Ry/Math.sqrt(Rx**2+Ry**2))

  //console.log("THE X AND Y IN XY ", x, y)
  return {x: x, y: y}
}

//creating the two balls
//creates a new ball using the template from above. The things in the parenthesis are the arguments for the constructor
const ball1 = new Ball({x: 100, y: 200}, {x: 5, y: 5}, 50, "blue", 100)

//same as above, but for the second ball
const ball2 = new Ball({x: 450, y: 400}, {x: 2, y: -1}, 50, "green", 100)

//this is the function that detects if the balls are colliding
//it uses the distance formula to find the distance between the two balls, and if that is less that the sum of the radii, then the balls are colliding
function collide() {
  console.log('check')
  if (Math.sqrt(((ball1.position.x+ball1.velocity.x)-(ball2.position.x+ball2.velocity.x))**2+((ball1.position.y+ball1.velocity.y)-(ball2.position.y+ball2.velocity.y))**2) <= ball1.radius+ball2.radius && ball1 != ball2) {
    console.log('bounce')
    
    ball1PreVelocity = ball1.velocity
    ball2PreVelocity = ball2.velocity
    
    bounce(ball1, ball2, ball1PreVelocity, ball2PreVelocity);
    bouncing = false;
  }
}

function bounce(ball1, ball2, ball1PreVelocity, ball2PreVelocity) {
  if (bouncing) {
    return;
  }
  console.log("BOUNCING")
  bouncing = true;
  // pre-collision velocity
  // converting velocities to xy vectors, because collision formulas use xy vectors
  let PRE_ball1_uv_velocity = xy_to_uv(ball1, ball2, ball1PreVelocity)
  let PRE_ball2_uv_velocity = xy_to_uv(ball2, ball1, ball2PreVelocity)
  
  console.log("PRE VELOCOTIES: ", PRE_ball1_uv_velocity, PRE_ball2_uv_velocity)
  // these are not used but we might use them later
  let PRE_ball1_uv_position = xy_to_uv(ball1, ball2, ball1.position)
  let PRE_ball2_uv_position = xy_to_uv(ball2, ball1, ball2.position)

  // collision maths

  let POST_ball1_uv_velocity = {u: PRE_ball1_uv_velocity.u, v: -((((ball1.mass - ball2.mass) * PRE_ball1_uv_velocity.v) + (2 * ball2.mass * PRE_ball2_uv_velocity.v)) / (ball1.mass + ball2.mass))}
  console.log("POST BALL 1: ", POST_ball1_uv_velocity)
  
  let POST_ball2_uv_velocity = {u: PRE_ball2_uv_velocity.u, v: ((((ball2.mass - ball1.mass) * PRE_ball2_uv_velocity.v) + (2 * ball1.mass * PRE_ball1_uv_velocity.v)) / (ball2.mass + ball1.mass))}
  console.log("POST BALL 2: ", POST_ball2_uv_velocity)




  //console.log("ON COLLISION PRE UV VELOCITIES: ")
  //console.log(PRE_ball1_uv_velocity)
  //console.log(PRE_ball2_uv_velocity)
  // converting back to xy and setting velocities
  ///console.log("CALLING UV TO XY WITH UV VECTORS: ", POST_ball1_uv_velocity, POST_ball2_uv_velocity)
  ball1.velocity = uv_to_xy(ball1, ball2, POST_ball1_uv_velocity)

  ball2.velocity = uv_to_xy(ball2, ball1, POST_ball2_uv_velocity)

  //console.log(ball1.color, " VELOCITY: ", ball1.velocity)
  //console.log(ball2.color, " VELOCITY: ", ball2.velocity)

}

//this function repeatedly calls itself, and within itself it cals that update balls funtion, found within the ball class
function animate() {
  if (paused) {
    return
  } else window.requestAnimationFrame(animate)
  //this gets called every frame
  //calls itself recursively
  //window.requestAnimationFrame(animate)  
  //chooses a color and draws the canvas as that color, erasing what is below it
  c.fillStyle = '#1e1e1e'
  c.fillRect(0, 0, canvas.width, canvas.height)
  //calls the collision function from above
  collide()
  //calls the ball update functions, redrawing them onto the blank canvas in a slightly different position

  if (G == true) {
    ball1.applyGravity()
    ball2.applyGravity()
  }
  
  
  ball1.update()
  ball2.update()

  c.fillStyle = 'white'
  c.font = '10px Arial'

  //draws information to the top of the screen
  //c.fillText('Total Momentum: ' + (Math.sqrt(ball1.velocity.x**2+ball1.velocity.y**2) + Math.sqrt(ball2.velocity.x**2+ball2.velocity.y**2)), 10, 10)
  //c.fillText('Total Energy: ' + (0.5 * (ball1.mass * (ball1.velocity.x**2)) + 0.5 * (ball2.mass * (ball2.velocity.x**2))), 10, 20)
  c.fillText('Ball1 Mass: ' + ball1.mass, 300, 10)
  c.fillText('Ball1 Velocity: ' + JSON.stringify(ball1.velocity), 300, 20)
  c.fillText('Ball2 Mass: ' + ball2.mass, 650, 10)
  c.fillText('Ball2 Velocity: ' + JSON.stringify(ball2.velocity), 650, 20)
}

document.addEventListener("keypress", (event) => {
  if (event.code == "Space") {
    if (paused) {
      paused = false;
      animate()
    }
    else {
      paused = true;
    }
  }
})

document.addEventListener("keydown", (event) => {
  if (event.key === "r") {  // r to reload
    location.reload()
  }
})

document.addEventListener("keydown", (event) => {
  if (event.key === "g") {
    if (G) {
      G = false
    } else {
      G = true
    }
  }
})

document.addEventListener("keydown", (event) => {
  if (event.key === "k") {
    eval(prompt("code: "))
  }
})

//setInterval(collide, 10)
//calls the animate function
animate()
