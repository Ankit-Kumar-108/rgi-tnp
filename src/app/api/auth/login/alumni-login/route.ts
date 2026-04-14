export const runtime = 'edge';
import { NextResponse, NextRequest } from "next/server";
import { alumniLoginSchema } from "@/lib/validations/alumni";
import { getDb } from "@/lib/db";
import { verifyPassword } from "@/lib/auth-utils";
import * as jose from "jose";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validatedData = alumniLoginSchema.parse(body);

        // Trim email to remove extra spaces
        const trimmedEmail = validatedData.personalEmail.trim();

        const db = getDb();
        
        const alumni = await db.alumni.findUnique({
            where: { personalEmail: trimmedEmail }
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

        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const token = await new jose.SignJWT({ 
            email: trimmedEmail, 
            enrollmentNumber: alumni.enrollmentNumber, 
            id: alumni.id 
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d')
            .sign(secret);

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
