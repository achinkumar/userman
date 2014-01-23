var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
// var smtpTransport = nodemailer.createTransport("SMTP", {
//     service: "Gmail",
//     auth: {
//         user: "fasttrainofthoughts@gmail.com",
//         pass: "password"
//     }
// });

var transport = nodemailer.createTransport("SES", {
    AWSAccessKeyID: "",
    AWSSecretKey: ""
});

exports.sendNotification = function (options, callback) {
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: options.senderName + "<" + options.senderEmail + ">", // sender address
        to: options.receiverName + "<" + options.receiverEmail + ">", // list of receivers
        subject: options.subject, // Subject line
        text: options.textBody, // plaintext body
        html: options.htmlBody // html body
    }

    // send mail with defined transport object
    transport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }
        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
}
