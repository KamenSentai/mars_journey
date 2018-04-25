/* ---------------------------------------------------------------------------------------------------- *\

************************ VARIABLES

\* ---------------------------------------------------------------------------------------------------- */

// Loading
const $loadingPage = document.querySelector('.loadingPage')

// Frame elements
const $frame = document.querySelector('.frame')
const $hours = $frame.querySelector('.hours')
const $minutes = $frame.querySelector('.minutes')
const $seconds = $frame.querySelector('.seconds')
const $posA = $frame.querySelector('.pos-a')
const $posO = $frame.querySelector('.pos-o')

let posA = 48.856614
let posO = 2.287592

// Slider elements
const $slider = document.querySelector('.slider')
const $slides = Array.from($slider.querySelectorAll('.slide'))
const $title = $frame.querySelector('.title')
const $titleChapter = $frame.querySelector('.title-chapter')
const $textChapter = $frame.querySelector('.text-chapter')
const $circles = document.querySelector('.circles')
const $dots = document.querySelector('.dots')
const $audio = document.querySelector('audio.tick')

const dots = new Array()
let isScrolling = false
let isCircle = false
let isScrolled = false
let isClicked = false
let isPositive = true
let deltaScroll = 0
let row = 0
let col = 0
let move
let blocs

// Parallax element
const $parallax = document.querySelectorAll('.parallax')

// Responsive
const isFirefox = (/Firefox/i.test(navigator.userAgent))
const mouseWheelEvent = !isFirefox ? 'mousewheel' : 'DOMMouseScroll'

/* ---------------------------------------------------------------------------------------------------- *\

************************ LOADING PAGE

\* ---------------------------------------------------------------------------------------------------- */

let animData = {
    container: document.getElementById('bodymovin'),
    renderer: 'svg',
    loop: false,
    prerender: false,
    autoplay: true,
    autoloadSegments: false,
    path: 'assets/lottie/v1.json'
}
let anim = bodymovin.loadAnimation(animData)

const hideLoader = () => {
    $loadingPage.style.top = '-100%'
}

setTimeout(hideLoader, 5000)

/* ---------------------------------------------------------------------------------------------------- *\

************************ AUDIO

\* ---------------------------------------------------------------------------------------------------- */

let $sound = new Howl({
    src: ['assets/audios/travel.mp3'],
    autoplay: true,
    loop: true,
    volume: 0.08,
    orientation: [-1, -1, -1],
});

let $motor = new Howl({
    src: ['assets/audios/vroum.mp3'],
    autoplay: true,
    loop: true,
    volume: 0.09,
    orientation: [-1, -1, -1],
});

let z2 = 10

let $people = new Howl({
    src: ['assets/audios/people.m4a'],
    autoplay: true,
    loop: true,
    volume: 0.8,
});

let $radio = new Howl({
    src: ['assets/audios/radio.mp3'],
    autoplay: true,
    loop: true,
    volume: 1,
    orientation: [0, 0, 0],
});

let x = -100,
    y = 0,
    z = -20

let a = 100,
    b = 0,
    c = 40

const music = () => {
    window.requestAnimationFrame(music)
    // Radio and people sound switching side
    if (a > -100 && x < 100) {
        $people.pos(x, y, z)
        x += 0.5
        $radio.pos(a, b, c)
        a -= 0.5
    } else if (a == -100 && x == 100) {
        a = 100
        x = -100
    }
    // Motor going behind us
    if (z2 > -2) {
        z2 -= 0.01
        $motor.pos(0, 0, z2)
    }
}
music()

/* ---------------------------------------------------------------------------------------------------- *\

************************* FRAME

\* ---------------------------------------------------------------------------------------------------- */

// Update time
setInterval(() => {
    const date = new Date()
    $hours.textContent = `${date.getHours() > 9 ? '' : 0}${date.getHours()}`
    $minutes.textContent = `${date.getMinutes() > 9 ? '' : 0}${date.getMinutes()}`
    $seconds.textContent = `${date.getSeconds() > 9 ? '' : 0}${date.getSeconds()}`
}, 1000)

// Update position
setInterval(() => {
    $posA.textContent = posA.toPrecision(7)
    $posO.textContent = posO.toPrecision(6)
}, 100)

window.addEventListener('mousemove', (event) => {
    posA += (event.clientX - window.innerWidth / 2) / 100000
    posO += (event.clientY - window.innerHeight / 2) / 100000
})

/* ---------------------------------------------------------------------------------------------------- *\

************************* CIRCLE

\* ---------------------------------------------------------------------------------------------------- */

class Circle {
    constructor(x, y, c, r, t) {
        this.x = x
        this.y = y
        this.c = c
        this.r = r
        this.t = t
    }
    create() {
        // Set circle
        const $circle = document.createElement('div')
        $circle.classList.add('circle')
        $circle.classList.add(`pos-${this.x}-${this.y}`)
        $circle.classList.add(`slide-${this.c}-${this.r}`)
        $circle.style.left = `${this.x}%`
        $circle.style.top = `${this.y}%`

        // Set components
        const $stick_1 = document.createElement('div')
        const $stick_2 = document.createElement('div')
        const $text = document.createElement('p')
        $stick_1.classList.add('stick-1')
        $stick_2.classList.add('stick-2')
        $text.classList.add('text')
        $text.textContent = this.t

        if (this.x > 50) {
            $circle.classList.add('return')
            $text.style.transformOrigin = '50% 50%'
            $text.style.transform = 'rotateZ(180deg)'
            $text.style.direction = 'rtl'
        }

        // Add circle
        $stick_2.appendChild($text)
        $stick_1.appendChild($stick_2)
        $circle.appendChild($stick_1)
        $circles.appendChild($circle)

        // Move
        const posX = $circle.offsetLeft + $circle.offsetWidth / 2
        const posY = $circle.offsetTop + $circle.offsetHeight / 2
        const posCircle = {
            x: posX,
            y: posY
        }

        const moveCircle = (event) => {
            if ($circle.classList.contains('shown')) {
                const deltaX = event.clientX - posX
                const deltaY = event.clientY - posY
                if (
                    Math.abs(deltaX) <= $circle.offsetWidth * 2.5 &&
                    Math.abs(deltaY) <= $circle.offsetHeight * 2.5
                ) {
                    $circle.style.transform = `scale(1.25) translate(${deltaX * 0.125}px, ${deltaY * 0.125}px) rotateZ(${!$circle.classList.contains('return') ? 0 : 180}deg)`
                } else {
                    $circle.style.transform = `scale(1) translate(0) rotateZ(${!$circle.classList.contains('return') ? 0 : 180}deg)`
                }
            }
        }

        const usermove = !Modernizr.touchevents ? 'mousemove' : 'touchmove'
        const userenter = !Modernizr.touchevents ? 'mouseenter' : 'touchstart'
        const userout = !Modernizr.touchevents ? 'mouseout' : 'touchend'

        window.addEventListener(usermove, (event) => {
            moveCircle(event)
        })
        // Play Audio
        $circle.addEventListener(userenter, () => {
            isMouseDown = true
            $audio.play()
            $audio.volume = 0.1

            // Hide other circles
            for (const otherCircle of Array.from($circles.querySelectorAll('.circle'))) {
                if (otherCircle.classList.contains('shown') && otherCircle != $circle) {
                    otherCircle.style.opacity = '0.125'
                }
            }
        })
        $circle.addEventListener(userout, () => {
            isMouseDown = false

            // Show other circles
            for (const otherCircle of Array.from($circles.querySelectorAll('.circle'))) {
                if (otherCircle.classList.contains('shown') && otherCircle != $circle) {
                    otherCircle.style.opacity = '1'
                }
            }
        })
    }

    display() {
        // Display circle
        const $circle = document.querySelector(`.pos-${this.x}-${this.y}.slide-${this.c}-${this.r}`)
        $circle.classList.add('shown')
        $circle.style.transform = `scale(1) translate(0) rotateZ(${!$circle.classList.contains('return') ? 0 : 180}deg)`
    }
    hide() {
        // Hide circle
        const $circle = document.querySelector(`.pos-${this.x}-${this.y}.slide-${this.c}-${this.r}`)
        $circle.classList.remove('shown')
        $circle.style.transform = `scale(0) translate(0) rotateZ(${!$circle.classList.contains('return') ? 0 : 180}deg)`
    }
}

/* ---------------------------------------------------------------------------------------------------- *\

************************* SLIDER

\* ---------------------------------------------------------------------------------------------------- */

// Create indicator when a slide has multple blocs
const indicateScroll = () => {
    for ($slide of $slides) {
        const $blocs = Array.from($slide.querySelectorAll('.bloc'))
        if ($blocs.length > 1) {
            for ($bloc of $blocs) {
                const $scroll = document.createElement('span')
                const $barTop = document.createElement('div')
                const $barDown = document.createElement('div')

                $scroll.classList.add('scroll')
                $barTop.classList.add('top')
                $barDown.classList.add('down')
                $scroll.textContent = 'Scroll'

                $scroll.appendChild($barTop)
                $scroll.appendChild($barDown)
                $bloc.appendChild($scroll)
            }
        }
    }
}
indicateScroll()

// Create dots
const createDots = () => {
    for (let index = 0; index < $slides.length; index++) {
        const $dot = document.createElement('div')
        $dot.classList.add('dot')
        $dot.dataset.index = index
        $dots.appendChild($dot)
        dots.push($dot)
    }

    // Set active dot
    const $activeSlide = $slides.find($slide => $slide.classList.contains('active'))
    const indexActive = $slides.indexOf($activeSlide)
    const $activeDot = Array.from($dots.querySelectorAll('.dot')).find($dot => $dot.dataset.index == indexActive)
    $activeDot.classList.add('active')
}
createDots()

// Change slide on mousewheel
window.addEventListener(mouseWheelEvent, (event) => {
    // Update scrolling
    if (!isFirefox) {
        if ((event.deltaY >= 0) != isPositive) {
            isPositive = !isPositive
            deltaScroll = 0
        }
        deltaScroll += event.deltaY
    } else if ((event.detail >= 0) != isPositive) {
        isPositive = !isPositive
        deltaScroll = 0
    }
    deltaScroll += event.detail

    // Prevent multiple scroll
    if (!isScrolled && !isClicked) {
        // Get active slide
        const $activeSlide = $slides.find($slide => $slide.classList.contains('active'))
        const $blocs = Array.from($activeSlide.querySelectorAll('.bloc'))
        const $activeBloc = $blocs[row]
        blocs = $blocs.length

        // Scroll down
        if (deltaScroll > 0) {
            // Below bloc
            if (row < blocs - 1) {
                slideDown($activeSlide, $activeBloc)
            }

            // Right slide
            else if (row == blocs - 1) {
                slideRight($activeSlide, $activeBloc)
            }
        }

        // Scoll up
        else if (deltaScroll < 0) {
            // Uppon bloc
            if (row > 0) {
                slideUp($activeSlide, $activeBloc)
            }

            // Left slide
            else if (row == 0) {
                slideLeft($activeSlide, $activeBloc)
            }
        }

        updateSlide()

        isScrolled = true
        setTimeout(() => {
            isScrolled = false
        }, 1500)
    }
})

// Change slide on keypress
window.addEventListener('keydown', (event) => {
    // Prevent multiple simultaneous scroll
    if (!isScrolling && !isClicked) {
        const $activeSlide = $slides.find($slide => $slide.classList.contains('active'))
        const $blocs = Array.from($activeSlide.querySelectorAll('.bloc'))
        const $activeBloc = $blocs[row]
        blocs = $blocs.length
        if (event.keyCode == 37 || event.keyCode == 38) {
            isScrolling = true
            if (row == 0) {
                slideLeft($activeSlide, $activeBloc)
            } else {
                slideUp($activeSlide, $activeBloc)
            }
        }
        if (event.keyCode == 39 ||  event.keyCode == 40) {
            isScrolling = true
            if (row == blocs - 1) {
                slideRight($activeSlide, $activeBloc)
            } else {
                slideDown($activeSlide, $activeBloc)
            }
        }
        updateSlide()

        // Resset slide change permission
        setTimeout(() => {
            isScrolling = false
        }, 1500)
    }
})

// Slide to the top
const slideUp = (currentSlide, currentBloc) => {
    currentSlide.style.transform = `translateY(-${--row * window.innerHeight}px)`
    currentBloc.classList.remove('active')
    Array.from(currentSlide.querySelectorAll('.bloc'))[row].classList.add('active')
    move = 'up'
}

// Slide to the down
const slideDown = (currentSlide, currentBloc) => {
    currentSlide.style.transform = `translateY(-${++row * 100}%)`
    currentBloc.classList.remove('active')
    Array.from(currentSlide.querySelectorAll('.bloc'))[row].classList.add('active')
    move = 'down'
}

// Slide to the left
const slideLeft = (currentSlide, currentBloc) => {
    // Not first slide
    if (col > 0) {
        col--
        row = Array.from($slides[col].querySelectorAll('.bloc')).length - 1
        currentSlide.classList.remove('active')
        currentSlide.style.transform = `translateX(100%)`
        $slides[col].classList.add('active')
        $slides[col].style.transform = `translateX(0%) translateY(-${row * 100}%)`
        currentBloc.classList.remove('active')
        Array.from($slides[col].querySelectorAll('.bloc'))[row].classList.add('active')
        move = 'left'

        // Update dots
        dots[col + 1].classList.remove('active')
        dots[col].classList.add('active')
    }
}

// Slide to the right
const slideRight = (currentSlide, currentBloc) => {
    // Not last slide
    if (col < $slides.length - 1) {
        col++
        currentSlide.classList.remove('active')
        currentSlide.style.transform = `translateX(-100%) translateY(-${row * 100}%)`
        $slides[col].classList.add('active')
        $slides[col].style.transform = `translateX(0%)`
        row = 0
        currentBloc.classList.remove('active')
        Array.from($slides[col].querySelectorAll('.bloc'))[row].classList.add('active')
        move = 'right'

        // Update dots
        dots[col - 1].classList.remove('active')
        dots[col].classList.add('active')
    }
}

// Delete last character of a string
const reduceString = (string) => {
    return string.substring(0, string.length - 1)
}

const eraseString = (element, rewrite, string, speed) => {
    element.textContent = ''
    element.style.opacity = '0'
    if (rewrite) {
        writeString(element, string, 0, speed * 2, false)
    }
}

// Write a string
const writeString = (element, string, index, speed, immediateErase) => {
    const content = element.textContent
    element.style.opacity = '1'
    if (content.length < string.length && (!immediateErase || isCircle)) {
        setTimeout(() => {
            if (string[index] != undefined) {
                element.textContent += string[index]
                index++
                writeString(element, string, index, speed, immediateErase)
            }
        }, speed)
    }
}

// Update elements
const updateCircles = () => {
    for (const circleObject of circlesObjects) {
        if (circleObject.r == row && circleObject.c == col) {
            circleObject.display()
        } else {
            circleObject.hide()
        }
    }
}

const updateSlide = () => {
    updateCircles()

    // Exit slide 1
    if (row == 0 && col == 1 && move == 'right') {
        $title.classList.add('hidden')
        setTimeout(() => {
            writeString($titleChapter, titlesChapters[0], 0, 50, false)
            $textChapter.textContent = textsChapters[0][0]
        }, 500)
    }
    // Enter slide 1
    else if (row == 0 && col == 0 && move == 'left') {
        $title.classList.remove('hidden')
        eraseString($titleChapter, false, '', 0)
        $textChapter.textContent = ''
    } else if (move == 'left' ||  move == 'right') {
        eraseString($titleChapter, true, titlesChapters[col - 1], 25)
        $textChapter.textContent = textsChapters[col - 1][row]
    } else if (
        move == 'up' ||
        (move == 'down' && col != $slides.length - 1 && row != blocs - 1) ||
        (move == 'down' && $textChapter.textContent != textsChapters[textsChapters.length - 1][textsChapters[textsChapters.length - 1].length - 1])
    ) {
        $textChapter.textContent = textsChapters[col - 1][row]
    }
}

// Title of each chapter
const titlesChapters = new Array(
    'Take-off',
    'On board',
    'The journey',
    'The risks',
    'Welcome to Mars'
)

// Text of each chapter
const textsChapters = new Array(
    [
        'It\'s time to take off. Let\'s board for 6 months of travel before arriving to the promised land.',
        'For your trip, you will embark on the BFR. The new spaceship of Space X. It replaces the Falcon 9, Falcon Heavy and the Dragon capsule used to refuel the International Space Station.'
    ], [
        'Welcome aboard. This shuttle will be your inhabitant for the next 6 months. It\'s time to learn more about the shuttle.',
        'Your life on board will be completely different from the one you lived on land. Pressurization greather than a A380.'
    ], [
        'You will be free during your days but you must respect the instructions and activity for the good of your body.',
        'The daily physical activity that is mandatory for the station\'s long-duration passengers is done with blood, as are the various bodily needs. For food too, habits are changing.'
    ], [
        'It\'s not without risk of conquering space. That\'s why you\'re forced to be really careful.',
        'Many problems may occure because of the lack of gravity.'
    ], [
        'We have arrived. After 6 months of travel, you will be the first to put your foot on Mars.',
        'Your mission of colonization begins, you will have to carry out the tasks of the role entrusted to you and build a new life and a new population.'
    ]
)

// Create circles
const circlesObjects = new Array()

const t00_1 = 'According to plans unveiled in September 2016, the first flight to Mars would take place in 2024. The project, which would be developed thanks to the profits made by SpaceX and the personal wealth of its founder Elon Musk, will eventually lead to the establishment of a permanent colony on Mars.'
const c00_1 = new Circle(20, 60, 0, 0, t00_1)
circlesObjects.push(c00_1)

const t00_2 = 'Moon and Mars. This single system—one booster and one ship will eventually replace Falcon 9, Falcon Heavy and Dragon.'
const c00_2 = new Circle(80, 70, 0, 0, t00_2)
circlesObjects.push(c00_2)

const t10_1 = 'Methane fuel & Tank'
const c10_1 = new Circle(10, 70, 1, 0, t10_1)
circlesObjects.push(c10_1)

const t10_2 = 'Cabin for up to 100 people and cargo cabin tank'
const c10_2 = new Circle(70, 30, 1, 0, t10_2)
circlesObjects.push(c10_2)

const t10_3 = 'Liquid oxygen Tank for 6 month of Oxygen'
const c10_3 = new Circle(70, 60, 1, 0, t10_3)
circlesObjects.push(c10_3)

const t10_4 = 'Built with 9 Raptor engines'
const c10_4 = new Circle(75, 75, 1, 0, t10_4)
circlesObjects.push(c10_4)

const t20_1 = 'The Earth is a planet of the Solar System, the third closest to the Sun and the fifth largest, both in size and mass, of this planetary system of which it is also the most massive of the Earth.'
const c20_1 = new Circle(15, 50, 2, 0, t20_1)
circlesObjects.push(c20_1)

const t20_2 = 'The International Space Station is a low-Earth orbiting space station, permanently occupied by an international crew dedicated to scientific research in the space environment. This program, launched and piloted by NASA, is being developed jointly with the Russian Federal Space Agency (FKA), with the participation of European, Japanese and Canadian space agencies.'
const c20_2 = new Circle(70, 50, 2, 0, t20_2)
circlesObjects.push(c20_2)

const t21_1 = 'Cabins'
const c21_1 = new Circle(70, 70, 2, 1, t21_1)
circlesObjects.push(c21_1)

const t21_2 = 'Cargo tank'
const c21_2 = new Circle(80, 55, 2, 1, t21_2)
circlesObjects.push(c21_2)

const t21_3 = 'Liquid oxygen Tank'
const c21_3 = new Circle(90, 65, 2, 1, t21_3)
circlesObjects.push(c21_3)

const t30_1 = 'In astronomy, the narrower scientific meaning of a star is that of a plasma celestial body that radiates its own light through nuclear fusion reactions, or bodies that have been in this state at a stage in their life cycle, such as white dwarfs or neutron stars.'
const c30_1 = new Circle(15, 45, 3, 0, t30_1)
circlesObjects.push(c30_1)

const t30_2 = 'Space refers to the areas of the Universe beyond the atmospheres and celestial bodies. This is the almost zero density range that separates the stars. It is also called a space vacuum1. Depending on the designated space locations, it is sometimes referred to as parliamentary, interplanetary, interstellar (or interstellar) and intergalactic space to more precisely designate the space vacuum that is bounded by the Earth-Moon system, planets, stars and galaxies, respectively.'
const c30_2 = new Circle(75, 65, 3, 0, t30_2)
circlesObjects.push(c30_2)

const t50_1 = 'The Martian relief is characterized by craters, resulting from meteorite impacts, volcanoes, faults, dunes and valleys that are very similar to the terrestrial river valleys. These are the main indication of the presence of water on Mars a long time ago.'
const c50_1 = new Circle(25, 55, 5, 0, t50_1)
circlesObjects.push(c50_1)

const t50_2 = 'The soil is red because it contains many iron oxides Martian rocks consist of about three times as much iron as earth rocks.'
const c50_2 = new Circle(80, 45, 5, 0, t50_2)
circlesObjects.push(c50_2)

// Init circles
const initCircles = () => {
    for (const circleObject of circlesObjects) {
        circleObject.create()
        circleObject.hide()
    }
    c00_1.display()
    c00_2.display()
}
initCircles()

// Update when arrive to destination
const slideDestination = (destination) => {
    if (destination != 0) {
        $titleChapter.style.opacity = '1'
        eraseString($titleChapter, true, titlesChapters[destination - 1], 25)
        $textChapter.textContent = textsChapters[destination - 1][0]
    } else {
        $title.classList.remove('hidden')
        eraseString($titleChapter, false, '', 0)
        $textChapter.textContent = ''
    }
    for (const slide of $slides) {
        slide.style.transitionDuration = '0.75s'
    }
    setTimeout(() => {
        isClicked = false
    }, 500)
}

// Slide to aside
const slideNext = (current, destination) => {
    if (current < destination) {
        dots[current].classList.remove('active')
        $slides[current].classList.remove('active')
        $slides[current].style.transform = `translateX(-100%) translateY(-${row * 100}%)`
        Array.from($slides[current].querySelectorAll('.bloc'))[row].classList.remove('active')
        current++
        row = 0
        dots[current].classList.add('active')
        $slides[current].classList.add('active')
        $slides[current].style.transform = `translateX(0%)`
        Array.from($slides[current].querySelectorAll('.bloc'))[row].classList.add('active')

        setTimeout(() => {
            slideNext(current, destination)
        }, 375)
    } else {
        slideDestination(destination)
        updateCircles()
    }
}

// Slide to aside
const slidePrevious = (current, destination) => {
    if (current > destination) {
        dots[current].classList.remove('active')
        $slides[current].classList.remove('active')
        $slides[current].style.transform = `translateX(100%) translateY(-${row * 100}%)`
        Array.from($slides[current].querySelectorAll('.bloc'))[row].classList.remove('active')
        current--
        row = 0
        dots[current].classList.add('active')
        $slides[current].classList.add('active')
        $slides[current].style.transform = `translateX(0%)`
        Array.from($slides[current].querySelectorAll('.bloc'))[row].classList.add('active')

        setTimeout(() => {
            slidePrevious(current, destination)
        }, 375)
    } else {
        slideDestination(destination)
        updateCircles()
    }
}

// Listen on dots events
for (const $dot of dots) {

    // Listen on click
    $dot.addEventListener('click', () => {
        const $activeDot = dots.find(dot => dot.classList.contains('active'))
        if ($activeDot != $dot && !isClicked) {
            if ($dot != dots[0]) {
                $title.classList.add('hidden')
            }
            $titleChapter.style.opacity = '0'
            $titleChapter.textContent = ''
            $textChapter.textContent = ''
            for (const circleObject of circlesObjects) {
                circleObject.hide()
            }
            isClicked = true
            if (col < dots.indexOf($dot)) {
                for (const slide of $slides) {
                    slide.style.transitionDuration = '0.125s'
                    if (!slide.classList.contains('active')) {
                        slide.style.transform = 'translateX(100%)'
                    }
                }
                slideNext(col, dots.indexOf($dot))
                col = dots.indexOf($dot)
                move = 'right'
            } else {
                $textChapter.textContent = ''
                for (const slide of $slides) {
                    slide.style.transitionDuration = '0.125s'
                    if (!slide.classList.contains('active')) {
                        slide.style.transform = 'translateX(-100%)'
                    }
                }
                slidePrevious(col, dots.indexOf($dot))
                col = dots.indexOf($dot)
                move = 'left'
            }
        }
    })

    // Listen on hover
    $dot.addEventListener('mouseenter', () => {
        isMouseDown = true
    })
    $dot.addEventListener('mouseout', () => {
        isMouseDown = false
    })
}

/* ---------------------------------------------------------------------------------------------------- *\

************************ PARALLAX

\* ---------------------------------------------------------------------------------------------------- */

// Get elements
for (const $element of $parallax) {
    $element.parallaxX = 0
    $element.parallaxY = 0
}

const delta = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    posA += (event.clientX / window.innerWidth - 0.5) / 100
    posO += (event.clientY / window.innerHeight - 0.5) / 100

    delta.x = -(event.clientX / window.innerWidth - 0.5)
    delta.y = -(event.clientY / window.innerHeight - 0.5)
})

// Animate parallax
const loop = () => {
    window.requestAnimationFrame(loop)

    for (const $element of $parallax) {
        $element.parallaxX += ((delta.x / $element.dataset.depth * 100) - $element.parallaxX) * 0.1
        $element.parallaxY += ((delta.y / $element.dataset.depth * 100) - $element.parallaxY) * 0.1

        $element.style.transform = `translate(${$element.parallaxX}px, ${$element.parallaxY}px)`
    }
}
loop()

/* ---------------------------------------------------------------------------------------------------- *\

************************ CURSOR (CANVAS)

\* ---------------------------------------------------------------------------------------------------- */

const $canvas = document.querySelector('canvas')
const context = $canvas.getContext('2d')

//Responsive Canvas
const resize = () => {
    $canvas.width = window.innerWidth
    $canvas.height = window.innerHeight
}
window.addEventListener('resize', resize)
resize()

let isMouseDown = false
let subDown = 0
let radius = 30
let width = 0.5
let moving = false
let mouse = {
    x: $canvas.width,
    y: $canvas.height
}

// Listen to events
document.addEventListener('mousedown', () => {
    isMouseDown = true
})

document.addEventListener('mouseup', () => {
    isMouseDown = false
    radius = 30
})

document.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX
    mouse.y = event.clientY

    moving = true
})

const circleCoords = {
    x: mouse.x,
    y: mouse.y
}

// Animate cursor
const loopCanvas = () => {
    window.requestAnimationFrame(loopCanvas)

    if (moving) {
        if (radius < 100) {
            radius += 0.5
        }

        if (width < 1) {
            width += 0.5
        }
    } else {
        if (radius > 30) {
            radius -= 3
        }

        if (width > 1) {
            radius -= 0.1
        }
    }
    moving = false

    if (isMouseDown) {
        subDown += 0.1
        radius = Math.max(15, radius - subDown)
    } else {
        subDown = 0
    }

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