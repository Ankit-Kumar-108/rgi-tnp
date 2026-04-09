// import { NextResponse, NextRequest } from "next/server";
// import { getDb } from "@/lib/db";

// export async function GET(req: NextRequest) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const parsedLimit = parseInt(searchParams.get("limit") || "200", 10)
//         const parsedPage = parseInt(searchParams.get("page") || "1", 10)

//         const limit = isNaN(parsedLimit) ? 200 : Math.min(200, Math.max(1, parsedLimit))
//         const page = isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
//         const skip = (page - 1) * limit;

//         const db = getDb();
//         const where = { status: "approved" }
//         const [feedback, totalCount] = await Promise.all([
//             db.studentFeedback.findMany({
//                 where,
//                 orderBy: { createdAt: "desc" },
//                 take: limit,
//                 skip: skip,
//             }),
//             db.studentFeedback.count({ where })
//         ])
//         return NextResponse.json({ success: true, feedback, totalCount });
//     } catch (error: any) {
//         console.error("Error fetching feedback:", error);
//         return NextResponse.json({ success: false, message: "Failed to fetch feedback" }, { status: 500 });
//     }
// }