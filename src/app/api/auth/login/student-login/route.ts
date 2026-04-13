export const runtime = 'edge';
import { NextResponse, NextRequest } from "next/server";
import { loginSchema } from "@/lib/validations/student";
import { getDb } from "@/lib/db";
import { verifyPassword } from "@/lib/auth-utils";
import * as jose from "jose";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()  
        const validatedData = loginSchema.parse(body);

        const db = getDb()
        
        const student = await db.student.findUnique({
            where: { email: validatedData.email }
        })
        if (!student) {
            return NextResponse.json({ success: false, message: "Check email and try again" }, { status: 401 });
        }

        const passwordMatch = await verifyPassword(
            validatedData.password, 
            student.passwordHash);
        if (!passwordMatch) {
            return NextResponse.json({ success: false, message: "Check password and try again" }, { status: 401 });
        }

        if(!student.isVerified) {
            return NextResponse.json({ success: false, message: "Your email is not verified. Please check your inbox for the verification link." }, { status: 403 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const token = await new jose.SignJWT({ 
            id: student.id,
            email: student.email, 
            enrollmentNumber: student.enrollmentNumber 
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d')
            .sign(secret);

        return NextResponse.json({ success: true, message: "Login successful", 
            token: token,
            student: {
                name: student.name,
                email: student.email,
                enrollmentNumber: student.enrollmentNumber,
                cgpa: student.cgpa,
                branch: student.branch,
            }
         }, { status: 200 });

    } catch (error: any) {
        console.error("Error in Student Login:", error)
        if (error.name === "ZodError") {
            return NextResponse.json({ success: false, message: "Validation failed", error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}