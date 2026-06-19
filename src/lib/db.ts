import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";
import { eq, inArray, and, or, asc, desc, gte, lte, gt, lt, sql, getTableColumns } from "drizzle-orm";

function serializeData(table: any, data: any): any {
    if (!data || typeof data !== 'object') return data;
    
    const columns = getTableColumns(table);
    const serialized: any = {};
    
    for (const [key, val] of Object.entries(data)) {
        if (val === undefined) {
            serialized[key] = val;
            continue;
        }
        
        const column = columns[key];
        let mapped = val;
        
        // Try column's own mapToDriverValue first
        if (column && column.mapToDriverValue) {
            mapped = column.mapToDriverValue(val);
        }
        
        // If the result is still a Date object (e.g. text columns don't convert Dates),
        // convert it to an ISO string so D1 doesn't choke on the object type.
        if (mapped instanceof Date) {
            mapped = mapped.toISOString();
        }
        
        serialized[key] = mapped;
    }
    
    return serialized;
}

function buildWhere(table: any, whereObj: any): any {
    if (!whereObj) return undefined;
    const conditions: any[] = [];
    const columns = getTableColumns(table);
    for (const [k, v] of Object.entries(whereObj)) {
        const column = columns[k];
        const serialize = (val: any) => {
            let mapped = val;
            if (column && column.mapToDriverValue && val !== undefined) mapped = column.mapToDriverValue(val);
            if (mapped instanceof Date) mapped = mapped.toISOString();
            return mapped;
        };

        if (k === 'OR' && Array.isArray(v)) {
            conditions.push(or(...v.map(cond => buildWhere(table, cond))));
        } else if (k === 'AND' && Array.isArray(v)) {
            conditions.push(and(...v.map(cond => buildWhere(table, cond))));
        } else if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
            if ('in' in v) conditions.push(inArray(table[k], (v.in as any[]).map(serialize)));
            if ('gte' in v) conditions.push(gte(table[k], serialize(v.gte)));
            if ('lte' in v) conditions.push(lte(table[k], serialize(v.lte)));
            if ('gt' in v) conditions.push(gt(table[k], serialize(v.gt)));
            if ('lt' in v) conditions.push(lt(table[k], serialize(v.lt)));
            if ('not' in v) conditions.push(sql`${table[k]} != ${serialize(v.not)}`);
            if ('contains' in v) conditions.push(sql`${table[k]} LIKE ${'%' + v.contains + '%'}`);
        } else {
            conditions.push(eq(table[k], serialize(v)));
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

function parseRelationArgs(v: any) {
    if (v === true) return true;
    const relArgs: any = {};
    if (v.take) relArgs.limit = v.take;
    if (v.skip) relArgs.offset = v.skip;
    
    if (v.orderBy) {
        relArgs.orderBy = (fields: any, ops: any) => {
            const { asc, desc } = ops;
            const result: any[] = [];
            const process = (obj: any) => {
                for (const [k, val] of Object.entries(obj)) {
                    if (val === 'asc') result.push(asc(fields[k]));
                    if (val === 'desc') result.push(desc(fields[k]));
                }
            };
            if (Array.isArray(v.orderBy)) {
                v.orderBy.forEach(process);
            } else {
                process(v.orderBy);
            }
            return result;
        };
    }

    if (v.where) {
        relArgs.where = (fields: any, ops: any) => {
            function build(whereObj: any): any {
                if (!whereObj) return undefined;
                const conditions: any[] = [];
                for (const [k, val] of Object.entries(whereObj)) {
                    if (k === 'OR' && Array.isArray(val)) {
                        conditions.push(ops.or(...val.map(build)));
                    } else if (k === 'AND' && Array.isArray(val)) {
                        conditions.push(ops.and(...val.map(build)));
                    } else if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
                        if ('in' in val) conditions.push(ops.inArray(fields[k], val.in as any[]));
                        if ('gte' in val) conditions.push(ops.gte(fields[k], val.gte));
                        if ('lte' in val) conditions.push(ops.lte(fields[k], val.lte));
                        if ('gt' in val) conditions.push(ops.gt(fields[k], val.gt));
                        if ('lt' in val) conditions.push(ops.lt(fields[k], val.lt));
                    } else {
                        conditions.push(ops.eq(fields[k], val));
                    }
                }
                return conditions.length === 0 ? undefined : (conditions.length === 1 ? conditions[0] : ops.and(...conditions));
            }
            return build(v.where);
        };
    }

    if (v.select) {
        const parsed = parseSelect(v.select);
        if (parsed.columns) relArgs.columns = parsed.columns;
        if (parsed.withRelations) relArgs.with = parsed.withRelations;
    }

    if (v.include) {
        const parsed = parseSelect(v.include);
        if (parsed.withRelations) relArgs.with = parsed.withRelations;
    }

    return Object.keys(relArgs).length > 0 ? relArgs : true;
}

function parseSelect(selectObj: any) {
    const columns: any = {};
    const withRelations: any = {};
    let hasColumns = false;
    let hasRelations = false;

    for (const [k, v] of Object.entries(selectObj)) {
        if (v === true) {
            columns[k] = true;
            hasColumns = true;
        } else if (typeof v === 'object' && v !== null) {
            withRelations[k] = parseRelationArgs(v);
            hasRelations = true;
        }
    }
    
    return {
        columns: hasColumns ? columns : undefined,
        withRelations: hasRelations ? withRelations : undefined
    };
}

class PrismaModelProxy {
    constructor(private db: any, private modelName: string, private table: any) {}

    async findUnique(args: any) {
        return this.findFirst(args);
    }

    async findFirst(args: any) {
        const queryArgs: any = {};
        if (args?.where) queryArgs.where = buildWhere(this.table, args.where);
        if (args?.orderBy) queryArgs.orderBy = convertOrderBy(this.table, args.orderBy);
        
        let withRelations: any = {};
        
        if (args?.include) {
            const parsed = parseSelect(args.include);
            if (parsed.withRelations) Object.assign(withRelations, parsed.withRelations);
        }
        
        if (args?.select) {
            const parsed = parseSelect(args.select);
            if (parsed.columns) queryArgs.columns = parsed.columns;
            if (parsed.withRelations) Object.assign(withRelations, parsed.withRelations);
        }

        if (Object.keys(withRelations).length > 0) {
            queryArgs.with = withRelations;
        }
        
        return this.db.query[this.modelName].findFirst(queryArgs);
    }

    async findMany(args: any) {
        const queryArgs: any = {};
        if (args?.where) queryArgs.where = buildWhere(this.table, args.where);
        if (args?.orderBy) queryArgs.orderBy = convertOrderBy(this.table, args.orderBy);
        if (args?.take) queryArgs.limit = args.take;
        if (args?.skip) queryArgs.offset = args.skip;
        
        let withRelations: any = {};
        
        if (args?.include) {
            const parsed = parseSelect(args.include);
            if (parsed.withRelations) Object.assign(withRelations, parsed.withRelations);
        }
        
        if (args?.select) {
            const parsed = parseSelect(args.select);
            if (parsed.columns) queryArgs.columns = parsed.columns;
            if (parsed.withRelations) Object.assign(withRelations, parsed.withRelations);
        }

        if (Object.keys(withRelations).length > 0) {
            queryArgs.with = withRelations;
        }

        return this.db.query[this.modelName].findMany(queryArgs);
    }

    async create(args: any) {
        const serializedData = serializeData(this.table, args.data);
        const result = await this.db.insert(this.table).values(serializedData).returning();
        return result[0];
    }

    async createMany(args: any) {
        const data = Array.isArray(args.data) ? args.data : [args.data];
        if (data.length === 0) return { count: 0 };
        const serializedData = data.map(d => serializeData(this.table, d));
        await this.db.insert(this.table).values(serializedData);
        return { count: data.length };
    }

    async update(args: any) {
        const serializedData = serializeData(this.table, args.data);
        const where = buildWhere(this.table, args.where);
        const result = await this.db.update(this.table).set(serializedData).where(where).returning();
        return result[0];
    }

    async updateMany(args: any) {
        const serializedData = serializeData(this.table, args.data);
        const where = buildWhere(this.table, args.where);
        await this.db.update(this.table).set(serializedData).where(where);
        return { count: 1 };
    }

    async delete(args: any) {
        const where = buildWhere(this.table, args.where);
        const result = await this.db.delete(this.table).where(where).returning();
        return result[0];
    }

    async deleteMany(args: any) {
        const where = buildWhere(this.table, args.where);
        await this.db.delete(this.table).where(where);
        return { count: 1 };
    }

    async count(args: any) {
        const where = buildWhere(this.table, args?.where);
        let q = this.db.select({ count: sql<number>`count(*)` }).from(this.table);
        if (where) q = q.where(where);
        const res = await q;
        return res[0].count;
    }
}

export function getDb(): any {
    const { env } = getCloudflareContext();

    if (!env.DB) {
        throw new Error("Cloudflare D1 binding DB is not configured");
    }

    if (!(globalThis as any).__db) {
        const drizzleDb = drizzle(env.DB, { schema });
        
        const proxyDb: any = {
            $transaction: async (queries: any[]) => {
                const results: any[] = [];
                for (const q of queries) {
                    results.push(await q);
                }
                return results;
            },
            $queryRaw: async (strings: TemplateStringsArray, ...values: any[]) => {
                let query = strings[0];
                for (let i = 1; i < strings.length; i++) {
                    query += `?` + strings[i];
                }
                const { results } = await env.DB.prepare(query).bind(...values).all();
                return results;
            },
            $executeRaw: async (strings: TemplateStringsArray, ...values: any[]) => {
                let query = strings[0];
                for (let i = 1; i < strings.length; i++) {
                    query += `?` + strings[i];
                }
                const { meta } = await env.DB.prepare(query).bind(...values).run();
                return meta.changes;
            },
            $executeRawUnsafe: async (query: string, ...values: any[]) => {
                const { meta } = await env.DB.prepare(query).bind(...values).run();
                return meta.changes;
            }
        };

        for (const key of Object.keys(schema)) {
            if (key !== "default" && !key.endsWith("Relations")) {
                proxyDb[key] = new PrismaModelProxy(drizzleDb, key, (schema as any)[key]);
            }
        }
        
        (globalThis as any).__db = proxyDb;
    }

    return (globalThis as any).__db;
}
