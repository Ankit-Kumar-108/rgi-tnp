export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { generateVerificationToken, getresetTokenExpiry } from "@/lib/auth-utils";
import { verificationEmailTemplate } from "@/lib/email-templates";
import { sendEmail } from "@/lib/send-email";

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as { email?: string; role?: string };
        const email = body?.email;
        const role = body?.role || "student";

        if (!email) {
            return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
        }

        const db = getDb();
        const host = req.headers.get("host");
        const protocol = host?.includes("localhost") ? "http" : "https";

        let userName = "User";

        if (role === "student") {
            const student = await db.student.findUnique({ where: { email } });
            if (!student) {
                return NextResponse.json({ success: false, message: "Account not found" }, { status: 404 });
            }
            if (student.isEmailVerified) {
                return NextResponse.json({ success: false, message: "Account already verified" }, { status: 400 });
            }
            if (student.lastOtpSentAt) {
                const diffInSeconds = Math.floor((new Date().getTime() - student.lastOtpSentAt.getTime()) / 1000);
                if (diffInSeconds < 60) {
                    return NextResponse.json({ success: false, message: "Please wait a minute before requesting again" }, { status: 429 });
                }
            }

            userName = student.name;
            const newToken = generateVerificationToken();
            const newExpiry = getresetTokenExpiry();

            await db.student.update({
                where: { email },
                data: {
                    emailVerificationToken: newToken,
                    emailVerificationTokenExpiry: newExpiry,
                    lastOtpSentAt: new Date()
                }
            });

            const verificationLink = `${protocol}://${host}/verify-email?token=${newToken}&email=${email}&role=student`;
            await sendEmail({
                to: email,
                subject: "Verify Your Email - RGI TnP Portal",
                html: verificationEmailTemplate(userName, verificationLink),
            });

        } else if (role === "external_student") {
            const extStudent = await db.externalStudent.findUnique({ where: { email } });
            if (!extStudent) {
                return NextResponse.json({ success: false, message: "Account not found" }, { status: 404 });
            }
            if (extStudent.isVerified) {
                return NextResponse.json({ success: false, message: "Account already verified" }, { status: 400 });
            }

            userName = extStudent.name;
            const newToken = generateVerificationToken();
            const newExpiry = getresetTokenExpiry();

            await db.externalStudent.update({
                where: { email },
                data: {
                    emailVerificationToken: newToken,
                    emailVerificationTokenExpiry: newExpiry,
                }
            });

            const verificationLink = `${protocol}://${host}/verify-email?token=${newToken}&email=${email}&role=external_student`;
            await sendEmail({
                to: email,
                subject: "Verify Your Email - RGI TnP Portal",
                html: verificationEmailTemplate(userName, verificationLink),
            });

        } else if (role === "alumni") {
            const alumni = await db.alumni.findUnique({ where: { personalEmail: email } });
            if (!alumni) {
                return NextResponse.json({ success: false, message: "Account not found" }, { status: 404 });
            }
            if (alumni.isVerified) {
                return NextResponse.json({ success: false, message: "Account already verified" }, { status: 400 });
            }

            userName = alumni.name;
            const newToken = generateVerificationToken();
            const newExpiry = getresetTokenExpiry();

            await db.alumni.update({
                where: { personalEmail: email },
                data: {
                    emailVerificationToken: newToken,
                    emailVerificationTokenExpiry: newExpiry,
                }
            });

            const verificationLink = `${protocol}://${host}/verify-email?token=${newToken}&email=${email}&role=alumni`;
            await sendEmail({
                to: email,
                subject: "Verify Your Email - RGI TnP Portal",
                html: verificationEmailTemplate(userName, verificationLink),
            });

        } else {
            return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: "Verification link sent successfully" }, { status: 200 });

    } catch (error: any) {
        console.error("Error resending verification:", error);
        return NextResponse.json({ success: false, message: "Failed to resend verification email" }, { status: 500 });
    }
}