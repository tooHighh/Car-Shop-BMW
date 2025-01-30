gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.matchMedia({
  "(min-width: 599px)": function () {
    gsap.from(".windows", {
      opacity: 0,
      y: "50%",
      duration: 1,
      scrollTrigger: {
        trigger: ".part1",
        start: "10% 0%",
        end: "bottom 0%",
        toggleActions: "restart none none reverse",
        pin: true,
        pinSpacing: false,
      },
    });
  },
});

const entrance = document.querySelector(".entrance");

document.addEventListener("DOMContentLoaded", () => {
  loadPage();
});

function loadPage() {
  fetch("/getCarData", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      let html = "";

      for (let i = 0; i < data.cars.length; i++) {
        html += `<div class="car-all">
            <div class="car">
              <div class="left">
                <h1>${data.cars[i].name}</h1>
                <img src="${data.cars[i].image_url}" alt="" />
              </div>
              <div class="right">
                <p><u>${data.cars[i].name} ${data.cars[i].type}</u></p>
                <p>${data.cars[i].description}</p>
                <p>
                  $${data.cars[i].starting_msrp} Starting MSRP
                  <i class="fa-solid fa-circle-info">
                    <small>
                      <span class="sqr"></span>
                      <span>
                        Manufacturer's Suggested Retail Price (MSRP) for vehicle as shown
                        does not necessarily represent the dealer's actual sale price and
                        does not include destination & handling fee, tax, title, license,
                        registration, and adjusted market value. Dealer sets actual price.
                        Please consult your selected dealer. Starting MSRP may vary as a
                        result of equipment capacity restrictions.
                      </span>
                    </small>
                  </i>
                </p>
              </div>
            </div>
            <button class="show">
              View All Models
              <i class="fa-solid fa-circle-plus" style="color: #d2d2d2; transition: 0.5s"></i>
            </button>
            <div class="options" style="display: none">`;

        let xDriveAdded = false;
        let sDriveAdded = false;

        for (let j = 0; j < data.options.length; j++) {
          if (data.options[j].car_id === data.cars[i].car_id) {
            if (data.options[j].drive_type === "xDrive" && !xDriveAdded) {
              html += `<div class="option0">
                             <p></p>
                             <p>xDrive</p>
                             <p>All-Wheel Drive Options</p>
                           </div>`;
              xDriveAdded = true;
            }

            if (data.options[j].drive_type === "sDrive" && !sDriveAdded) {
              html += `<div class="option0">
                             <p style="display:none"></p>
                             <p>sDrive</p>
                             <p>Rear-Wheel Drive Options</p>
                           </div>`;
              sDriveAdded = true;
            }

            html += `<div class="option1">
                           <img src="${data.options[j].image_url}" alt="" />
                           <div>
                             <p>${data.options[j].option_type}</p>
                             <p>${data.options[j].name}</p>
                             <p>${data.options[j].description}</p>
                           </div>
                           <div>
                             <p>STARTING MSRP</p>
                             <p>$${data.options[j].starting_msrp}</p>
                           </div>
                           <button class="add">Add To Cart</button>
                         </div>`;
          }
        }

        html += `<button class="close" id="close">
            Close
            <i class="fa-solid fa-circle-minus" style="transition: 0.5s"></i>
          </button>
          </div> 
        </div>`;
      }

      entrance.insertAdjacentHTML("afterend", html);

      const show = document.querySelectorAll(".show");
      const options = document.querySelectorAll(".options");
      const close = document.querySelectorAll(".close");

      show.forEach((s, index) => {
        s.addEventListener("click", () => {
          options[index].classList.add("Options");
        });
      });

      close.forEach((c, index) => {
        c.addEventListener("click", () => {
          options[index].classList.remove("Options");
        });
      });

      const add = document.querySelectorAll(".add");
      const popup = document.getElementById("popup");

      add.forEach((a, index) => {
        a.addEventListener("click", () => {
          fetch("/sendOption", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data.options[index]),
            credentials: "include",
          })
            .then((res) => res.text())
            .then((data) => {
              popup.textContent = data;

              if (data == "Added to cart!") {
                popup.classList.add("popupOk");
              } else {
                popup.classList.add("popupNotOk");
              }

              showNotif();
              setTimeout(hideNotif, 3500);
              setTimeout(afterNotif, 4000);
            })
            .catch((err) => console.error("Error:", err));
        });
      });
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
