window.addEventListener("load", (event) => {
    clear()
    setTimeout(() => {
        init(event)
    }, 2000);
})
window.addEventListener("yt-navigate-finish", (event) => {
    setTimeout(() => {
        init(event)
    }, 2);
})
window.addEventListener("yt-navigate-start", () => {
    clear()
})
document.addEventListener('fullscreenchange', (event) => {
    if (!document.fullscreenElement) {
        hideComments()
    }
    else {
        if (loadedComments) {
            var divCommentsTop = document.getElementById("divCommentsTop")
            divCommentsTop.style.height = window.innerHeight + "px"
            var divComments = document.getElementById("divComments")
            divComments.style.height = (window.innerHeight * 0.9) + "px"
        }
    }
});
window.addEventListener("keydown", (event) => {
    if (event.key == "AltGraph" && video_id != undefined) {
        if (openedComments) {
            hideComments()
        }
        else {
            showComments(video_id)
        }
    }
    if (openedComments) {
        if (event.key == "]") {
            event.preventDefault()
            divComments.scrollBy(0, window.innerHeight - 50)
        } if (event.key == "[") {
            event.preventDefault()
            divComments.scrollBy(0, -window.innerHeight - 50)
        }
    }
})

var loadedVideoInfo = false
var loadedComments = false
var openedComments = false
var video_id
var title

function clear () {
    try {
        var showButton = document.getElementById("showButton")
        if (showButton != null) {
            showButton.remove();
        }
        var divData = document.getElementById("divData")
        if (divData != null) {
            divData.remove();
        }
        var divComments = document.getElementById("divComments")
        if (divComments != null) {
            divComments.remove();
        }
        var divCommentsTop = document.getElementById("divCommentsTop")
        if (divCommentsTop != null) {
            divCommentsTop.remove();
        }
        loadedVideoInfo = false
        loadedComments = false
        openedComments = false
    } catch (error) {
        console.log("Exceção: $error" + error);
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
                loadedVideoInfo = true
                fetchVideoInfo(video_id)

            } catch (error) {
                console.log("Error trying to createBtn/fetchvideo line 100: " + error)
            }
        }
    }
}

function createBtn (label, video_id) {
    const fullScreenTitleDiv = document.querySelector("#movie_player > div.ytp-chrome-top > div.ytp-title");
    var b1 = document.createElement('button');
    b1.setAttribute("type", "button")
    b1.setAttribute("id", "showButton")
    b1.style.backgroundColor = "rgba(44, 154, 232, 0.8)"
    b1.style.color = "#FFFFFF"
    b1.style.padding = "12px 12px 12px 12px "
    b1.style.margin = "0px 8px 0px 8px "
    b1.style.borderRadius = "8px"
    b1.style.border = "1px red solid"
    b1.textContent = label;
    b1.onclick = () => showComments(video_id);
    fullScreenTitleDiv.append(b1)
}

function showComments (video_id) {
    // console.log("loadedComments: " + loadedComments);
    openedComments = true
    if (loadedComments) {
        var divCommentsTop = document.getElementById("divCommentsTop")
        var divComments = document.getElementById("divComments")
        divCommentsTop.style.opacity = "1"
        divCommentsTop.style.visibility = "visible"

    }
    else {
        fetchComments(video_id);
        loadedComments = true
    }
}

function hideComments () {
    const div = document.getElementById("divCommentsTop")
    div.style.opacity = "0"
    div.style.visibility = "hidden"
    openedComments = false
}

function fetchVideoInfo (video_id) {
    // console.log("updateDate")
    const fullScreenTitleDiv = document.querySelector("#movie_player > div.ytp-chrome-top > div.ytp-title");
    fullScreenTitleDiv.style.display = "block"

    const requestOptions = {
        method: "GET",
        redirect: "follow"
    }

    var url = "https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=" + video_id + "&key=AIzaSyB4Mm0kSd7nsgOVHEh5zAMnYzLKxW8UyIM"

    // console.log(">>>>>" + url)
    fetch(
        url,
        requestOptions
    )
        .then((response) =>
            response.json()
        )
        .then((result) => {

            const date = new Date(result["items"][0]["snippet"]["publishedAt"]);
            const dataFormatada = addZero(date.getDate()) + " de " + addZero(date.toLocaleString('pt-br', { month: 'long' })) + " de " + date.getFullYear();
            title = result["items"][0]["snippet"]["title"];
            channelTitle = result["items"][0]["snippet"]["channelTitle"];

            const data = document.createElement("p")
            data.setAttribute("id", "divData")
            data.style.backgroundColor = "rgba(0, 0, 0, 0.7)"
            data.style.borderRadius = "15px"
            data.style.width = "fit-content"
            data.style.margin = "2px 8px 2px 8px"
            data.style.padding = "6px 12px 6px 12px"
            data.style.borderRadius = "15px"
            data.innerHTML = `<h3>` + channelTitle + `</h3> ` + dataFormatada
            fullScreenTitleDiv.append(data)

            const ytptitle = document.getElementsByClassName("ytp-title-text")[0]
            ytptitle.style.padding = "3px 12px 3px 12px"
            ytptitle.style.margin = "0px 8px 2px 8px"
            ytptitle.style.backgroundColor = "rgba(0,0,0,0.7)"
            ytptitle.style.borderRadius = "15px"

            createBtn('Mostrar Comentários', video_id)
        }
        )
        .catch((error) => console.log("error: ", error))
}


function fetchComments (video_id) {

    const screenHeight = window.innerHeight

    const divCommentsTop = document.createElement("div")
    divCommentsTop.setAttribute("id", "divCommentsTop")
    divCommentsTop.style.position = "absolute"
    divCommentsTop.style.opacity = "1"
    divCommentsTop.style.top = screenHeight / 2.5 + "px"
    divCommentsTop.style.width = "100%"
    divCommentsTop.style.height = screenHeight / 1.5 + "px"
    divCommentsTop.style.zIndex = "2147483646"
    divCommentsTop.style.transition = "1s ease opacity, 2s ease visibility, 2s ease top, 2s ease height"
    divCommentsTop.style.backgroundColor = "rgba(0, 0, 0, 0.3)"

    document.body.append(divCommentsTop)

    const closeDiv = document.createElement("div")
    closeDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)"
    closeDiv.style.width = "100%"

    const titleParagraph = document.createElement("span")
    titleParagraph.style.color = "rgba(255, 255, 255, 0.8)"
    titleParagraph.style.marginLeft = "24px"
    titleParagraph.innerText = title

    const closeButton = document.createElement("Button")
    closeButton.setAttribute("type", "button")
    closeButton.style.visibility = "inherit"
    closeButton.style.padding = "6px 6px 6px 6px"
    closeButton.style.margin = "6px 6px 6px 6px"
    closeButton.style.backgroundColor = "rgba(255, 0, 0, 0.7)"
    closeButton.style.color = "rgb(255, 255, 255)"
    closeButton.textContent = "X Fechar";
    closeButton.onclick = () => hideComments();

    closeDiv.append(closeButton)
    closeDiv.append(titleParagraph)
    divCommentsTop.append(closeDiv)

    const divComments = document.createElement("div")
    divComments.setAttribute("id", "divComments")
    divComments.style.position = "relative"
    divComments.style.visibility = "inherit"
    divComments.style.width = "100%"
    divComments.style.height = "320px"
    divComments.style.overflowY = "scroll"
    divComments.style.zIndex = "2147483647"

    divCommentsTop.append(divComments)

    setTimeout(() => {
        divCommentsTop.style.top = "0px"
        divCommentsTop.style.height = screenHeight + "px"
        divComments.style.height = (screenHeight * 0.9) + "px"
    }, 2000);

    const url =
        "https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=" + video_id + "&key=AIzaSyB4Mm0kSd7nsgOVHEh5zAMnYzLKxW8UyIM";

    try {
        fetch(url).then((commentsResponse) => commentsResponse.json()).then((comments) => {
            for (let index = 0; index < comments["items"].length; index++) {
                const comment = comments["items"][index]["snippet"]["topLevelComment"]["snippet"]["textDisplay"];
                const authorDisplayName = comments["items"][index]["snippet"]["topLevelComment"]["snippet"]["authorDisplayName"];
                const authorProfileImageUrl = comments["items"][index]["snippet"]["topLevelComment"]["snippet"]["authorProfileImageUrl"];

                const publishedAt = new Date(comments["items"][index]["snippet"]["topLevelComment"]["snippet"]["publishedAt"]);
                const publishedAtF = addZero(publishedAt.getDate()) + " de " + addZero(publishedAt.toLocaleString('pt-br', { month: 'long' })) + " de " + publishedAt.getFullYear();

                const para = document.createElement("p");
                para.style.color = "#FFFFFF"
                para.style.visibility = "inherit"
                para.style.width = "fit-content"
                para.style.padding = "6px"
                para.style.margin = "12px"
                para.style.backgroundColor = "rgba(0, 0, 0, 0.6)"
                para.style.borderRadius = "10px 15px 15px 5px"
                para.innerHTML = `
                    <div style="display:flex; flex-direction: column;"> 
                        <div style="display:flex; flex-direction: row; align-items: center";>
                            <div style="padding: 0px 8px 8px 0px">
                                <img src="`+ authorProfileImageUrl + `" width="40px" height="40px" style="vertical-align: middle;border-radius: 50% 40% 10% 40% ;">         
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <div style="color:rgba(255,255,255,0.8)">
                                    <h3>` + publishedAtF + `</h3>
                                </div>
                                <div style="color:rgba(255,255,255,0.95)">
                                    <h3>` + authorDisplayName + `</h3>
                                </div>
                            </div>
                        </div>
                        <div style="color:rgba(255,255,255,0.9); margin-left: 12px">
                            `+ comment + `
                        </div>
                    </div>`;

                divComments.appendChild(para);
            }
        }
        )
        divComments.focus()
        divComments.click()
    } catch (error) {
        console.log(error)
    }
}

function addZero (numero) {
    if (numero <= 9)
        return "0" + numero;
    else
        return numero;
}
