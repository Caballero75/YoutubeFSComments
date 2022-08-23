const thumbsUp = `
<svg width="16" height="16" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="thumbs-up" style="vertical-align:top" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M128 447.1V223.1c0-17.67-14.33-31.1-32-31.1H32c-17.67 0-32 14.33-32 31.1v223.1c0 17.67 14.33 31.1 32 31.1h64C113.7 479.1 128 465.6 128 447.1zM512 224.1c0-26.5-21.48-47.98-48-47.98h-146.5c22.77-37.91 34.52-80.88 34.52-96.02C352 56.52 333.5 32 302.5 32c-63.13 0-26.36 76.15-108.2 141.6L178 186.6C166.2 196.1 160.2 210 160.1 224c-.0234 .0234 0 0 0 0L160 384c0 15.1 7.113 29.33 19.2 38.39l34.14 25.59C241 468.8 274.7 480 309.3 480H368c26.52 0 48-21.47 48-47.98c0-3.635-.4805-7.143-1.246-10.55C434 415.2 448 397.4 448 376c0-9.148-2.697-17.61-7.139-24.88C463.1 347 480 327.5 480 304.1c0-12.5-4.893-23.78-12.72-32.32C492.2 270.1 512 249.5 512 224.1z"></path></svg>
`
var loadedVideoInfo = false
var loadedComments = false
var openedComments = false
var video_id
var title

window.addEventListener('load', (event) => {
  clear()
  setTimeout(() => {
    init(event)
  }, 2000)
})
window.addEventListener('yt-navigate-finish', (event) => {
  setTimeout(() => {
    init(event)
  }, 2000)
})
window.addEventListener('yt-navigate-start', () => {
  clear()
})
document.addEventListener('fullscreenchange', (event) => {
  if (!document.fullscreenElement) {
    hideComments()
  } else {
    toggleTitleAndControls()
    if (loadedComments) {
      var divCommentsTop = document.getElementById(
        'divCommentsTop'
      )
      divCommentsTop.style.height =
        window.innerHeight + 'px'
      var divComments =
        document.getElementById('divComments')
      divComments.style.height =
        window.innerHeight * 0.9 + 'px'
    }
  }
})
window.addEventListener('keydown', (event) => {
  if (event.key == 'AltGraph' && video_id != undefined) {
    if (openedComments) {
      hideComments()
    } else {
      showComments(video_id)
    }
  }
  if (openedComments) {
    if (event.key == ']') {
      event.preventDefault()
      divComments.scrollBy(0, window.innerHeight - 50)
    }
    if (event.key == '[') {
      event.preventDefault()
      divComments.scrollBy(0, -window.innerHeight - 50)
    }
  }
})
window.addEventListener('keyup', (event) => {
  // console.log(event.key);
  if (event.key == '.') {
    toggleTitleAndControls()
  }
  if (event.altKey && event.key == 'x') {
    colapseSuggestion()
  }
})

function clear () {
  try {
    var showButton = document.getElementById('showButton')
    if (showButton != null) {
      showButton.remove()
    }
    var divData = document.getElementById('divData')
    if (divData != null) {
      divData.remove()
    }
    var divComments = document.getElementById('divComments')
    if (divComments != null) {
      divComments.remove()
    }
    var divCommentsTop = document.getElementById(
      'divCommentsTop'
    )
    if (divCommentsTop != null) {
      divCommentsTop.remove()
    }
    loadedVideoInfo = false
    loadedComments = false
    openedComments = false
  } catch (error) {
    console.log('Exceção: $error' + error)
  }
}

function init (event) {
  var isVideo = window.location.href.indexOf('watch?')
  video_id = window.location.search.split('v=')[1]
  // console.log("video_id: " + video_id + "\n loadedVideoInfo: " + loadedVideoInfo);

  if (video_id != undefined && video_id.length > 0) {
    var ampersandPosition = video_id.indexOf('&')
    if (ampersandPosition != -1) {
      video_id = video_id.substring(0, ampersandPosition)
    }
    if (isVideo != -1 && !loadedVideoInfo) {
      try {
        fetchVideoInfo(video_id)
        loadedVideoInfo = true
        setTimeout(() => {
          var dislikeButton = document.querySelector(" ytd-toggle-button-renderer:nth-child(2)")// dislike
          if (dislikeButton != null) {
            dislikeButton.style.display = 'none'
          }
          var shareButton = document.querySelector("#top-level-buttons-computed > ytd-button-renderer:nth-child(3)")
          if (shareButton != null) {
            shareButton.style.display = 'none'
          }
          var dawloadButton = document.querySelector("#top-level-buttons-computed > ytd-download-button-renderer > ytd-button-renderer")
          if (dawloadButton != null) {
            dawloadButton.style.display = 'none'
          }
        }, 5000);

      } catch (error) {
        console.log(
          'Error trying to createBtn/fetchvideo line 100: ' +
          error
        )
      }
    }
    colapseSuggestion()
  }
}

function colapseSuggestion () {
  var el = document.querySelector(
    '.style-scope ytd-watch-next-secondary-results-renderer'
  )
  if (el != null) {
    if (el.style.display == 'none') {
      el.style.display = 'block'
    }
    else el.style.display = 'none'
  }
}

function createBtn (label, video_id) {
  const fullScreenTitleDiv =
    document.querySelector('div.ytp-title')
  var b1 = document.createElement('button')
  b1.setAttribute('type', 'button')
  b1.setAttribute('id', 'showButton')
  b1.style.backgroundColor = 'rgba(44, 154, 232, 0.8)'
  b1.style.color = '#FFFFFF'
  b1.style.padding = '12px 12px 12px 12px '
  b1.style.margin = '0px 8px 0px 8px '
  b1.style.borderRadius = '8px'
  b1.style.border = '1px red solid'
  b1.textContent = label
  b1.onclick = () => showComments(video_id)
  fullScreenTitleDiv.append(b1)
}

function showComments (video_id) {
  // console.log("loadedComments: " + loadedComments);
  openedComments = true
  if (loadedComments) {
    var divCommentsTop = document.getElementById(
      'divCommentsTop'
    )
    // var divComments = document.getElementById("divComments")
    divCommentsTop.style.opacity = '1'
    divCommentsTop.style.visibility = 'visible'
  } else {
    fetchComments(video_id)
    loadedComments = true
  }
}

function hideComments () {
  const div = document.getElementById('divCommentsTop')
  if (div != null) {
    console.log("div: " + div)
    div.style.opacity = '0'
    div.style.visibility = 'hidden'
    openedComments = false
  }
}

function toggleTitleAndControls () {
  let ytpTitle = document.querySelector('.ytp-title')
  ytpTitleVisibility = ytpTitle.style.visibility
  let ytpChromeControls = document.querySelector(
    '.ytp-chrome-controls')
  let ytpProgressBarContainer = document.querySelector(
    '.ytp-progress-bar-container')

  console.log("ytpTimedMarkersContainer :: " + ytpProgressBarContainer.style.visibility);


  ytpTitleVisibility = ytpTitle.style.visibility
  if (
    ytpTitleVisibility == '' ||
    ytpTitleVisibility == 'hidden'
  ) {
    ytpTitle.style.visibility = 'visible'
    ytpChromeControls.style.visibility = 'visible'
    ytpProgressBarContainer.style.visibility = 'visible'
  } else {
    ytpTitle.style.visibility = 'hidden'
    ytpChromeControls.style.visibility = 'hidden'
    ytpProgressBarContainer.style.visibility = 'hidden'
  }
}

function fetchVideoInfo (video_id) {
  // console.log("updateDate")
  const fullScreenTitleDiv = document.querySelector(
    '#movie_player > div.ytp-chrome-top > div.ytp-title'
  )
  fullScreenTitleDiv.style.display = 'block'

  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  }

  var url =
    'https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=' +
    video_id +
    '&key=AIzaSyB4Mm0kSd7nsgOVHEh5zAMnYzLKxW8UyIM'

  // console.log(">>>>>" + url)
  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const date = new Date(
        result['items'][0]['snippet']['publishedAt']
      )
      const dataFormatada =
        addZero(date.getDate()) +
        ' de ' +
        addZero(
          date.toLocaleString('pt-br', { month: 'long' })
        ) +
        ' de ' +
        date.getFullYear()
      title = result['items'][0]['snippet']['title']
      channelTitle =
        result['items'][0]['snippet']['channelTitle']

      const data = document.createElement('p')
      data.setAttribute('id', 'divData')
      data.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
      data.style.borderRadius = '15px'
      data.style.width = 'fit-content'
      data.style.margin = '2px 8px 2px 8px'
      data.style.padding = '6px 12px 6px 12px'
      data.style.borderRadius = '15px'
      data.innerHTML =
        `<h3>` + channelTitle + `</h3> ` + dataFormatada
      fullScreenTitleDiv.append(data)

      const ytptitle = document.getElementsByClassName(
        'ytp-title-text'
      )[0]
      ytptitle.style.padding = '3px 12px 3px 12px'
      ytptitle.style.margin = '0px 8px 2px 8px'
      ytptitle.style.backgroundColor = 'rgba(0,0,0,0.7)'
      ytptitle.style.borderRadius = '15px'

      // createBtn('Mostrar Comentários', video_id)
    })
    .catch((error) => console.log('error: ', error))
}

function fetchComments (video_id) {
  const screenHeight = window.innerHeight

  const divCommentsTop = document.createElement('div')
  divCommentsTop.setAttribute('id', 'divCommentsTop')
  divCommentsTop.style.position = 'absolute'
  divCommentsTop.style.opacity = '1'
  divCommentsTop.style.top = screenHeight / 2.5 + 'px'
  divCommentsTop.style.width = '100%'
  divCommentsTop.style.height = screenHeight / 1.5 + 'px'
  divCommentsTop.style.zIndex = '2147483646'
  divCommentsTop.style.transition =
    '1s ease opacity, 2s ease visibility, 2s ease top, 2s ease height'
  divCommentsTop.style.backgroundColor =
    'rgba(0, 0, 0, 0.3)'

  document.body.append(divCommentsTop)

  const closeDiv = document.createElement('div')
  closeDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
  closeDiv.style.width = '100%'

  const titleParagraph = document.createElement('span')
  titleParagraph.style.color = 'rgba(255, 255, 255, 0.8)'
  titleParagraph.style.marginLeft = '24px'
  titleParagraph.innerText = title

  const closeButton = document.createElement('Button')
  closeButton.setAttribute('type', 'button')
  closeButton.style.visibility = 'inherit'
  closeButton.style.padding = '6px 6px 6px 6px'
  closeButton.style.margin = '6px 6px 6px 6px'
  closeButton.style.backgroundColor = 'rgba(255, 0, 0, 0.7)'
  closeButton.style.color = 'rgb(255, 255, 255)'
  closeButton.textContent = 'X Fechar'
  closeButton.onclick = () => hideComments()

  closeDiv.append(closeButton)
  closeDiv.append(titleParagraph)
  divCommentsTop.append(closeDiv)

  const divComments = document.createElement('div')
  divComments.setAttribute('id', 'divComments')
  divComments.style.position = 'relative'
  divComments.style.visibility = 'inherit'
  divComments.style.width = '100%'
  divComments.style.height = '320px'
  divComments.style.overflowY = 'scroll'
  divComments.style.zIndex = '2147483647'

  divCommentsTop.append(divComments)

  setTimeout(() => {
    divCommentsTop.style.top = '0px'
    divCommentsTop.style.height = screenHeight + 'px'
    divComments.style.height = screenHeight * 0.9 + 'px'
  }, 2000)

  const url =
    'https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=' +
    video_id +
    '&key=AIzaSyB4Mm0kSd7nsgOVHEh5zAMnYzLKxW8UyIM'

  try {
    fetch(url)
      .then((commentsResponse) => commentsResponse.json())
      .then((comments) => {
        console.log(comments);
        for (
          let index = 0;
          index < comments['items'].length;
          index++
        ) {
          const comment =
            comments['items'][index]['snippet'][
            'topLevelComment'
            ]['snippet']['textDisplay']
          const authorDisplayName =
            comments['items'][index]['snippet'][
            'topLevelComment'
            ]['snippet']['authorDisplayName']
          const authorProfileImageUrl =
            comments['items'][index]['snippet'][
            'topLevelComment'
            ]['snippet']['authorProfileImageUrl']
          const publishedAt = new Date(
            comments['items'][index]['snippet'][
            'topLevelComment'
            ]['snippet']['publishedAt']
          )
          const likeCount =
            comments['items'][index]['snippet'][
            'topLevelComment'
            ]['snippet']['likeCount']

          const publishedAtF =
            addZero(publishedAt.getDate()) +
            ' de ' +
            addZero(
              publishedAt.toLocaleString('pt-br', {
                month: 'long'
              })
            ) +
            ' de ' +
            publishedAt.getFullYear()

          const para = document.createElement('p')
          para.style.color = '#FFFFFF'
          para.style.visibility = 'inherit'
          para.style.width = 'fit-content'
          para.style.padding = '12px'
          para.style.margin = '12px'
          para.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'
          para.style.borderRadius = '20px 15px 15px 5px'
          para.innerHTML =
            `
          <div style="display: flex; flex-direction: column">
            <div
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
              "
            >
              <div style="padding: 0px 8px 8px 0px">
                <img
                  src="` +
            authorProfileImageUrl +
            `"
                  width="40px"
                  height="40px"
                  style="
                    vertical-align: middle;
                    border-radius: 48% 40% 10% 40%;
                    border: 5px solid rgba(0, 0, 0, 0.5);
                  "
                />
              </div>
              <div style="display: flex; flex-direction: column">
                <div style="color: rgba(255, 255, 255, 0.8)">
                  <h3>` +
            publishedAtF +
            `</h3>
                </div>
                <div style="color: rgba(255, 255, 255, 0.95)">
                  <h3>` +
            authorDisplayName +
            `</h3>
                </div>
              </div>
            </div>
            <div
              style="
                color: rgba(255, 255, 255, 0.9);
                margin-left: 12px;
              "
            >
            ${ comment }
            </div>
          <div style="margin: 12px">
          ${ likeCount }  ${ thumbsUp }
          </div>
            </div>
          `
          divComments.appendChild(para)
        }
      })
    divComments.focus()
    divComments.click()
  } catch (error) {
    console.log(error)
  }
}

function addZero (numero) {
  if (numero <= 9) return '0' + numero
  else return numero
}
