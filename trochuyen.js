let showcovorchat = true;

function hideapart() {
    const cov = document.getElementById("conversationcontainer");
    const chat = document.querySelector(".chatspace");
    if (showcovorchat) {
        chat.style.display = 'none';
        cov.style.display = "flex";
        cov.style.width="100%"
        chat.style.width="70%"
    } else {
        cov.style.display = 'none';
        chat.style.display = "flex";
        cov.style.width="30%"
        chat.style.width="100%"
    }
    // showcovorchat = !showcovorchat;
}

function checkViewport() {
    const viewportWidth = window.innerWidth;
    if (viewportWidth < 500) {
        hideapart();
    }else{
        const cov = document.getElementById("conversationcontainer");
        const chat = document.querySelector(".chatspace");
        chat.style.display = "flex";
        cov.style.display = "flex";
        chat.style.width="70%"
        cov.style.width="30%"
    }
}

// Run on initial load
checkViewport();

// Run on resize
window.addEventListener('resize', checkViewport);
function showcovandchat(){
  showcovorchat = !showcovorchat;
  hideapart();
}

  function createMessage({ type, content, timestamp }) {
    let div=document.createElement("div");
    div.className="messageforall";
    if(type=="orange"){
        div.style.display="flex"
        div.style.justifyContent="flex-end"
    }
    let messageDiv = document.createElement('div');
    messageDiv.className = type === 'orange' ? 'message-orange' : 'message-blue';
    let messageContent = document.createElement('p');
    messageContent.className = 'message-content';
    messageContent.textContent = content;

    let lineBreak = document.createElement('br');
    let timestampDiv = document.createElement('div');
    timestampDiv.className = type === 'orange' ? 'message-timestamp-right' : 'message-timestamp-left';
    timestampDiv.textContent = timestamp;
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(lineBreak);
    messageDiv.appendChild(timestampDiv);
    div.appendChild(messageDiv)
    let container = document.querySelector('#addmeshere');
    if (container) {
        container.append(div);
    } else {
        console.log("Message container not found.");
    }
}
function createChatDiv({ imageUrl, title, message, link }) {
    let chatDiv = document.createElement('div');
    chatDiv.className = 'chatdiv';
    chatDiv.style.overflow="hidden"
    let chatLink = document.createElement('a');
    chatLink.className = 'chattaga';
    chatLink.href = link || '#';
    let imgContainer = document.createElement('div');
    imgContainer.style.cssText = "height: 70px; display: flex; justify-content: center; align-items: center; padding-left: 10px;";
    let img = document.createElement('img');
    img.src = imageUrl;
    img.alt = "";
    img.style.cssText = "width: 65px; aspect-ratio: 1/1; border-radius: 100px;";
    imgContainer.appendChild(img);
    let textContainer = document.createElement('div');
    textContainer.style.width="100%";
    let h1 = document.createElement('h1');
    h1.textContent = title;
    h1.style.overflow="hidden"
    let h2 = document.createElement('h2');
    h2.textContent = message;
    h2.style.overflow="hidden";
    textContainer.appendChild(h1);
    textContainer.appendChild(h2);
    chatLink.appendChild(imgContainer);
    chatLink.appendChild(textContainer);
    chatDiv.appendChild(chatLink);
    document.getElementById("conversationcontainer").append(chatDiv);
}
document.getElementById("submitButton").addEventListener("click", function () {

    sendmes()

});
function sendmes() {
  let mes = document.getElementById("message").value;

  if (mes != "") {
    let formData = new FormData();
    formData.append("message", mes);
    formData.append("userid", document.getElementById("texter").value);

    fetch("sendmes.php", {
      method: "POST",
      body: formData
    })
      .then(response => response.text())
      .then(data => {
        console.log(data);
        updateChat(); // update chat after sending
        setTimeout(scrollToBottom, 300); // wait a bit for DOM update
      })
      .catch(error => console.error("Error:", error));

    document.getElementById("message").value = "";
  } else {
    updateChat();
    setTimeout(scrollToBottom, 300);
  }
}

function updateChat() {
    let userid = document.getElementById("texter").value;
    if (userid !== "") {
        fetch("trochuyenfunction.php?userid=" + encodeURIComponent(userid))
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    console.error("Error:", data.error);
                    return;
                }
                document.getElementById("conversationcontainer").innerHTML = "";
                document.getElementById("addmeshere").innerHTML = "";
                document.getElementById("textername").innerText = data.user.name;
                document.getElementById("texterpic").src = data.user.avatar;
                data.messages.forEach(msg => {
                    createMessage(msg);
                });
                data.chats.forEach(chat => {
                    createChatDiv(chat);
                });
            })
            .catch(error => console.error("Fetch Error:", error));
    }
}

setInterval(updateChat, 3000);

function scrollToBottom() {
  const chatBody = document.getElementById("chatspacebody");
  console.log( chatBody.scrollHeight)
  chatBody.scrollTo({
    top: chatBody.scrollHeight,
    behavior: "smooth"
  });
}



