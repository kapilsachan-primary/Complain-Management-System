// @ts-ignore
import nodemailer from "nodemailer";

const createTransporter = (fromEmail, fromPassword) => {
    return nodemailer.createTransport({
       // service: "gmail",
       host: "smtp.gmail.com",
       port: 587,
       secure: false, // Use true for port 465
        auth: {
            user: fromEmail,
            pass: fromPassword, // Use App Passwords if needed
        },
        tls: {
            rejectUnauthorized: false, // helps in dev environments
        },
        connectionTimeout: 10000, // optional
    });
};

export const sendEmail = async (from, fromPassword, to, subject, complaintData) => {
    try {
        const transporter = createTransporter(from, fromPassword); // Create transporter dynamically

        const mailOptions = {
            from, // Sender email
            to,
            subject,
            html: `
            <h2>${complaintData.title}</h2>
            <p><strong>Token No:</strong> ${complaintData.tokenno}</p>
            <p><strong>Name:</strong> ${complaintData.name}</p>
            <p><strong>Room No:</strong> ${complaintData.roomno}</p>
            <p><strong>Department:</strong> ${complaintData.department}</p>
            <p><strong>Category:</strong> ${complaintData.category}</p>
            <p><strong>services:</strong> ${complaintData.services}</p>
            <p><strong>Product Description:</strong> ${complaintData.productdescription}</p>
            <p><strong>Remarks:</strong> ${complaintData.remarks}</p>
            <p><strong>Status:</strong> ${complaintData.status}</p>
            <p><strong>Technician:</strong> ${complaintData.technician}</p>
            <p><strong>Action:</strong> ${complaintData.action}</p>
            <p><em>This is an automated email. Please do not reply.</em></p>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent from ${from} to ${to}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
