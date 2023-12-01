const client = require("@mailchimp/mailchimp_marketing");

client.setConfig({
  apiKey: "b1db2c3ff8fac06a1cac88482431f2fc-us21",
  server: "us21",
});

const run = async () => {
  const response = await client.templates.getTemplate(145);
  console.log(response);
};

run();

// b1db2c3ff8fac06a1cac88482431f2fc-us21
