const express = require("express");
const app = express();
const path = require("path");
const logInRouter = require("./nodeJs/logIn");
const signUpRouter = require("./nodeJs/signUp");
const afterSignUpRouter = require("./nodeJs/afterSignUp");
const getCarDataRouter = require("./nodeJs/getCarData");
const option = require("./nodeJs/option");
const fillCart = require("./nodeJs/fillcart");
const cookieParser = require("cookie-parser");
const removeOption = require("./nodeJs/removeOption");
const getProfileData = require("./nodeJs/fillUserProfile");
const updateProfileData = require("./nodeJs/updateUserProfileData");
const loadCheckout = require("./nodeJs/checkout");
const signOut = require("./nodeJs/signOut");
const sendMail = require("./nodeJs/sendMail");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main.html"));
});

app.use(logInRouter);
app.use(signUpRouter);
app.use(afterSignUpRouter);
app.use(getCarDataRouter);
app.use(option);
app.use(fillCart);
app.use(removeOption);
app.use(getProfileData);
app.use(updateProfileData);
app.use(loadCheckout);
app.use(signOut);
app.use(sendMail);

app.listen(5500, () => {
  console.log("The server is listening to port 5500!");
});
