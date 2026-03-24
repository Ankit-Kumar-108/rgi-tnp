import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { generateOTP, getOTPExpiry } from "@/lib/auth-utils";
import { otpEmailTemplate } from "@/lib/email-templates";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as { email?: string };
        const email = body?.email;
        if (!email) {
            return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
        }

        const db = getDb();

        const student = await db.student.findUnique({
            where: { email: email }
        });

        if (!student) {
            return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
        }

        if (student.isEmailVerified) {
            return NextResponse.json({ success: false, message: "Account already verified" }, { status: 400 });
        }   

        if (student.lastOtpSentAt) {
            const diffInSeconds = Math.floor((new Date().getTime() - student.lastOtpSentAt.getTime()) / 1000);
            if (diffInSeconds < 60) {
                return NextResponse.json({ success: false, message: "Please wait for a minute before requesting a new OTP" }, { status: 429 });
            }
        }

        const newOTP = generateOTP();
        const newOTPExpiry = getOTPExpiry();

        await db.student.update({
            where: { email: email },
            data: {
                emailVerificationToken: newOTP,
                emailVerificationTokenExpiry: newOTPExpiry,
                otpAttempts: 0,
                lastOtpSentAt: new Date()
            }
        });

        const mailOptions = {
            from: `"RGI T&P" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Resend OTP",
            html: otpEmailTemplate(newOTP, student.name)
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: "OTP sent successfully" }, { status: 200 });

    } catch (error: any) {
        console.error("Error in Resending OTP:", error);
        return NextResponse.json({ success: false, message: "Failed to resend OTP" }, { status: 500 });
    }
}