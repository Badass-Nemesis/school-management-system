import nodemailer from 'nodemailer';

// function to send an email (but not using it anywhere in my code)
export const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
    // Configure the transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Or any other email service
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS, // Your email password
        },
    });

    // Define the email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};
