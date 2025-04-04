import emailjs from "emailjs-com";

const sendEmail = (respondent_id, respondent_email, respondent_name, respondent_role, org_name, field, staff_size, time) => {

  if (!respondent_email) {
    console.error("Error: respondent_email is empty or undefined");
    return;
  }

  const templateParams = {
    respondent_id,
    respondent_email,
    respondent_name,
    respondent_role,
    org_name,
    field,
    staff_size,
    time
  };

  emailjs
    .send("service_ksb5iim", "template_n4jm5uq", templateParams, "vgZTAA8Vitri3fCrj")
    .then((response) => {
      console.log("Email sent!", response.status, response.text);
    })
    .catch((err) => console.error("Error sending email:", err));
};


export default sendEmail;
