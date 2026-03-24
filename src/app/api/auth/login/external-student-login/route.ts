import { NextResponse, NextRequest } from "next/server";
import { externalStudentLoginSchema } from "@/lib/validations/external-student";
import { getDb } from "@/lib/db";
import { verifyPassword } from "@/lib/auth-utils";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validatedData = externalStudentLoginSchema.parse(body);

        const db = getDb();
        
        const externalStudent = await db.externalStudent.findUnique({
            where: { email: validatedData.email }
        });

        if (!externalStudent) {
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
        }

        const passwordMatch = await verifyPassword(
            validatedData.password, 
            externalStudent.passwordHash
        );
        
        if (!passwordMatch) {
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
        }
        
        // Optionally check if they are screened
        // if (!externalStudent.isScreened) {
        //     return NextResponse.json({ success: false, message: "Your profile is pending admin screening" }, { status: 403 });
        // }

        const token = jwt.sign(
            { email: externalStudent.email, id: externalStudent.id, enrollmentNumber: externalStudent.enrollmentNumber },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        return NextResponse.json({ 
            success: true, 
            message: "Login successful", 
            token: token,
            student: {
                id: externalStudent.id,
                name: externalStudent.name,
                email: externalStudent.email,
                isScreened: externalStudent.isScreened,
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
