const languageSelect = document.getElementById("language-select");
const inputField = document.querySelector(".InputMSG");
const chatBox = document.querySelector(".ContentChat");
const statusbot = document.querySelector(".status");

let lastRequestTime = 0;
const MIN_REQUEST_DELAY = 2000;

async function getDataFromJSONFile() {
  try {
    const response = await fetch("datas.json"); // Replace with your file path
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data from JSON file:", error);
    return null;
  }
}

async function sendMessageToGPT(message) {
  try {
    const localData = await getDataFromJSONFile(); 
    if (localData) {
     
      console.log(localData);
      return "Success"; 
    } else {
      return "Error fetching local data";
    }
  } catch (error) {
    console.error("Error processing local data:", error);
    return "Sorry, there was an issue processing local data.";
  }
}

async function typeBotResponse(message) {
  const botResponseElement = document.createElement("div");
  botResponseElement.classList.add("bot-response");
  botResponseElement.textContent = message; 

  chatBox.appendChild(botResponseElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addMessageToChat(message, isUser = false) {
  const messageElement = document.createElement("div");
  messageElement.textContent = message;

  if (isUser) {
    messageElement.classList.add("user-response");
  } else {
    messageElement.classList.add("bot-response");
  }

  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = inputField.value.trim();
  if (message !== "") {
    addMessageToChat(message, true); 

    try {
      const botResponse = await sendMessageToGPT(message);
      await typeBotResponse(botResponse); 

      inputField.value = "";
      chatBox.scrollTop = chatBox.scrollHeight; 
    } catch (error) {
      console.error("Error:", error);
     
    }
  }
}

languageSelect.addEventListener("change", changePlaceholder);

inputField.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

const sendIcon = document.querySelector(".send-icon");
sendIcon.addEventListener("click", sendMessage);

function changePlaceholder() {
  const selectedLanguage = languageSelect.value;

  if (selectedLanguage === "en") {
    inputField.setAttribute("placeholder", "Type your message here");
    statusbot.textContent = "Online";
  } else if (selectedLanguage === "az") {
    inputField.setAttribute("placeholder", "Mesajınızı buraya yazın");
    statusbot.textContent = "Onlayn";
  } else if (selectedLanguage === "ru") {
    inputField.setAttribute("placeholder", "Введите ваше сообщение здесь");
    statusbot.textContent = "Онлайн";
  }
}

changePlaceholder(); 
