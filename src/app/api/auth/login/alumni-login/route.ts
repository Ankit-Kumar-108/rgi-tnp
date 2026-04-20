export const runtime = 'edge';
import { NextResponse, NextRequest } from "next/server";
import { alumniLoginSchema } from "@/lib/validations/alumni";
import { getDb } from "@/lib/db";
import { verifyPassword } from "@/lib/auth-utils";
import { signAuthToken } from "@/lib/auth-jwt";

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
            return NextResponse.json({ success: false, message: "Check Your Email (Not Found!) " }, { status: 401 });
        }

        const passwordMatch = await verifyPassword(
            validatedData.password, 
            alumni.passwordHash
        );
        
        if (!passwordMatch) {
            return NextResponse.json({ success: false, message: "Check Your Password" }, { status: 401 });
        }

        if (!alumni.isVerified) {
             return NextResponse.json({ success: false, message: "Your email is not verified. Please check your inbox for the verification link." }, { status: 403 });
         }

        const token = await signAuthToken({ 
            email: trimmedEmail, 
            enrollmentNumber: alumni.enrollmentNumber, 
            id: alumni.id,
            role: "alumni",
        });

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
