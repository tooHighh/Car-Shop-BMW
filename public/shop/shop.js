const h1 = document.getElementById("cartH1");
const checkButton = document.getElementById("checkButton");
let total = 0;

document.addEventListener("DOMContentLoaded", () => {
  fetch("/fillCart", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch data");
      return res.json();
    })
    .then((data) => {
      const note = document.getElementById("note");
      const totalDiv = document.querySelector(".total");
      if (data.length != 0) {
        note.classList.add("rmvOption");
        note.classList.remove("note");
        checkButton.classList.add("checkButton");
        checkButton.classList.remove("rmvOption");
        data.forEach((item) => {
          item.forEach((option) => {
            total += option.starting_msrp;
            let html = `
          <div class="option1" id="option${option.option_id}">
            <img src="${option.image_url}" alt="Image of ${option.name}" />
            <div>
              <p>${option.option_type}</p>
              <p>${option.name}</p>
              <p>${option.description}</p>
            </div>
            <div>
              <p>STARTING MSRP</p>
              <p>$${option.starting_msrp}</p>
            </div>
            <button class="remove" onclick="remove(${option.option_id},${option.starting_msrp})">Remove</button>
          </div>`;
            h1.insertAdjacentHTML("afterend", html);
          });
        });
      } else {
        note.classList.remove("rmvOption");
        note.classList.add("note");
        checkButton.classList.remove("checkButton");
        checkButton.classList.add("rmvOption");
      }
      totalDiv.innerHTML = `<h1><u>Total:</u>${total} $</h1>`;
    })
    .catch((error) => {
      console.error("Error fetching cart data:", error);
    });
});

function remove(id, optionPrice) {
  const option = document.getElementById(`option${id}`);
  const note = document.getElementById("note");
  const totalDiv = document.querySelector(".total");
  total = total - optionPrice;
  totalDiv.innerHTML = `<h1><u>Total:</u>${total} $</h1>`;
  option.classList.toggle("option1");
  option.classList.toggle("rmvOption");
  fetch("/removeOption", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ id: id }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      popup.textContent = data.message;
      if (data.message == "The delete was successful!") {
        popup.classList.add("popupOk");
      } else {
        popup.classList.add("popupNotOk");
      }
      if (data.data.length == 0) {
        note.classList.remove("rmvOption");
        note.classList.add("note");
        checkButton.classList.remove("checkButton");
        checkButton.classList.add("rmvOption");
      }
      showNotif();
      setTimeout(hideNotif, 3500);
      setTimeout(afterNotif, 4000);
    })
    .catch((error) => {
      console.error("Error removing item:", error);
    });
}
function showNotif() {
  popup.classList.remove("after", "leave");
  popup.classList.add("enter");
}

function hideNotif() {
  popup.classList.remove("enter");
  popup.classList.add("leave");
}

function afterNotif() {
  popup.classList.remove("enter", "leave", "popupOk", "popupNotOk");
  popup.classList.add("after");
}

function checkout() {
  fetch("/checkout", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then((response) => {
      if (response.ok) {
        window.location.href = "/checkout";
      } else {
        console.error("Failed to load the checkout page");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
