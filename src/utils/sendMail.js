const nodemailer = require('nodemailer');

class MailService {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'haphene@gmail.com',
            pass: 'sayt jfdd ipfy tsqe'
        }
    });

    mailOptions = {
        from: 'haphene@gmail.com',
        to: 's2hathanhtuan2s@gmail',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };

    async send({ to, text } = { to: 'cholat91@gmail.com', text: '' }) {
        if (typeof to === 'string') {
            this.mailOptions.to = to;
        } else if (Array.isArray(to)) {
            this.mailOptions.to = to.reduce((prev, pres) => prev + pres, '');
        }
        this.mailOptions.text = text;
        const that = this;
        return new Promise((ok, fail) => {
            that.transporter.sendMail(that.mailOptions, function (error, info) {
                error ? fail(error) : ok(info);
            });
        });
    }
}

module.exports = MailService;
