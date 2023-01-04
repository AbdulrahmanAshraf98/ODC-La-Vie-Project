const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //create transporter > service will send email (email)
  try{
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: `<${ process.env.EMAIL_NAME} <${ process.env.EMAIL_USERNAME}>`, // sender address
      to: options.email, // list of receivers
      subject: options.subject, // Subject line
      text: options.text, // plain text body
      html:options.html
    };
    let info = await transporter.sendMail(mailOptions);
  }
  catch(error)
  {
    throw new Error(error);
  }

};
module.exports = sendEmail;
