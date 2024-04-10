import nodemailer from "nodemailer";
import { asyncHandler } from "../utils/asyncHandler.js"
console.log("text 2");

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com', // Your SMTP host
  port: 587, // Your SMTP port
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.user, // Your email username
    pass: process.env.pass // Your email password
  }
});

// Function to send email after user registration
const sendWelcomeEmail = (email) => {
    // const {email} = req.body
  const mailOptions = {
    from: process.env.user, // Sender address
    to: email, // List of recipients
    subject: 'Welcome to Our Application', // Subject line
    text: 'Thank you for registering with us. We hope you enjoy using our application.' // Plain text body
    // You can also use html: '<h1>Welcome to Our Application</h1>' for HTML formatted body
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error occurred while sending email:', error.message);
    } else {
      console.log('Email sent successfully:', info.response);
    }
  });
};

export default sendWelcomeEmail;
