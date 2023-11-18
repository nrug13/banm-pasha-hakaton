const languageSelect = document.getElementById("language-select");
const inputField = document.querySelector(".InputMSG");
const chatBox = document.querySelector(".ContentChat");
const statusbot = document.querySelector(".status");

let lastRequestTime = 0;
const MIN_REQUEST_DELAY = 2000;

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
    const response = await fetch(
      "https://api.openai.com/v1/engines/davinci/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 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", // Replace with your actual API key
        },
        body: JSON.stringify({
          prompt: message,
          max_tokens: 50,
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();
    console.log(data.error);
    return data.error.message;

    //choices[0].text.trim()
  } catch (error) {
    console.error("Error fetching response:", error);
    return "Sorry, there was an issue processing your request.";
  }
}

async function typeBotResponse(message) {
  const botResponseElement = document.createElement("div");
  botResponseElement.classList.add("bot-response");
  chatBox.appendChild(botResponseElement);

  const text = message.trim();
  let index = 0;

  async function type() {
    if (index < text.length) {
      botResponseElement.textContent += text.charAt(index);
      index++;
      await new Promise((resolve) => setTimeout(resolve, 7)); // Adjust typing speed here (in milliseconds)
      type();
    }
  }

  await type();
}

async function sendMessage() {
  const message = inputField.value.trim();
  if (message !== "") {
    addMessageToChat(message, true); // Display user message

    try {
      const botResponse = await sendMessageToGPT(message);
      await typeBotResponse(botResponse); // Display bot response with typing effect

      inputField.value = "";
      chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom after bot response
    } catch (error) {
      console.error("Error:", error);
      // Handle errors here
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
