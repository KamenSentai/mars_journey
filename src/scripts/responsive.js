if (Modernizr.touchevents) {
    // Cursor
    window.addEventListener('touchmove', (event) => {
        mouse.x = event.touches[0].clientX
        mouse.y = event.touches[0].clientY

        moving = true
    })

    // Dots
    for (const $dot of dots) {
        $dot.addEventListener('touchstart', () => {
            isMouseDown = true
        })
        $dot.addEventListener('touchend', () => {
            isMouseDown = false
        })
    }

    // Parallax
    window.addEventListener('deviceorientation', (event) => {
        posA += ((event.alpha + 90) / 180 - 0.5) / 100
        posO += (event.beta / 90 - 0.5) / 100

        delta.x = -((event.alpha + 90) / 180 - 0.5)
        delta.y = -(event.beta / 90 - 0.5)
    })
}

// Replace circles if no match with the background
const windowSize = {
    x: window.innerWidth,
    y: window.innerHeight
}
const match10 = new Array()
const match21 = new Array()

const $c10 = Array.from($circles.querySelectorAll('.slide-1-0'))
const $c21 = Array.from($circles.querySelectorAll('.slide-2-1'))

match10.push([$c10[0], c10_1])
match10.push([$c10[1], c10_2])
match10.push([$c10[2], c10_3])
match10.push([$c10[3], c10_4])
match21.push([$c21[0], c21_1])
match21.push([$c21[1], c21_2])
match21.push([$c21[2], c21_3])

const replaceCircles = () => {
    windowSize.x = window.innerWidth
    windowSize.y = window.innerHeight
    const ratio = windowSize.x / windowSize.y

    if (ratio < 0.8) {
        for (c10 of match10) {
            c10[0].style.left = `${c10[1].x + 10}%`
        }
        match10[0][0].style.left = `${match10[0][1].x - 10}%`
    }

    if (ratio < 0.9) {
        for (c10 of match10) {
            c10[0].style.left = `${c10[1].x + 5}%`
        }
        match21[0][0].style.top = `${match21[0][1].y + 7.5}%`
        match21[1][0].style.top = `${match21[1][1].y + 12.5}%`
    }

    if (ratio < 1) {
        for (c21 of match21) {
            c21[0].style.top = `${c21[1].y + 10}%`
        }
    }

    if (ratio >= 1 && ratio <= 1.7) {
        for (c10 of match10) {
            c10[0].style.left = `${c10[1].x}%`
        }
        for (c21 of match21) {
            c21[0].style.top = `${c21[1].y}%`
        }
    }

    if (ratio > 1.7) {
        for (c10 of match10) {
            c10[0].style.left = `${c10[1].x - 5}%`
        }
        match10[0][0].style.left = `${match10[0][1].x + 5}%`
        for (c21 of match21) {
            c21[0].style.top = `${c21[1].y - 5}%`
        }
    }

    if (ratio > 2) {
        for (c21 of match21) {
            c21[0].style.top = `${c21[1].y - 10}%`
        }
    }

    if (ratio > 2.3) {
        for (c21 of match21) {
            c21[0].style.top = `${c21[1].y - 15}%`
        }
    }

    if (ratio > 2.6) {
        for (c21 of match21) {
            c21[0].style.top = `${c21[1].y - 20}%`
        }
    }

    if (ratio < 1.2) {
        for (c21 of match21) {
            c21[0].style.top = `${c21[1].y + 5}%`
        }
    }
}
replaceCircles()

window.addEventListener('resize', replaceCircles)