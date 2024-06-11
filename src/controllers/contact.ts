import express, { Request, Response, Router } from "express";
import nodemailer from "nodemailer";
import sanitize from "sanitize-html";

const router: Router = express.Router();

const MAIL_EMAIL = process.env.MAIL_EMAIL;
const PWD_EMAIL = process.env.PWD_EMAIL;

const sanitizeInput = (input: string): string => {
  return sanitize(input); // Using sanitize-html if it fits your requirements or maintain your regex
};

router.post("/", async (req: Request, res: Response) => {
  try {
    // Extract and sanitize form data from the request body
    const name = sanitizeInput(req.body.name);
    const email = sanitizeInput(req.body.email);
    const message = sanitizeInput(req.body.message);

    // Create a Nodemailer transporter using environment variable credentials
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: MAIL_EMAIL,
        pass: PWD_EMAIL,
      },
    });

    // Define email options
    const mailOptions = {
      from: MAIL_EMAIL,
      to: MAIL_EMAIL,
      subject: "New Customer Question",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Send a success response
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while sending the email" });
  }
});

export default router;
