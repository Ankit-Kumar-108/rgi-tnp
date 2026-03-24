import { NextResponse, NextRequest } from "next/server";
import { alumniLoginSchema } from "@/lib/validations/alumni";
import { getDb } from "@/lib/db";
import { verifyPassword } from "@/lib/auth-utils";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validatedData = alumniLoginSchema.parse(body);

        const db = getDb();
        
        const alumni = await db.alumni.findUnique({
            where: { personalEmail: validatedData.personalEmail }
        });

        if (!alumni) {
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
        }

        const passwordMatch = await verifyPassword(
            validatedData.password, 
            alumni.passwordHash
        );
        
        if (!passwordMatch) {
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
        }

        const token = jwt.sign(
            { email: alumni.personalEmail, enrollmentNumber: alumni.enrollmentNumber, id: alumni.id },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        return NextResponse.json({ 
            success: true, 
            message: "Login successful", 
            token: token,
            alumni: {
                id: alumni.id,
                name: alumni.name,
                personalEmail: alumni.personalEmail,
                enrollmentNumber: alumni.enrollmentNumber,
            }
         }, { status: 200 });

    } catch (error: any) {
        console.error("Error in Alumni Login:", error);
        if (error.name === "ZodError") {
            return NextResponse.json({ success: false, message: "Validation failed", error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
