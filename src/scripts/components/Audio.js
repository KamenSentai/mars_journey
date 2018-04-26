export default class Audio
{
    constructor()
    {
        this.play()
    }

    play()
    {
        const $sound = new Howl(
        {
            src: ['assets/audios/travel.mp3'],
            autoplay: true,
            loop: true,
            volume: 0.08,
            orientation: [-1, -1, -1],
        })

        const $motor = new Howl(
        {
            src: ['assets/audios/vroum.mp3'],
            autoplay: true,
            loop: true,
            volume: 0.09,
            orientation: [-1, -1, -1],
        })

        const $people = new Howl(
        {
            src: ['assets/audios/people.m4a'],
            autoplay: true,
            loop: true,
            volume: 0.8,
        })

        const $radio = new Howl(
        {
            src: ['assets/audios/radio.mp3'],
            autoplay: true,
            loop: true,
            volume: 1,
            orientation: [0, 0, 0],
        })

        let x = -100,
            y = 0,
            z = -20,
            a = 100,
            b = 0,
            c = 40,
            z2 = 10

        const music = () =>
        {
            window.requestAnimationFrame(music)
            // Radio and people sound switching side
            if (a > -100 && x < 100)
            {
                $people.pos(x, y, z)
                x += 0.5
                $radio.pos(a, b, c)
                a -= 0.5
            }
            else if (a == -100 && x == 100)
            {
                a = 100
                x = -100
            }
            // Motor going behind us
            if (z2 > -2)
            {
                z2 -= 0.01
                $motor.pos(0, 0, z2)
            }
        }
        music()
    }
}