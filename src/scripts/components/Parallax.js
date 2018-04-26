export default class Parallax
{
    constructor()
    {
        this.move()
    }

    move()
    {
        // Get elements
        const $parallax = document.querySelectorAll('.parallax')

        // Get elements
        for (const $element of $parallax)
        {
            $element.parallaxX = 0
            $element.parallaxY = 0
        }

        // Define delta
        const delta =
        {
            x: 0,
            y: 0
        }

        if (!Modernizr.touchevents)
        {
            // Mousemove event
            window.addEventListener('mousemove', (event) =>
            {
                delta.x = -(event.clientX / window.innerWidth - 0.5)
                delta.y = -(event.clientY / window.innerHeight - 0.5)
            })
        }
        else
        {
            // Device orientation
            window.addEventListener('deviceorientation', (event) =>
            {
                delta.x = -((event.alpha + 90) / 180 - 0.5)
                delta.y = -(event.beta / 90 - 0.5)
            })
        }

        // Animate parallax
        const loop = () =>
        {
            window.requestAnimationFrame(loop)

            for (const $element of $parallax) {
                $element.parallaxX += ((delta.x / $element.dataset.depth * 100) - $element.parallaxX) * 0.1
                $element.parallaxY += ((delta.y / $element.dataset.depth * 100) - $element.parallaxY) * 0.1

                $element.style.transform = `translate(${$element.parallaxX}px, ${$element.parallaxY}px)`
            }
        }
        loop()
    }
}