export const runtime = 'edge';
import { NextResponse, NextRequest } from "next/server";
import { recruiterLoginSchema } from "@/lib/validations/recruiter";
import { getDb } from "@/lib/db";
import { verifyPassword } from "@/lib/auth-utils";
import * as jose from "jose";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validatedData = recruiterLoginSchema.parse(body);

        const db = getDb();
        
        const recruiter = await db.recruiter.findUnique({
            where: { email: validatedData.email }
        });

        if (!recruiter) {
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
        }

        const passwordMatch = await verifyPassword(
            validatedData.password, 
            recruiter.passwordHash
        );
        
        if (!passwordMatch) {
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const token = await new jose.SignJWT({ 
            email: recruiter.email, 
            id: recruiter.id, 
            company: recruiter.company 
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d')
            .sign(secret);

        return NextResponse.json({ 
            success: true, 
            message: "Login successful", 
            token: token,
            recruiter: {
                id: recruiter.id,
                name: recruiter.name,
                email: recruiter.email,
                company: recruiter.company,
            }
         }, { status: 200 });

    } catch (error: any) {
        console.error("Error in Recruiter Login:", error);
        if (error.name === "ZodError") {
            return NextResponse.json({ success: false, message: "Validation failed", error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
