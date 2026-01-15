// require("dotenv").config();

// console.log("Email is:", typeof process.env.EMAIL_USER);
// console.log("Email Pass is:", typeof process.env.EMAIL_PASS);

// const nodemailer = require("nodemailer");
// const { verifyEmail } = require("./controllers/verificationController");

// // Create a transporter using Ethereal test credentials.
// // For production, replace with your actual SMTP server details.
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   // service: "gmail",
//   port: 587,
//   secure: false, // Use true for port 465, false for port 587
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });
// const verif = (email,link) => {
//     const Html = `<b>${link} am sorry if any of you got this mail ,my software is misbehaving</b>`
//   try {
//     // Send an email using async/await
//     (async () => {
//       const info = await transporter.sendMail({
//         from: `"Amir" <${process.env.EMAIL_USER}>`,
//         to: email,
//         subject: "Hello ✔",
//         text: "Hello am sorry if any of you got this mail ,my software is misbehaving?", // Plain-text version of the message
//         html: Html,
//       });

//       console.log("Message sent:", info);
//     })();
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// };

// verif('muhammadaliyumuazu@gmail.com',"AMir");

// const knex = require("./db/knex");
// const d = async () => {
//   const num = "20"
//   const resp = await knex("Users").where({ id: 3 }).increment("capacity", parseFloat(num));
//   console.log(resp)
// };
// d();
const { distributePickupRevenue } = require("./services/updateBalance");
let price = "10"
let kg = "10"

const payout = distributePickupRevenue(price);
const userPayout = Math.round(payout.userShare * kg )
const agentShare = Math.round(payout.agentShare * kg)
console.log(payout);
console.log(userPayout,agentShare)
