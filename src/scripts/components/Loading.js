export default class Loading
{
  constructor()
  {
    this.animate()
  }

  animate()
  {
    // Get element
    const $loadingPage = document.querySelector('.loadingPage')

    // Set data
    const animData =
    {
      container: document.getElementById('bodymovin'),
      renderer: 'svg',
      loop: false,
      prerender: false,
      autoplay: true,
      autoloadSegments: false,
      path: 'assets/lottie/v1.json'
    }
    const anim = bodymovin.loadAnimation(animData)

    // Hide loading page
    const hideLoader = () =>
    {
      $loadingPage.style.top = '-100%'
    }
    setTimeout(hideLoader, 5000)
  }
}
