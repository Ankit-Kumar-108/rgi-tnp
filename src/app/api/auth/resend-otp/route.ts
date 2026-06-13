export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { generateVerificationToken, getresetTokenExpiry } from "@/lib/auth-utils";
import { verificationEmailTemplate } from "@/lib/email-templates";
import { NotificationService } from "@/lib/notification-service";

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
            userName = student.name;
            const newToken = generateVerificationToken();
            const newExpiry = getresetTokenExpiry();

            await db.student.update({
                where: { email },
                data: {
                    emailVerificationToken: newToken,
                    emailVerificationTokenExpiry: newExpiry,
                }
            });

            const verificationLink = `${protocol}://${host}/verify-email?token=${newToken}&email=${email}&role=student`;
            try {
                await NotificationService.notifyUser({
                    email: {
                        to: email,
                        subject: "Verify Your Email - RGI Training and Placement Portal",
                        html: verificationEmailTemplate(userName, verificationLink),
                        template: "verificationEmailTemplate",
                        approvalId: student.id,
                        approvalType: "Student",
                        actionType: "verification",
                    },
                    triggeredBy: "System",
                    recipient: { id: student.id, type: "student" },
                });
                return NextResponse.json({ success: true, message: "Verification link sent successfully" }, { status: 200 });
            } catch (error) {
                console.error("Error sending verification email to student:", error);
                return NextResponse.json({ success: false, message: "Failed to resend verification email" }, { status: 500 });
            }

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
            try {
                await NotificationService.notifyUser({
                    email: {
                        to: email,
                        subject: "Verify Your Email - RGI Training and Placement Portal",
                        html: verificationEmailTemplate(userName, verificationLink),
                        template: "verificationEmailTemplate",
                        approvalId: extStudent.id,
                        approvalType: "external_student",
                        actionType: "verification",
                    },
                    triggeredBy: "System",
                    recipient: { id: extStudent.id, type: "external_student" },
                });
                return NextResponse.json({ success: true, message: "Verification link sent successfully" }, { status: 200 });
            } catch (error) {
                console.error("Error sending verification email to external student:", error);
                return NextResponse.json({ success: false, message: "Failed to resend verification email" }, { status: 500 });
            }

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
            try {
                await NotificationService.notifyUser({
                    email: {
                        to: email,
                        subject: "Verify Your Email - RGI TnP Portal",
                        html: verificationEmailTemplate(userName, verificationLink),
                        template: "verificationEmailTemplate",
                        approvalId: alumni.id,
                        approvalType: "alumni",
                        actionType: "verification",
                    },
                    triggeredBy: "System",
                    recipient: { id: alumni.id, type: "alumni" },
                });
                return NextResponse.json({ success: true, message: "Verification link sent successfully" }, { status: 200 });
            } catch (error) {
                console.error("Error sending verification email to alumni:", error);
                return NextResponse.json({ success: false, message: "Failed to resend verification email" }, { status: 500 });
            }

        } else {
            return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 });
        }

    } catch (error: any) {
        console.error("Error resending verification:", error);
        return NextResponse.json({ success: false, message: "Failed to resend verification email" }, { status: 500 });
    }
}