export const runtime = 'edge';
import { NextResponse, NextRequest } from "next/server";
import { externalStudentLoginSchema } from "@/lib/validations/external-student";
import { getDb } from "@/lib/db";
import { verifyPassword } from "@/lib/auth-utils";
import * as jose from "jose";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validatedData = externalStudentLoginSchema.parse(body);

        // Trim email to remove extra spaces
        const trimmedEmail = validatedData.email.trim();

        const db = getDb();
        
        const externalStudent = await db.externalStudent.findUnique({
            where: { email: trimmedEmail }
        });

        if (!externalStudent) {
            return NextResponse.json({ success: false, message: "Check email and try again" }, { status: 401 });
        }

        const passwordMatch = await verifyPassword(
            validatedData.password, 
            externalStudent.passwordHash
        );
        
        if (!passwordMatch) {
            return NextResponse.json({ success: false, message: "Check password and try again" }, { status: 401 });
        }
        
        if (!externalStudent.isVerified) {
             return NextResponse.json({ success: false, message: "Your email is not verified. Please check your inbox for the verification link." }, { status: 403 });
         }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const token = await new jose.SignJWT({ 
            email: externalStudent.email, 
            id: externalStudent.id, 
            enrollmentNumber: externalStudent.enrollmentNumber 
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d')
            .sign(secret);

        return NextResponse.json({ 
            success: true, 
            message: "Login successful", 
            token: token,
            student: {
                id: externalStudent.id,
                name: externalStudent.name,
                email: externalStudent.email,
                isVerified: externalStudent.isVerified,
            }
         }, { status: 200 });

    } catch (error: any) {
        console.error("Error in External Student Login:", error);
        if (error.name === "ZodError") {
            return NextResponse.json({ success: false, message: "Validation failed", error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
