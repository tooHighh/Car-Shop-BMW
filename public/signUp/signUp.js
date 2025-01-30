

const emailNote = document.getElementById("emailNote");
const passNote = document.getElementById("passNote");

function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("pass").value;
  const res = document.getElementById("res");
  res.textContent = "";
  let valid = true;

  if (!email) {
    emailNote.textContent = "Please enter your email!";
    emailNote.classList.add("error");
    valid = false;
  } else {
    emailNote.textContent = "";
    emailNote.classList.remove("error");
  }

  if (!password) {
    passNote.textContent = "Please enter your password!";
    passNote.classList.add("error");
    valid = false;
  } else {
    passNote.textContent = "";
    passNote.classList.remove("error");
  }

  if (valid) {
    fetch("/signUp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.text();
        } else if (response.status === 409) {
          return response.text();
        } else {
          throw new Error("An error occurred. Please try again later.");
        }
      })
      .then((result) => {
        res.textContent = result;
        res.classList.add("res");
        if (result == "Account created. Welcome!")
          setTimeout(() => {
            window.location.href = "/afterSignUp";
          }, 1500);
      });
  }
}


