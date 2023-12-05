const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");
// const client = require("@mailchimp/mailchimp_marketing");

const auth = {
  auth: {
    api_key: "0db915c970c43ae422d7e7b02c0639b3-0a688b4a-dd0a5c01",
    domain: "sandbox99a3f45505c543229fc62017a47153b8.mailgun.org",
  },
};

var transporter = nodemailer.createTransport(mg(auth));

exports.transporter = transporter;

// client.setConfig({
//   apiKey: "b1db2c3ff8fac06a1cac88482431f2fc-us21",
//   server: "us21",
// });

// const run = async () => {
//   const response = await client.templates.getInfo(145);
//   console.log(response.html);
// };

// run();

// b1db2c3ff8fac06a1cac88482431f2fc-us21

// 0db915c970c43ae422d7e7b02c0639b3-0a688b4a-dd0a5c01
