
import * as dotenv from 'dotenv';
import * as nodemailer from "nodemailer";

dotenv.config();
const dotenv_Config = require('dotenv').config();
const email_Server = dotenv_Config.parsed.NODEMAILER_EMAIL;
const email_Password = dotenv_Config.parsed.NODEMAILER_PASSWORD;

export async function enviar_Email(Destinatario: any, html_template: any): Promise<string> {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: email_Server,
                pass: email_Password,
            },
        });

        const msg = {
            to: Destinatario,
            from: 'MexicanaDeVuelos@gmail.com',
            subject: 'Mexicana de vuelos',
            html: html_template,
        };

        transporter.sendMail(msg, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });

        console.log('Email sent successfully');
        return 'Email sent successfully';
    } catch (error) {
        throw new Error('Error sending email');
    }
}
