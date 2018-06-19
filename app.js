const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
//View engine setup
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
app.get('/', (req, res) => {
    res.render('contact')
})

//Body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(3000, () => console.log('Server started'))

//Static folder
app.use('/public', express.static(path.join(__dirname, 'public')))

app.post('/send', (req, res) => {
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Name: ${req.body.email}</li>
            <li>Name: ${req.body.message}</li>
        </ul>
    
    `;
    let transporter = nodemailer.createTransport({
        host: '',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: '', // generated ethereal user
            pass: '' // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Codenamics 👻" <test@codenamics.pl>', // sender address
        to: 'info@codenamics.pl', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact', { msg: 'Message sent' })
    });
})

