const nodemailer = require('nodemailer')
const HOST = process.env.EMAIL_HOST
const PORT = process.env.EMAIL_PORT
const USERNAME = process.env.EMAIL_USERNAME
const PASSWORD = process.env.EMAIL_PASSWORD


/**
 * 
 * @param {{to:email, subject:string, html: string}} 
 * @description sends emails 
 */
async function sendEmail({ to, subject, html }) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: HOST,
    auth: {
      user: USERNAME,
      pass: PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  })

  const emailObject = {
    from: USERNAME,
    to,
    subject,
    html
  }
  // send mail with defined transport object
  transporter.sendMail(emailObject, (err, info) => {
    if (err) {
      console.log(err)
    }
  })
}
module.exports = sendEmail
