const sgMail = require('@sendgrid/mail')
const key ='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'
sgMail.setApiKey(key)
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: 'sbhuiya502@gmail.com', // Change to your recipient
  from: 'narualay030@gmail.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js test Hello there',
  // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })