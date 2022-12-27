const nodemailer = require("nodemailer");



exports.sendEmail = async(options)=>{
    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASS,
        }
    });

    const mailOptions = {
        from : process.env.EMAI_ADDRESS,
        to : options.email,
        subject : options.subject,
        text : options.message,
    }

    await transporter.sendMail(mailOptions);
}