import { NextRequest, NextResponse } from "next/server";
import { otpSchema } from "@/lib/validations/student";
import { getDb } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const validatedData = otpSchema.parse(body);

        const db = getDb();

        const student = await db.student.findUnique({
            where: { email: validatedData.email }
        })

        if (!student) {
            return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
        }

        if (student.isEmailVerified) {
            return NextResponse.json({ success: false, message: "Account already verified" }, { status: 400 });
        }

        if (!student.emailVerificationTokenExpiry || new Date() > student.emailVerificationTokenExpiry) {
            return NextResponse.json({ success: false, message: "OTP expired. Please request a new one." }, { status: 400 });
        }

        if (student.emailVerificationToken !== validatedData.otp) {
            await db.student.update({
                where: { email: validatedData.email },
                data: { otpAttempts: student.otpAttempts + 1 }
            })
            if (student.otpAttempts >= 3) {
                return NextResponse.json({ success: false, message: "Too many failed OTP attempts. Please request a new one." }, { status: 400 });
            }
            return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
        }

        const updatedStudent = await db.student.update({
            where: { email: validatedData.email },
            data: {
                isEmailVerified: true,
                isVerified: true,
                emailVerificationToken: null,
                emailVerificationTokenExpiry: null,
                otpAttempts: 0
            }
        })

        const token = jwt.sign(
            { email: updatedStudent.email, enrollmentNumber: updatedStudent.enrollmentNumber },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        )

        return NextResponse.json({
            success: true,
            message: "Email verified successfully",
            token: token,
            student: {
                name: updatedStudent.name,
                email: updatedStudent.email,
                enrollmentNumber: updatedStudent.enrollmentNumber
            }
        },
            {

                status: 200
            }
        )
    } catch (error: any) {
        console.error("OTP Verification Error:", error)
        if (error.name === "ZodError") {
            return NextResponse.json(
                { success: false, message: "Validation failed", errors: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}