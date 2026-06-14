import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "../src/lib/schema";
import { sql, eq, and, or, inArray, asc, desc, gte, lte, gt, lt } from "drizzle-orm";

function buildWhere(table: any, whereObj: any): any {
    if (!whereObj) return undefined;
    const conditions: any[] = [];
    for (const [k, v] of Object.entries(whereObj)) {
        if (k === 'OR' && Array.isArray(v)) {
            conditions.push(or(...v.map(cond => buildWhere(table, cond))));
        } else if (k === 'AND' && Array.isArray(v)) {
            conditions.push(and(...v.map(cond => buildWhere(table, cond))));
        } else if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
            if ('in' in v) conditions.push(inArray(table[k], v.in as any[]));
            if ('gte' in v) conditions.push(gte(table[k], v.gte));
            if ('lte' in v) conditions.push(lte(table[k], v.lte));
            if ('gt' in v) conditions.push(gt(table[k], v.gt));
            if ('lt' in v) conditions.push(lt(table[k], v.lt));
            if ('not' in v) conditions.push(sql`${table[k]} != ${v.not}`);
            if ('contains' in v) conditions.push(sql`${table[k]} LIKE ${'%' + v.contains + '%'}`);
        } else {
            conditions.push(eq(table[k], v));
        }
    }
    if (conditions.length === 0) return undefined;
    return conditions.length === 1 ? conditions[0] : and(...conditions);
}

function convertOrderBy(table: any, orderBy: any): any {
    if (!orderBy) return undefined;
    if (Array.isArray(orderBy)) {
        return orderBy.map(o => convertOrderBy(table, o)).flat();
    }
    const result: any[] = [];
    for (const [k, v] of Object.entries(orderBy)) {
        if (v === 'asc') result.push(asc(table[k]));
        if (v === 'desc') result.push(desc(table[k]));
    }
    return result;
}

const client = createClient({ url: "file:test.db" });
const db = drizzle(client, { schema });

class PrismaModelProxy {
    constructor(private db: any, private modelName: string, private table: any) {}

    async testFindMany(args: any) {
        const queryArgs: any = {};
        if (args?.where) queryArgs.where = buildWhere(this.table, args.where);
        if (args?.include) queryArgs.with = args.include;
        if (args?.orderBy) queryArgs.orderBy = convertOrderBy(this.table, args.orderBy);
        if (args?.take) queryArgs.limit = args.take;
        if (args?.skip) queryArgs.offset = args.skip;
        if (args?.select) queryArgs.columns = args.select;

        // return this.db.query[this.modelName].findMany(queryArgs);
        console.log("findMany queryArgs:", JSON.stringify(queryArgs));
        try {
            return await this.db.query[this.modelName].findMany(queryArgs);
        } catch (e) {
            console.error("findMany error:", e);
        }
    }

    async testCount(args: any) {
        try {
            const where = buildWhere(this.table, args?.where);
            let q = this.db.select({ count: sql<number>`count(*)` }).from(this.table);
            if (where) q = q.where(where);
            return await q;
        } catch (e) {
            console.error("count error:", e);
        }
    }
}

const proxy = new PrismaModelProxy(db, "memory", schema.memory);

async function run() {
    console.log("Testing memory.findMany...");
    await proxy.testFindMany({
        where: { status: "approved" },
        orderBy: { createdAt: "desc" },
        take: 200,
        skip: 0,
    });

    console.log("Testing memory.count...");
    await proxy.testCount({
        where: { status: "approved" }
    });
    console.log("Done");
}

run();
