const form = document.getElementById("form");
form.addEventListener("submit", (e) => askQuestion(e));
const button = document.getElementById('button')
const main = document.getElementsByTagName('main');
let insertBefore = document.getElementById('last');
let messages = []

async function askQuestion(e) {
  e.preventDefault();

  let answerDiv = document.createElement("div");
  main[0].insertBefore(answerDiv, insertBefore);
  answerDiv.classList.add("border");
  
  answerDiv.innerHTML += `<b> ${chatfield.value} </b></br>`

  button.setAttribute("disabled", true)
  messages.push(['human', chatfield.value])
  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      prompt: messages
     }),
  };

  const response = await fetch("http://localhost:3000/", options);
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  
  let answer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, {stream: true});
    console.log(chunk);
    answerDiv.innerHTML += chunk;
    answer += chunk;
  }


  button.removeAttribute("disabled")

  insertBefore = answerDiv;
  messages.push("AI", answer);
  console.log(messages);

}
