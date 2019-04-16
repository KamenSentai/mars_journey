export default class Frame
{
  constructor()
  {
    this.update()
  }

  update()
  {
    // Get elements
    const $frame   = document.querySelector('.frame')
    const $hours   = $frame.querySelector('.hours')
    const $minutes = $frame.querySelector('.minutes')
    const $seconds = $frame.querySelector('.seconds')
    const $posA    = $frame.querySelector('.pos-a')
    const $posO    = $frame.querySelector('.pos-o')

    // Define variables
    let posA = 48.856614
    let posO = 2.287592

    // Update time
    setInterval(() =>
    {
      const date = new Date()
      $hours.textContent   = `${date.getHours()   > 9 ? '' : 0}${date.getHours()}`
      $minutes.textContent = `${date.getMinutes() > 9 ? '' : 0}${date.getMinutes()}`
      $seconds.textContent = `${date.getSeconds() > 9 ? '' : 0}${date.getSeconds()}`
    }, 1000)

    // Update position
    setInterval(() =>
    {
      $posA.textContent = posA.toPrecision(7)
      $posO.textContent = posO.toPrecision(6)
    }, 100)

    if (!Modernizr.touchevents)
    {
      // Mousemove event
      window.addEventListener('mousemove', (event) =>
      {
        posA += (event.clientX - window.innerWidth / 2) / 100000
        posO += (event.clientY - window.innerHeight / 2) / 100000
      })
    }
    else
    {
      // Device orientation
      window.addEventListener('deviceorientation', (event) =>
      {
        posA += ((event.alpha + 90) / 180 - 0.5) / 100
        posO += (event.beta / 90 - 0.5) / 100
      })
    }
  }
}
