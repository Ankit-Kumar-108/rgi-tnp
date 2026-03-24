export const runtime = 'edge';
import { NextResponse, NextRequest } from "next/server";
import { loginSchema } from "@/lib/validations/student";
import { getDb } from "@/lib/db";
import { verifyPassword } from "@/lib/auth-utils";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()  
        const validatedData = loginSchema.parse(body);

        const db = getDb()
        
        const student = await db.student.findUnique({
            where: { email: validatedData.email }
        })
        if (!student) {
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
        }

        const passwordMatch = await verifyPassword(
            validatedData.password, 
            student.passwordHash);
        if (!passwordMatch) {
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
        }

        const token = jwt.sign(
            { email: student.email, enrollmentNumber: student.enrollmentNumber },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        )

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