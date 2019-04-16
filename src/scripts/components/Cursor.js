export default class Cursor
{
  constructor()
  {
    this.draw()
  }

  draw()
  {
    // Get elements
    const $canvas = document.querySelector('canvas')
    const context = $canvas.getContext('2d')

    // Resize canvas
    const resize = () =>
    {
      $canvas.width = window.innerWidth
      $canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)
    resize()

    // Define variables
    this.isMouseDown = false
    let subDown = 0
    let radius  = 30
    let width   = 0.5
    let moving  = false

    // Define positions
    const mouse =
    {
      x: $canvas.width,
      y: $canvas.height
    }
    const circleCoords =
    {
      x: mouse.x,
      y: mouse.y
    }

    if (!Modernizr.touchevents)
    {
      // Listen to events
      document.addEventListener('mousedown', () =>
      {
        this.isMouseDown = true
      })
      document.addEventListener('mouseup', () =>
      {
        this.isMouseDown = false
        radius = 30
      })
      document.addEventListener('mousemove', (event) =>
      {
        mouse.x = event.clientX
        mouse.y = event.clientY
        moving = true
      })
    }
    else
    {
      window.addEventListener('touchmove', (event) =>
      {
        mouse.x = event.touches[0].clientX
        mouse.y = event.touches[0].clientY
        moving = true
      })
    }

    // Animate cursor
    const loopCanvas = () =>
    {
      window.requestAnimationFrame(loopCanvas)

      if (moving)
      {
        if (radius < 100)
          radius += 0.5
        if (width < 1)
          width += 0.5
      }
      else
      {
        if (radius > 30)
          radius -= 3
        if (width > 1)
          radius -= 0.1
      }
      moving = false

      if (this.isMouseDown)
      {
        subDown += 0.1
        radius  = Math.max(15, radius - subDown)
      }
      else
      {
        subDown = 0
      }

      // Reset
      context.clearRect(0, 0, $canvas.width, $canvas.height)

      circleCoords.x += (mouse.x - circleCoords.x) * 0.12
      circleCoords.y += (mouse.y - circleCoords.y) * 0.12

      // Draw circle
      context.beginPath()
      context.arc(circleCoords.x, circleCoords.y, radius, 0, Math.PI * 2)
      context.strokeStyle = '#FFFFFFA0'
      context.lineWidth = width
      context.stroke()

      //Draw dot
      context.beginPath()
      context.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2)
      context.fillStyle = '#FFFFFF'
      context.fill()
    }
    loopCanvas()
  }
}
