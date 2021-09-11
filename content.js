window.addEventListener("fullscreenchange", (event) => init(event))

var loaded = false;

function init(event) {
    var isVideo = window.location.href.indexOf('watch?')
    var video_id = window.location.search.split('v=')[1]
    var ampersandPosition = video_id.indexOf('&')
    if (ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition)
    }
    if (isVideo != -1) {
        console.log("isVideo")
        if (!loaded) {
            loaded = true;
            createBtn('Mostrar Comentários', show)
            fetchVideoInfo(video_id)

        }
    }
}

function createBtn(label, callback) {
    var fullScreenTitleDiv = document.querySelector("#movie_player > div.ytp-chrome-top > div.ytp-title");
    var b1 = document.createElement('button');
    b1.setAttribute("type", "button")
    b1.setAttribute("style", "padding: 6px; margin:6px")
    b1.textContent = label;
    b1.onclick = callback;
    fullScreenTitleDiv.append(b1)
}

function show() {
    var c = document.getElementById("container")
    c.style.color = "black"
} function hide() {
    var c = document.getElementById("container")
    c.style.color = "white"
}


function fetchVideoInfo(video_id) {
    // console.log("updateDate")
    var fullScreenTitleDiv = document.querySelector("#movie_player > div.ytp-chrome-top > div.ytp-title");
    fullScreenTitleDiv.style.display = "block"

    var requestOptions = {
        method: "GET",
        redirect: "follow",
    }

    fetch(
        "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=" + video_id + "&key=AIzaSyB4Mm0kSd7nsgOVHEh5zAMnYzLKxW8UyIM",
        requestOptions
    )
        .then((response) => response.json())
        .then((result) => {
            // console.log(result)
            var date = new Date(result["items"][0]["snippet"]["publishedAt"]);
            var title = result["items"][0]["snippet"]["title"];
            var dataFormatada = addZero(date.getDate()) + " de " + addZero(date.toLocaleString('pt-br', { month: 'long' })) + " de " + date.getFullYear();

            const div = document.createElement("div");
            div.className = "divComments"
            const para = document.createElement("p");
            para.innerHTML = "<h3 style='padding:6px 6px 0 6px'>" + dataFormatada + "</h3>"
            div.appendChild(para);
            fullScreenTitleDiv.prepend(div);
            fullScreenTitleDiv.style.overflowY = "scroll";
            fullScreenTitleDiv.style.height = "450px";
            document.getElementsByClassName("ytp-title-text")[0].style.paddingTop = "0px";
            // fullScreenTitleDiv.style.backgroundColor = "rgba(0,0,0,0.7)"
            // fetchComments(video_id, fullScreenTitleDiv)
        }
        )
        .catch((error) => console.log("error: ", error))
}


function fetchComments(video_id, el) {
    var url =
        'https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=' + video_id + '&key=AIzaSyB4Mm0kSd7nsgOVHEh5zAMnYzLKxW8UyIM';
    try {
        fetch(url).then((commentsResponse) => commentsResponse.json()).then((comments) => {
            for (let index = 0; index < comments["items"].length; index++)
            // 
            {
                const comment = comments["items"][index]["snippet"]["topLevelComment"]["snippet"]["textDisplay"];
                // console.log(comment)
                // el.innerText += comment // Este funciona
                const div = document.createElement("div");
                div.className = "divComment"
                div.style.visibility = "visible"
                const para = document.createElement("p");
                para.style.padding = "12px"
                para.style.margin = "12px"
                para.innerHTML = "<h3>Title</h3>" + comment
                // para.style.display = "relative";
                div.appendChild(para);
                el.appendChild(div);
            }
        })
    } catch (error) {
        console.log(error)
    }
}

function addZero(numero) {
    if (numero <= 9)
        return "0" + numero;
    else
        return numero;
}
