// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle')
const mainMenu = document.getElementById('main-menu')

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true'
    menuToggle.setAttribute('aria-expanded', !isExpanded)
    mainMenu.classList.toggle('active')
  })
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()

    const targetId = this.getAttribute('href')
    if (targetId === '#') return

    const targetElement = document.querySelector(targetId)
    if (targetElement) {
      // Close mobile menu if it's open
      if (mainMenu && mainMenu.classList.contains('active')) {
        mainMenu.classList.remove('active')
        menuToggle.setAttribute('aria-expanded', 'false')
      }

      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  })
})

// Intersection Observer for section animations
const sectionsObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible')
        // Once the section is visible, we don't need to observe it anymore
        sectionsObserver.unobserve(entry.target)
      }
    })
  },
  {
    threshold: 0.2, // When 20% of the section is visible
    rootMargin: '0px 0px -50px 0px' // Trigger a bit earlier
  }
)

// Observe all sections
document.querySelectorAll('.section-container').forEach(section => {
  sectionsObserver.observe(section)
})

// Create pixel art background effect (optional)
function createPixelBackground () {
  const bgElement = document.createElement('div')
  bgElement.classList.add('pixel-bg-effect')
  document.body.appendChild(bgElement)

  for (let i = 0; i < 20; i++) {
    const pixel = document.createElement('div')
    pixel.classList.add('floating-pixel')

    // Random position, size, and animation delay
    pixel.style.left = `${Math.random() * 100}%`
    pixel.style.top = `${Math.random() * 100}%`
    pixel.style.width = `${Math.floor(Math.random() * 10) + 5}px`
    pixel.style.height = pixel.style.width
    pixel.style.animationDelay = `${Math.random() * 5}s`

    bgElement.appendChild(pixel)
  }
}

// Initialize background effect
createPixelBackground()

// Form submission - prevent default and show thank you message
const subscribeForm = document.querySelector('.subscribe-form')
if (subscribeForm) {
  subscribeForm.addEventListener('submit', e => {
    e.preventDefault()

    const formElements = subscribeForm.elements
    const email = formElements.email.value
    const name = formElements.name.value || 'brave warrior'

    const formContainer = subscribeForm.parentElement
    formContainer.innerHTML = `
      <div class="thank-you-message">
        <h3>Thank you, ${name}!</h3>
        <p>Your scroll has been received. We'll send ravens to ${email} with news of our quest.</p>
        <div class="pixel-chest"></div>
      </div>
    `
  })
}

// Handle the subscribe form submission
function initSubscribeForm () {
  const form = document.getElementById('subscribe-form')
  const formResponse = document.getElementById('form-response')

  if (!form) return

  form.addEventListener('submit', function (e) {
    e.preventDefault()

    // Show loading state
    formResponse.innerHTML = '<div class="loading-spinner"></div> Sending...'
    formResponse.className = 'form-response loading'
    formResponse.style.display = 'flex'

    // Collect form data
    const formData = new FormData(form)

    // Send the form data using fetch API
    fetch(form.action, {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
        if (data.success) {
          // Show success message
          formResponse.className = 'form-response success'
          formResponse.textContent = data.message

          // Replace form with thank you message after a delay
          setTimeout(() => {
            const formContainer = form.parentElement
            const name = formData.get('name') || 'brave warrior'
            const email = formData.get('email')

            formContainer.innerHTML = `
            <div class="thank-you-container">
              <h3>Thank you, ${name}!</h3>
              <p>Your scroll has been received. We'll send ravens to ${email} with news of our quest.</p>
              <div class="pixel-chest"></div>
            </div>
          `
          }, 2000)
        } else {
          // Show error message
          formResponse.className = 'form-response error'
          formResponse.textContent =
            data.message || 'Something went wrong. Please try again.'
        }
      })
      .catch(error => {
        console.error('Error:', error)
        formResponse.className = 'form-response error'
        formResponse.textContent =
          'Unable to connect to the server. Please try again later.'
      })
  })
}

// Initialize the subscribe form
initSubscribeForm()

// Update countdown for launch date (set your actual launch date here)
function updateCountdown () {
  // You can change this target date to your actual launch date
  const targetDate = new Date('May 30, 2025 00:00:00').getTime()

  // Find all countdown elements
  const daysElement = document.querySelector('.count.days')
  const hoursElement = document.querySelector('.count.hours')
  const minutesElement = document.querySelector('.count.minutes')
  const secondsElement = document.querySelector('.count.seconds')

  if (!daysElement || !hoursElement || !minutesElement || !secondsElement)
    return

  const updateTimer = () => {
    const now = new Date().getTime()
    const distance = targetDate - now

    if (distance < 0) {
      // If countdown is finished
      daysElement.textContent = '00'
      hoursElement.textContent = '00'
      minutesElement.textContent = '00'
      secondsElement.textContent = '00'

      document.querySelector('.countdown').classList.add('finished')
      document
        .querySelector('.countdown')
        .insertAdjacentHTML(
          'afterend',
          '<p class="launch-message">The quest has begun!</p>'
        )

      clearInterval(timer)
      return
    }

    // Time calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)

    // Add leading zeros for numbers less than 10
    daysElement.textContent = days < 10 ? '0' + days : days
    hoursElement.textContent = hours < 10 ? '0' + hours : hours
    minutesElement.textContent = minutes < 10 ? '0' + minutes : minutes
    secondsElement.textContent = seconds < 10 ? '0' + seconds : seconds

    // Add animation effect on seconds change
    secondsElement.classList.add('pulse')
    setTimeout(() => {
      secondsElement.classList.remove('pulse')
    }, 200)
  }

  // Initial update
  updateTimer()

  // Update countdown every second
  const timer = setInterval(updateTimer, 1000)

  return timer
}

// Run countdown update
updateCountdown()

// Preload images to avoid flashing
function preloadImages () {
  const imageUrls = [
    'public/images/pixel-sword.png',
    'public/images/pixel-scroll.png',
    'public/images/sword-icon.png',
    'public/images/scroll-icon.png',
    'public/images/shield-icon.png',
    'public/images/castle-icon.png',
    'public/images/flashcard-icon.png',
    'public/images/achievement-icon.png',
    'public/images/social-icon.png',
    'public/images/theme-icon.png',
    // Social media icons
    'public/images/Twitter.png',
    'public/images/Instagram.png',
    'public/images/TikTok.png',
    'public/images/Whatsapp.png',
    'public/images/Gmail.png',
    'public/images/Youtube.png'
  ]

  imageUrls.forEach(url => {
    const img = new Image()
    img.src = url
  })
}

// Call preload function
preloadImages()

// Add floating pixel animation styles
const styleElement = document.createElement('style')
styleElement.textContent = `
  .pixel-bg-effect {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
  }
  
  .floating-pixel {
    position: absolute;
    background-color: var(--accent-color);
    opacity: 0.3;
    border-radius: 0;
    animation: floatPixel 15s linear infinite;
  }
  
  @keyframes floatPixel {
    0% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-100px) rotate(180deg);
    }
    100% {
      transform: translateY(0) rotate(360deg);
    }
  }
  
  .thank-you-message {
    text-align: center;
    animation: fadeIn 0.5s ease-in-out;
  }
  
  .pixel-chest {
    width: 64px;
    height: 64px;
    background-image: url('../public/images/treasure-chest.png');
    background-size: contain;
    background-repeat: no-repeat;
    margin: 1rem auto;
    animation: bounce 2s infinite;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  .pulse {
    animation: pulseEffect 0.2s ease-in-out;
  }
  
  @keyframes pulseEffect {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
`

document.head.appendChild(styleElement)

// Add social sharing functionality
function initSocialSharing () {
  // Track sharing events
  const trackShare = platform => {
    console.log(`Shared via ${platform}`) // Replace with actual analytics tracking

    // Show feedback to user
    const feedbackEl = document.createElement('div')
    feedbackEl.className = 'share-feedback'
    feedbackEl.textContent = `Shared via ${platform}!`
    document.body.appendChild(feedbackEl)

    // Remove feedback after animation
    setTimeout(() => {
      feedbackEl.classList.add('fade-out')
      setTimeout(() => {
        document.body.removeChild(feedbackEl)
      }, 500)
    }, 2000)
  }

  // Set up click tracking for share buttons
  document
    .querySelectorAll('.share-button, .footer-share-link')
    .forEach(btn => {
      btn.addEventListener('click', e => {
        // Get platform from class or aria-label
        const classes = btn.classList
        let platform = ''

        if (classes.contains('whatsapp')) platform = 'WhatsApp'
        else if (classes.contains('facebook')) platform = 'Facebook'
        else if (classes.contains('twitter')) platform = 'Twitter'
        else if (classes.contains('email')) platform = 'Email'
        else if (classes.contains('tiktok')) platform = 'TikTok'
        else if (classes.contains('linkedin')) platform = 'LinkedIn'
        else platform = btn.getAttribute('aria-label').replace('Share on ', '')

        // Track the share event (except email which opens client)
        if (!classes.contains('email')) {
          trackShare(platform)
        }
      })
    })

  // Add copy link button
  const addCopyLinkButton = () => {
    const shareContainer = document.querySelector('.share-buttons')
    if (!shareContainer) return

    const copyButton = document.createElement('a')
    copyButton.href = '#'
    copyButton.className = 'share-button copy-link'
    copyButton.setAttribute('aria-label', 'Copy link to clipboard')
    copyButton.innerHTML = `
      <div class="share-icon copy-icon"></div>
      <span>Copy Link</span>
    `

    copyButton.addEventListener('click', e => {
      e.preventDefault()

      // Copy the URL to clipboard
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          // Change button text temporarily
          const span = copyButton.querySelector('span')
          const originalText = span.textContent
          span.textContent = 'Copied!'

          // Add success class
          copyButton.classList.add('copy-success')

          // Reset after 2 seconds
          setTimeout(() => {
            span.textContent = originalText
            copyButton.classList.remove('copy-success')
          }, 2000)

          trackShare('Copy Link')
        })
        .catch(err => {
          console.error('Could not copy text: ', err)

          // Fallback for browsers that don't support clipboard API
          const textArea = document.createElement('textarea')
          textArea.value = window.location.href
          textArea.style.position = 'fixed'
          textArea.style.left = '-999999px'
          textArea.style.top = '-999999px'
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()

          try {
            const successful = document.execCommand('copy')
            const msg = successful ? 'successful' : 'unsuccessful'
            console.log('Fallback: Copying text was ' + msg)

            const span = copyButton.querySelector('span')
            span.textContent = 'Copied!'
            setTimeout(() => {
              span.textContent = originalText
            }, 2000)
          } catch (err) {
            console.error('Fallback: Could not copy text: ', err)
          }

          document.body.removeChild(textArea)
        })
    })

    shareContainer.appendChild(copyButton)
  }

  addCopyLinkButton()

  // Add share button styles
  const shareStyles = document.createElement('style')
  shareStyles.textContent = `
    .share-feedback {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--accent-color);
      color: var(--text-dark);
      font-family: 'Press Start 2P', cursive;
      font-size: 0.8rem;
      padding: 10px 20px;
      border: 3px solid var(--secondary-color);
      z-index: 100;
      pointer-events: none;
      animation: fadeIn 0.5s ease-out;
    }
    
    .share-feedback.fade-out {
      animation: fadeOut 0.5s ease-in;
    }
    
    .copy-icon {
      background-image: url('../public/images/copy-icon.png');
    }
    
    .copy-success {
      background-color: #2a623d !important;
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `
  document.head.appendChild(shareStyles)
}

// Initialize social sharing features
initSocialSharing()

// Add social meta tags for easier sharing
function addDynamicShareMetaTags () {
  // Check if tags already exist
  if (document.querySelector('meta[property="og:url"]')) return

  const head = document.head
  const url = window.location.href

  // Twitter card
  const twitterCard = document.createElement('meta')
  twitterCard.setAttribute('name', 'twitter:card')
  twitterCard.setAttribute('content', 'summary_large_image')
  head.appendChild(twitterCard)

  const twitterTitle = document.createElement('meta')
  twitterTitle.setAttribute('name', 'twitter:title')
  twitterTitle.setAttribute(
    'content',
    'QuizSword - The Ultimate Medieval Quiz Adventure'
  )
  head.appendChild(twitterTitle)

  const twitterDesc = document.createElement('meta')
  twitterDesc.setAttribute('name', 'twitter:description')
  twitterDesc.setAttribute(
    'content',
    'Join me in QuizSword, a pixel art medieval quiz game launching on May 30, 2025!'
  )
  head.appendChild(twitterDesc)

  // WhatsApp preview
  const whatsappTitle = document.createElement('meta')
  whatsappTitle.setAttribute('property', 'og:site_name')
  whatsappTitle.setAttribute('content', 'QuizSword')
  head.appendChild(whatsappTitle)

  // Set canonical URL
  const canonical = document.createElement('link')
  canonical.setAttribute('rel', 'canonical')
  canonical.setAttribute('href', url)
  head.appendChild(canonical)
}

// Add share meta tags
addDynamicShareMetaTags()

// Handle Parallax Effect in the Header with dynamic cloud selection based on time
function initParallaxHeader () {
  const header = document.querySelector('.parallax-header')
  const skyLayer = document.querySelector('.sky-layer')
  const cloudsBackLayer = document.querySelector('.clouds-back-layer')
  const cloudsFrontLayer = document.querySelector('.clouds-front-layer')

  if (!header || !skyLayer || !cloudsBackLayer || !cloudsFrontLayer) return

  // Cloud animation position variables
  let backCloudPos = 0
  let frontCloudPos = 0

  // Determine which cloud set to use based on time or URL parameter
  function determineCloudSet () {
    // Check for URL parameter first
    const urlParams = new URLSearchParams(window.location.search)
    const skyParam = urlParams.get('sky')

    if (skyParam === 'day') {
      return 'Clouds 1'
    } else if (skyParam === 'afternoon') {
      return 'Clouds 2'
    } else if (skyParam === 'night') {
      return 'Clouds 3'
    }

    // If no URL parameter, determine based on current time
    const currentHour = new Date().getHours()

    // Morning (6am-9am) or Evening (7pm-9pm) - Clouds 2
    if (
      (currentHour >= 6 && currentHour <= 9) ||
      (currentHour >= 19 && currentHour <= 21)
    ) {
      return 'Clouds 2'
    }
    // Night (9:01pm-5:59am) - Clouds 3
    else if (currentHour > 21 || currentHour < 6) {
      return 'Clouds 3'
    }
    // Day (Default) - Clouds 1
    else {
      return 'Clouds 1'
    }
  }

  // Set cloud images based on determined set
  const cloudSet = determineCloudSet()
  skyLayer.style.backgroundImage = `url('../public/${cloudSet}/1.png')`
  cloudsBackLayer.style.backgroundImage = `url('../public/${cloudSet}/2.png')`
  cloudsFrontLayer.style.backgroundImage = `url('../public/${cloudSet}/4.png')`

  // Update parallax effect on scroll
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY

    // Apply different scroll speeds to create parallax effect
    skyLayer.style.transform = `translateY(${
      scrollY * 0.1
    }px) translateZ(-600px) scale(3)`
    cloudsBackLayer.style.transform = `translateY(${
      scrollY * 0.3
    }px) translateZ(-300px) scale(2)`
    cloudsFrontLayer.style.transform = `translateY(${
      scrollY * 0.5
    }px) translateZ(-100px) scale(1.5)`
  })

  // Animate clouds with continuous rightward movement
  function animateClouds () {
    // Increment position for infinite rightward movement
    backCloudPos -= 0.2 // Slower speed for back clouds
    frontCloudPos -= 0.5 // Faster speed for front clouds

    // Apply movement to cloud layers - negative values move right
    cloudsBackLayer.style.backgroundPosition = `${backCloudPos}px center`
    cloudsFrontLayer.style.backgroundPosition = `${frontCloudPos}px center`

    requestAnimationFrame(animateClouds)
  }

  animateClouds()

  // Log information about the current cloud set (for debugging)
  console.log(
    `Using ${cloudSet} based on time: ${new Date().getHours()}:${new Date().getMinutes()} or URL parameter`
  )
}

// Initialize parallax header
initParallaxHeader()

// Rock sprite animation control
function initRockAnimation() {
  const rockElement = document.getElementById('animated-rock');
  
  if (!rockElement) return;
  
  // Default animation speed in seconds
  let animationSpeed = 0.8;
  
  // Function to update animation speed
  function updateRockSpeed(speedInSeconds) {
    // Clamp speed between 0.1 (very fast) and 3 (very slow)
    const clampedSpeed = Math.max(0.1, Math.min(3, speedInSeconds));
    rockElement.style.animationDuration = `${clampedSpeed}s`;
    console.log(`Rock animation speed set to ${clampedSpeed}s`);
    return clampedSpeed;
  }
  
  // Check URL parameters for speed control
  function checkSpeedFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const speedParam = urlParams.get('rockSpeed');
    
    if (speedParam && !isNaN(parseFloat(speedParam))) {
      animationSpeed = updateRockSpeed(parseFloat(speedParam));
    }
  }
  
  // Initial setup
  checkSpeedFromURL();
  
  // Add speed control to global window object for easy access from console
  window.rockControls = {
    // Increase speed (lower duration value)
    speedUp: function(factor = 0.8) {
      animationSpeed = updateRockSpeed(animationSpeed * factor);
      return animationSpeed;
    },
    
    // Decrease speed (higher duration value)
    slowDown: function(factor = 1.25) {
      animationSpeed = updateRockSpeed(animationSpeed * factor);
      return animationSpeed;
    },
    
    // Set exact speed
    setSpeed: function(speedInSeconds) {
      animationSpeed = updateRockSpeed(speedInSeconds);
      return animationSpeed;
    },
    
    // Get current speed
    getSpeed: function() {
      return animationSpeed;
    }
  };
}

// Initialize rock animation when page is loaded
initRockAnimation();
