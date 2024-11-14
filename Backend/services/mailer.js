const nodemailer = require("nodemailer");

const Mailer = async(to, subject, message) => {
  try {
    senderName = "Buy and Sell"
    from = process.env.GMAIL;
    const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});
      
        // send mail
          await transporter.sendMail({
          from: `${senderName} <${from}>`, // sender address
          to: to, // list of receivers
          subject: subject, // Subject line
          //text: "Hello world?", // plain text body
          html: message, // html body
        });
      return true;
  } catch (error) {
      console.log(error)
      return false
  }    
}


module.exports = Mailer