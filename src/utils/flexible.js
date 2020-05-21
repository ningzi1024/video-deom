(function flexible (window, document) {
    let docEl = document.documentElement
    function setRemUnit () {
        let _screenWidth = 1920
        const baseSize = 100;
        const scale = docEl.offsetWidth/_screenWidth
        let rem = baseSize * Math.min(scale, 2)
        docEl.style.fontSize = rem + 'px'
    }
    setRemUnit()
  
    // reset rem unit on page resize
    window.addEventListener('resize', setRemUnit)
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        setRemUnit()
      }
    })
  }(window, document))
  