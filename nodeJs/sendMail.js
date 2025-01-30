const express = require("express");
const router = express.Router();
const mailer = require("nodemailer");
const connection = require("./connection");
const auth = require("./middleware");
const path = require("path");

const transporter = mailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const queryAsync = (sql, params) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

router.get("/sendMail", auth, async (req, res) => {
  try {
    const userEmailData = await queryAsync(
      "SELECT email FROM users WHERE id = ?",
      [req.userId]
    );

    if (!userEmailData || !userEmailData.length) {
      return res.status(404).send("User email not found");
    }

    const email = userEmailData[0].email;

    const userOptionData = await queryAsync(
      "SELECT option_id FROM user_options WHERE user_id = ?",
      [req.userId]
    );

    if (!userOptionData || !userOptionData.length) {
      return res.status(404).send("User options not found");
    }

    let total = 0;
    let content = `<h1 style="text-align:center; font-size:3em ; padding-bottom:1em">Checkout Successful</h1>`;
    const attachments = [];

    userOptionData.forEach(async (opt, i) => {
      const optionsData = await queryAsync(
        "SELECT * FROM options WHERE option_id = ?",
        [opt.option_id]
      );

      if (optionsData && optionsData.length) {
        optionsData.forEach((option, index) => {
          content += `
            <div class="option1">
              <img src="cid:id${i}-${index}" alt="" />
              <div>
                <p><b>Option type:</b> ${option.option_type}</p>
                <p><b>Option name:</b> ${option.name}</p>
                <p><b>Option description:</b> ${option.description}</p>
              </div>
              <div>
                <p style="border-bottom:1px solid black; padding-bottom:1em ; text-align:center; font-weight:bold; font-size:2em">$${option.starting_msrp}</p>
              </div>
            </div>`;
          total += option.starting_msrp;

          attachments.push({
            filename: `image_${i}-${index}.png`,
            path: path.join(__dirname, "../public", option.image_url),
            cid: `id${i}-${index}`,
          });
        });
      }
    });

    await Promise.all(
      userOptionData.map((opt) =>
        queryAsync("SELECT * FROM options WHERE option_id = ?", [opt.option_id])
      )
    );
    await queryAsync("DELETE FROM user_options WHERE user_id = ?", [
      req.userId,
    ]);

    content += `<p style="text-align:center; font-size:1.5em; font-weight:bold; padding-bottom:1.5em; border-bottom:1px solid black">Total: $${total}</p>
    <p id="end" style="text-align:center; font-size:1.5em; font-weight:bold">BMW thanks you for your purchase</p>`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Sending Mail",
      html: content,
      attachments,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("An error occurred while sending the email");
  }
});

module.exports = router;
