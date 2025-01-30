function load() {
  const email = document.querySelector(".email");
  const pass = document.querySelector(".pass");
  const date = document.querySelector(".date");

  fetch("/getUserProfileData", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch user profile");
      }
      return res.json();
    })
    .then((data) => {
      email.innerHTML = email.innerHTML.replace("[email]", data.data[0].email);
      pass.innerHTML = pass.innerHTML.replace("[pass]", "***************");
      date.innerHTML = date.innerHTML.replace("[date]", data.data[0].joinDate);
    })
    .catch((error) => {
      console.error("Error fetching user profile data:", error);
    });
}

function get() {
  const email = document.querySelector(".email");
  const password = document.querySelector(".pass");
  const mail = document.getElementById("email").value;
  const pass = document.getElementById("pass").value;

  fetch("/updateUserProfileData", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email: mail, pass: pass }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data && data.email && data.pass) {
        email.innerHTML = `<u>Email:</u>${data.email}`;
        password.innerHTML = `<u>Password:</u>${data.pass}`;
      } else {
        console.error("Error: Data is incomplete", data);
      }
    })
    .catch((error) => {
      console.error("Error updating user profile data:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  load();
});

function signOut() {
  const signoutNote = document.querySelector(".signoutMessage");
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  fetch("/signOut", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  }).then((res) => {
    if (res.ok) {
      signoutNote.style.color = "white";
      signoutNote.textContent = "SignOut successful!";
      setTimeout(() => {
        document.location.href = "/signOut";
      }, 1500);
    }
  });
}
