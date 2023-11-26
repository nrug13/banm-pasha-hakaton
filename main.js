import axios from "https://cdn.skypack.dev/axios";
const corsAnywhere = "https://cors-anywhere.herokuapp.com/";
const languageSelect = document.getElementById("language-select");
const inputField = document.querySelector(".InputMSG");
const chatBox = document.querySelector(".ContentChat");
let statusbot = document.querySelector(".status");

let lastRequestTime = 0;
const MIN_REQUEST_DELAY = 2000;
let isBotResponded = true;
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

async function sendMessageToGPT(message) {
  const currentTime = Date.now();
  const timeElapsed = currentTime - lastRequestTime;

  if (timeElapsed < MIN_REQUEST_DELAY) {
    const delay = MIN_REQUEST_DELAY - timeElapsed;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  lastRequestTime = Date.now();

  try {
    const response = await axios.post(
      "https://chatbot-app-final-y4n4okdzoq-ew.a.run.app/predict",
      {
        text: message,
        sender: "user",
      }
    );

    const data = response;

    return data.data.result;
  } catch (error) {
    console.error("Error fetching response:", error);
    return "Sorry, there was an issue processing your request.";
  }
}
async function displayTypingAnimation() {
  const botResponseElement = document.createElement("div");
  botResponseElement.classList.add("bot-response", "typing-dots");
  chatBox.appendChild(botResponseElement);

  const ellipsisAnimation = [".", "..", "..."];
  let index = 0;

  function animateEllipsis() {
    if (index === ellipsisAnimation.length) {
      index = 0;
    }

    botResponseElement.textContent = ellipsisAnimation[index];
    botResponseElement.style.fontSize = "24px";
    botResponseElement.style.animation = "bounce 0.6s infinite";
    index++;
    setTimeout(animateEllipsis, 500);
  }

  animateEllipsis();

  return botResponseElement;
}
async function typeBotResponse(message) {
  console.log(message);
  const botResponseElement = document.createElement("div");
  botResponseElement.classList.add("bot-response");
  chatBox.appendChild(botResponseElement);

  const text = message;
  let index = 0;

  async function type() {
    if (index < text.length) {
      botResponseElement.textContent += text.charAt(index);
      index++;
      await new Promise((resolve) => setTimeout(resolve, 10));
      await type();
    }
  }

  await type();
  const ellipsisElement = chatBox.querySelector(".typing-dots");
  if (ellipsisElement) {
    setTimeout(() => {
      chatBox.removeChild(ellipsisElement);
    }, 100);
  }
}

async function sendMessage() {
  const message = inputField.value;

  if (message !== "" && isBotResponded) {
    addMessageToChat(message, true);
    isBotResponded = false;

    try {
      displayTypingAnimation();
      inputField.value = "";
      const botResponse = await sendMessageToGPT(message);
      await typeBotResponse(botResponse);

      isBotResponded = true;
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

changePlaceholder();
