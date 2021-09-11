window.addEventListener("load", (event) => createDiv());
window.addEventListener("click", (event) => updateDate("click: " + event));


function createDiv() {
  var titulo = document.getElementsByClassName("title")[0]
  var p = document.createElement("div")
  p.id = "extData"
  titulo.appendChild(p)
  var text = document.createTextNode("date")
  document.getElementById("extData").innerText = "dateadsdasd"
}


window.addEventListener('popstate', function (event) {
  // Log the state data to the console
  console.log("event.state: " + event.state);
});

function updateDate(event) {
  console.log(event)
}
