import Circle from './Circle'
import { cursor } from '../main'

export default class Slider
{
  constructor()
  {
    this.build()
  }

  build()
  {
    // Slider elements
    const $slider       = document.querySelector('.slider')
    const $slides       = Array.from($slider.querySelectorAll('.slide'))
    const $frame        = document.querySelector('.frame')
    const $title        = $frame.querySelector('.title')
    const $titleChapter = $frame.querySelector('.title-chapter')
    const $textChapter  = $frame.querySelector('.text-chapter')
    const $circles      = document.querySelector('.circles')
    const $dots         = document.querySelector('.dots')

    const dots      = new Array()
    let isScrolling = false
    let isScrolled  = false
    let isClicked   = false
    let isPositive  = true
    let deltaScroll = 0
    let row = 0
    let col = 0
    let move
    let blocs

    // Responsive
    const isFirefox = (/Firefox/i.test(navigator.userAgent))
    const mouseWheelEvent = !isFirefox ? 'mousewheel' : 'DOMMouseScroll'

    // Create indicator when a slide has multple blocs
    const indicateScroll = () =>
    {
      for (const $slide of $slides)
      {
        const $blocs = Array.from($slide.querySelectorAll('.bloc'))
        if ($blocs.length > 1)
        {
          for (const $bloc of $blocs)
          {
            const $scroll  = document.createElement('span')
            const $barTop  = document.createElement('div')
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
    const createDots = () =>
    {
      for (let index = 0; index < $slides.length; index++)
      {
        const $dot = document.createElement('div')
        $dot.classList.add('dot')
        $dot.dataset.index = index
        $dots.appendChild($dot)
        dots.push($dot)
      }

      // Set active dot
      const $activeSlide = $slides.find($slide => $slide.classList.contains('active'))
      const indexActive  = $slides.indexOf($activeSlide)
      const $activeDot   = Array.from($dots.querySelectorAll('.dot')).find($dot => $dot.dataset.index == indexActive)
      $activeDot.classList.add('active')
    }
    createDots()

    // Change slide on mousewheel
    window.addEventListener(mouseWheelEvent, (event) =>
    {
      // Update scrolling
      if (!isFirefox)
      {
        if ((event.deltaY >= 0) != isPositive)
        {
          isPositive = !isPositive
          deltaScroll = 0
        }
        deltaScroll += event.deltaY
      } else if ((event.detail >= 0) != isPositive)
      {
        isPositive = !isPositive
        deltaScroll = 0
      }
      deltaScroll += event.detail

      // Prevent multiple scroll
      if (!isScrolled && !isClicked)
      {
        // Get active slide
        const $activeSlide = $slides.find($slide => $slide.classList.contains('active'))
        const $blocs = Array.from($activeSlide.querySelectorAll('.bloc'))
        const $activeBloc = $blocs[row]
        blocs = $blocs.length

        // Scroll down
        if (deltaScroll > 0)
        {
          // Below bloc
          if (row < blocs - 1)
            slideDown($activeSlide, $activeBloc)

          // Right slide
          else if (row == blocs - 1)
            slideRight($activeSlide, $activeBloc)
        }

        // Scoll up
        else if (deltaScroll < 0)
        {
          // Uppon bloc
          if (row > 0)
            slideUp($activeSlide, $activeBloc)

          // Left slide
          else if (row == 0)
            slideLeft($activeSlide, $activeBloc)
        }

        updateSlide()

        isScrolled = true
        setTimeout(() =>
        {
          isScrolled = false
        }, 1500)
      }
    })

    // Change slide on keypress
    window.addEventListener('keydown', (event) =>
    {
      // Prevent multiple simultaneous scroll
      if (!isScrolling && !isClicked && (event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40))
      {
        const $activeSlide = $slides.find($slide => $slide.classList.contains('active'))
        const $blocs       = Array.from($activeSlide.querySelectorAll('.bloc'))
        const $activeBloc  = $blocs[row]
        blocs = $blocs.length
        if (event.keyCode == 37 || event.keyCode == 38)
        {
          isScrolling = true
          if (row == 0)
            slideLeft($activeSlide, $activeBloc)
          else
            slideUp($activeSlide, $activeBloc)
        }
        if (event.keyCode == 39 ||  event.keyCode == 40)
        {
          isScrolling = true
          if (row == blocs - 1)
            slideRight($activeSlide, $activeBloc)
          else
            slideDown($activeSlide, $activeBloc)
        }
        updateSlide()

        // Resset slide change permission
        setTimeout(() =>
        {
          isScrolling = false
        }, 1500)
      }
    })

    // Slide to the top
    const slideUp = (currentSlide, currentBloc) =>
    {
      currentSlide.style.transform = `translateY(-${--row * window.innerHeight}px)`
      currentBloc.classList.remove('active')
      Array.from(currentSlide.querySelectorAll('.bloc'))[row].classList.add('active')
      move = 'up'
    }

    // Slide to the down
    const slideDown = (currentSlide, currentBloc) =>
    {
      currentSlide.style.transform = `translateY(-${++row * 100}%)`
      currentBloc.classList.remove('active')
      Array.from(currentSlide.querySelectorAll('.bloc'))[row].classList.add('active')
      move = 'down'
    }

    // Slide to the left
    const slideLeft = (currentSlide, currentBloc) =>
    {
      // Not first slide
      if (col > 0)
      {
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
    const slideRight = (currentSlide, currentBloc) =>
    {
      // Not last slide
      if (col < $slides.length - 1)
      {
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
    const reduceString = (string) =>
    {
      return string.substring(0, string.length - 1)
    }

    const eraseString = (element, rewrite, string, speed) =>
    {
      element.textContent = ''
      element.style.opacity = '0'
      if (rewrite)
      {
        writeString(element, string, 0, speed * 2, false)
      }
    }

    // Write a string
    const writeString = (element, string, index, speed, immediateErase) =>
    {
      const content = element.textContent
      element.style.opacity = '1'
      if (content.length < string.length && !immediateErase)
      {
        setTimeout(() =>
        {
          if (string[index] != undefined)
          {
            element.textContent += string[index]
            index++
            writeString(element, string, index, speed, immediateErase)
          }
        }, speed)
      }
    }

    // Update elements
    const updateCircles = () =>
    {
      for (const circleObject of circlesObjects)
      {
        if (circleObject.r == row && circleObject.c == col)
          circleObject.display()
        else
          circleObject.hide()
      }
    }

    const updateSlide = () =>
    {
      updateCircles()

      // Exit slide 1
      if (row == 0 && col == 1 && move == 'right')
      {
        $title.classList.add('hidden')
        setTimeout(() =>
        {
          writeString($titleChapter, titlesChapters[0], 0, 50, false)
          $textChapter.textContent = textsChapters[0][0]
        }, 500)
      }

      // Enter slide 1
      else if (row == 0 && col == 0 && move == 'left')
      {
        $title.classList.remove('hidden')
        eraseString($titleChapter, false, '', 0)
        $textChapter.textContent = ''
      }
      else if (move == 'left' ||  move == 'right')
      {
        eraseString($titleChapter, true, titlesChapters[col - 1], 25)
        $textChapter.textContent = textsChapters[col - 1][row]
      }
      else if
      (
        move == 'up' ||
        (move == 'down' && col != $slides.length - 1 && row != blocs - 1) ||
        (move == 'down' && $textChapter.textContent != textsChapters[textsChapters.length - 1][textsChapters[textsChapters.length - 1].length - 1])
      )
      {
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
    const initCircles = () =>
    {
      for (const circleObject of circlesObjects)
      {
        circleObject.create()
        circleObject.hide()
      }
      c00_1.display()
      c00_2.display()
    }
    initCircles()

    // Update when arrive to destination
    const slideDestination = (destination) =>
    {
      if (destination != 0)
      {
        $titleChapter.style.opacity = '1'
        eraseString($titleChapter, true, titlesChapters[destination - 1], 25)
        $textChapter.textContent = textsChapters[destination - 1][0]
      }
      else
      {
        $title.classList.remove('hidden')
        eraseString($titleChapter, false, '', 0)
        $textChapter.textContent = ''
      }
      for (const slide of $slides)
      {
        slide.style.transitionDuration = '0.75s'
      }
      setTimeout(() =>
      {
        isClicked = false
      }, 500)
    }

    // Slide to aside
    const slideNext = (current, destination) =>
    {
      if (current < destination)
      {
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

        setTimeout(() =>
        {
          slideNext(current, destination)
        }, 375)
      }
      else
      {
        slideDestination(destination)
        updateCircles()
      }
    }

    // Slide to aside
    const slidePrevious = (current, destination) =>
    {
      if (current > destination)
      {
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

        setTimeout(() =>
        {
          slidePrevious(current, destination)
        }, 375)
      }
      else
      {
        slideDestination(destination)
        updateCircles()
      }
    }

    // Listen on dots events
    for (const $dot of dots)
    {
      // Listen on click
      $dot.addEventListener('click', () =>
      {
        const $activeDot = dots.find(dot => dot.classList.contains('active'))
        if ($activeDot != $dot && !isClicked)
        {
          if ($dot != dots[0])
          {
            $title.classList.add('hidden')
          }
          $titleChapter.style.opacity = '0'
          $titleChapter.textContent   = ''
          $textChapter.textContent    = ''
          for (const circleObject of circlesObjects)
          {
            circleObject.hide()
          }
          isClicked = true
          if (col < dots.indexOf($dot))
          {
            for (const slide of $slides)
            {
              slide.style.transitionDuration = '0.125s'
              if (!slide.classList.contains('active'))
              {
                slide.style.transform = 'translateX(100%)'
              }
            }
            slideNext(col, dots.indexOf($dot))
            col = dots.indexOf($dot)
            move = 'right'
          }
          else
          {
            $textChapter.textContent = ''
            for (const slide of $slides)
            {
              slide.style.transitionDuration = '0.125s'
              if (!slide.classList.contains('active'))
              {
                slide.style.transform = 'translateX(-100%)'
              }
            }
            slidePrevious(col, dots.indexOf($dot))
            col = dots.indexOf($dot)
            move = 'left'
          }
        }
      })

      if (!Modernizr.touchevents)
      {
        // Listen on hover
        $dot.addEventListener('mouseenter', () =>
        {
          cursor.isMouseDown = true
        })
        $dot.addEventListener('mouseout', () =>
        {
          cursor.isMouseDown = false
        })
      }
      else
      {
        $dot.addEventListener('touchstart', () =>
        {
          cursor.isMouseDown = true
        })
        $dot.addEventListener('touchend', () =>
        {
          cursor.isMouseDown = false
        })
      }
    }

    // Replace circles if no match with the background
    const windowSize =
    {
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

    const replaceCircles = () =>
    {
      windowSize.x = window.innerWidth
      windowSize.y = window.innerHeight
      const ratio = windowSize.x / windowSize.y

      if (ratio < 0.8)
      {
        for (const c10 of match10)
          c10[0].style.left = `${c10[1].x + 10}%`
        match10[0][0].style.left = `${match10[0][1].x - 10}%`
      }

      if (ratio < 0.9)
      {
        for (const c10 of match10)
          c10[0].style.left = `${c10[1].x + 5}%`
        match21[0][0].style.top = `${match21[0][1].y + 7.5}%`
        match21[1][0].style.top = `${match21[1][1].y + 12.5}%`
      }

      if (ratio < 1)
      {
        for (const c21 of match21)
          c21[0].style.top = `${c21[1].y + 10}%`
      }

      if (ratio >= 1 && ratio <= 1.7)
      {
        for (const c10 of match10)
          c10[0].style.left = `${c10[1].x}%`
        for (const c21 of match21)
          c21[0].style.top = `${c21[1].y}%`
      }

      if (ratio > 1.7)
      {
        for (const c10 of match10)
          c10[0].style.left = `${c10[1].x - 5}%`
        match10[0][0].style.left = `${match10[0][1].x + 5}%`
        for (const c21 of match21)
          c21[0].style.top = `${c21[1].y - 5}%`
      }

      if (ratio > 2)
      {
        for (const c21 of match21)
          c21[0].style.top = `${c21[1].y - 10}%`
      }

      if (ratio > 2.3)
      {
        for (const c21 of match21)
          c21[0].style.top = `${c21[1].y - 15}%`
      }

      if (ratio > 2.6)
      {
        for (const c21 of match21)
          c21[0].style.top = `${c21[1].y - 20}%`
      }

      if (ratio < 1.2)
      {
        for (const c21 of match21)
          c21[0].style.top = `${c21[1].y + 5}%`
      }
    }
    replaceCircles()

    window.addEventListener('resize', replaceCircles)
  }
}
