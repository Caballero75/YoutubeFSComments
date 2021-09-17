window.addEventListener("load", (event) => {
    console.log("load + init(event)")
    setTimeout(() => {
        init(event)
    }, 5000);
})

window.addEventListener("yt-navigate-finish", (event) => {
    console.log(">>> yt-navigate-finish + init(event)<<<")
    setTimeout(() => {
        init(event)
    }, 5000);
})
window.addEventListener("yt-navigate-start", () => {
    console.log(">>> yt-navigate-start <<< + Clear")
    clear()
    // alert(event.type)
})



var loadedVideoInfo = false;
var loadedComments = false;

function clear () {
    try {
        var divComments = document.getElementById("divComments")
        if (divComments != null) {
            divComments.remove();
        }
        var showButton = document.getElementById("showButton")
        if (showButton != null) {
            showButton.remove();
        }
        var divData = document.getElementById("divData")
        if (divData != null) {
            divData.remove();
        }
        loadedVideoInfo = false
        loadedComments = false
    } catch (error) {
        console.log("Exceção: $error" + error);
    }
}

function init (event) {
    var isVideo = window.location.href.indexOf('watch?')
    var video_id = window.location.search.split('v=')[1]
    console.log("video_id: " + video_id + "\n loadedVideoInfo: " + loadedVideoInfo);

    if (video_id != undefined) {
        var ampersandPosition = video_id.indexOf('&')
        if (ampersandPosition != -1) {
            video_id = video_id.substring(0, ampersandPosition)
        }
        if (isVideo != -1 && !loadedVideoInfo) {
            console.log("isVideo")
            createBtn('Mostrar Comentários', video_id)
            fetchVideoInfo(video_id)
        }
    }
}

function createBtn (label, video_id) {
    const fullScreenTitleDiv = document.querySelector("#movie_player > div.ytp-chrome-top > div.ytp-title");
    var b1 = document.createElement('button');
    b1.setAttribute("type", "button")
    b1.setAttribute("id", "showButton")
    b1.style.backgroundColor = "#2c9ae8"
    b1.style.color = "#FFFFFF"
    b1.style.padding = "12px"
    b1.style.margin = "8px"
    b1.style.borderRadius = "8px"
    b1.textContent = label;
    b1.onclick = () => showComments(video_id);
    fullScreenTitleDiv.append(b1)
}

function showComments (video_id) {
    console.log("loadedComments: " + loadedComments);
    if (loadedComments) {
        var div = document.getElementById("divComments")
        div.style.visibility = "visible"
    }
    else {
        fetchComments(video_id);
        loadedComments = true
    }
}

function hideComments () {
    var div = document.getElementById("divComments")
    div.style.visibility = "hidden"
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
            console.log("result: " + result)
            const date = new Date(result["items"][0]["snippet"]["publishedAt"]);
            const dataFormatada = addZero(date.getDate()) + " de " + addZero(date.toLocaleString('pt-br', { month: 'long' })) + " de " + date.getFullYear();
            const para = document.createElement("p");
            para.setAttribute("id", "divData")
            para.style.backgroundColor = "rgba(0, 0, 0, 0.7)"
            para.style.borderRadius = "15px"
            para.style.width = "fit-content"
            para.style.margin = "8px"
            para.style.padding = "12px"
            para.style.borderRadius = "15px"
            para.innerHTML = `<h3>` + dataFormatada + `</h3>`
            fullScreenTitleDiv.prepend(para);
            const ytptitle = document.getElementsByClassName("ytp-title-text")[0]
            ytptitle.style.padding = "12px";
            ytptitle.style.margin = "8px";
            ytptitle.style.width = "fit-content"
            ytptitle.style.backgroundColor = "rgba(0,0,0,0.7)"
            ytptitle.style.borderRadius = "15px"
            loadedVideoInfo = true
        }
        )
        .catch((error) => console.log("error: ", error))
}


function fetchComments (video_id) {

    const divComments = document.createElement("div")
    divComments.setAttribute("id", "divComments")
    divComments.style.position = "absolute"
    divComments.style.top = "200px"
    divComments.style.width = "100%"
    divComments.style.height = "320px"
    divComments.style.overflowY = "scroll"
    divComments.style.zIndex = "2147483647"
    divComments.style.transition = "2s ease top";
    document.body.append(divComments)

    divComments.addEventListener("scroll", (event) => {
        console.log("scroll");
        divComments.style.top = "0px"
        divComments.style.height = "450px"
    })

    const button = document.createElement("Button")
    button.setAttribute("type", "button")
    button.style.padding = "6px"
    button.style.margin = "6px"
    button.style.backgroundColor = "rgba(0, 0, 0, 0.7)"
    button.style.color = "rgb(255, 255, 255)"
    button.textContent = "X Fechar";
    button.onclick = () => hideComments();
    divComments.appendChild(button)

    var url =
        "https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=" + video_id + "&key=AIzaSyB4Mm0kSd7nsgOVHEh5zAMnYzLKxW8UyIM";

    try {
        fetch(url).then((commentsResponse) => commentsResponse.json()).then((comments) => {
            for (let index = 0; index < comments["items"].length; index++) {
                const comment = comments["items"][index]["snippet"]["topLevelComment"]["snippet"]["textDisplay"];
                const authorDisplayName = comments["items"][index]["snippet"]["topLevelComment"]["snippet"]["authorDisplayName"];
                const authorProfileImageUrl = comments["items"][index]["snippet"]["topLevelComment"]["snippet"]["authorProfileImageUrl"];
                const para = document.createElement("p");
                para.style.color = "#FFFFFF"
                para.style.visibility = "inherit"
                para.style.width = "fit-content"
                para.style.padding = "12px"
                para.style.margin = "12px"
                para.style.backgroundColor = "rgba(0, 0, 0, 0.6)"
                para.style.borderRadius = "15px 15px 15px 5px"
                para.innerHTML = "<h3>" + authorDisplayName + "</h3>" + comment
                divComments.appendChild(para);
            }
        })
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
