import request from "supertest";
import nodemailer from "nodemailer";
import app from "@/src/server";

jest.mock("nodemailer");
jest.mock("sanitize-html", () => (input: string) => input);

describe("POST /", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should send an email and return status 200 on success", async () => {
    const sendMailMock = jest.fn().mockResolvedValue({});
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    const response = await request(app).post("/api/contact").send({
      name: "John Doe",
      email: "john.doe@example.com",
      message: "This is a test message",
    });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ message: "Email sent successfully" });
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith({
      from: process.env.MAIL_EMAIL,
      to: process.env.MAIL_EMAIL,
      subject: "New Customer Question",
      text: "Name: John Doe\nEmail: john.doe@example.com\nMessage: This is a test message",
    });
  });

  it("should return status 500 on email sending failure", async () => {
    const sendMailMock = jest.fn().mockRejectedValue(new Error("SMTP Error"));
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    const response = await request(app).post("/api/contact").send({
      name: "John Doe",
      email: "john.doe@example.com",
      message: "This is a test message",
    });

    expect(response.status).toEqual(500);
    expect(response.body).toEqual({
      error: "An error occurred while sending the email",
    });
    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });
});
