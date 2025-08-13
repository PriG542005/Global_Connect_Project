const nodemailer = require('nodemailer');
require('dotenv').config()
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    requireTls: true,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD
    }
})
const sendmail = async (email, subject, content) => {
    return new Promise((resolve, reject) => {
        try {
            const mailOptions = {
                from: process.env.SMTP_MAIL,
                to: email,
                subject: subject,
                html: content
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                    reject(error)
                } else {
                    console.log("Email sent successfully", info.messageId)
                    resolve(info)
                }
            })
        }
        catch (error) {
            console.log(error)
            reject(error)
        }
    })
}
module.exports = { sendmail }
