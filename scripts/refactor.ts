import { Project, SyntaxKind, CallExpression, ObjectLiteralExpression, PropertyAssignment } from "ts-morph";
import * as path from "path";

const project = new Project();
project.addSourceFilesAtPaths("src/app/api/**/*.ts");
project.addSourceFilesAtPaths("src/lib/**/*.ts");

const files = project.getSourceFiles();

let changedFilesCount = 0;

let globalChanged = true;
while (globalChanged) {
  globalChanged = false;
  for (const file of project.getSourceFiles()) {
    let changed = false;

    // Find all property access expressions like `db.student.findUnique`
    const propertyAccesses = file.getDescendantsOfKind(SyntaxKind.PropertyAccessExpression);

    for (const access of propertyAccesses) {
      if (access.wasForgotten()) continue;
      const text = access.getText();
      if (text.startsWith("db.") && text.split(".").length === 3) {
        const parts = text.split(".");
        const model = parts[1];
        const method = parts[2];

        const callExpr = access.getParentIfKind(SyntaxKind.CallExpression);
        if (!callExpr) continue;

        const args = callExpr.getArguments();
        const firstArg = args[0] as ObjectLiteralExpression;

        if (method === "findUnique" || method === "findFirst") {
          access.replaceWithText(`db.query.${model}.findFirst`);
          if (firstArg && firstArg.getKind() === SyntaxKind.ObjectLiteralExpression) {
            const whereProp = firstArg.getProperty("where") as PropertyAssignment;
            if (whereProp && whereProp.getInitializer()?.getKind() === SyntaxKind.ObjectLiteralExpression) {
              const whereObj = whereProp.getInitializer() as ObjectLiteralExpression;
              const props = whereObj.getProperties();
              if (props.length === 1 && props[0].getKind() === SyntaxKind.PropertyAssignment) {
                const p = props[0] as PropertyAssignment;
                const name = p.getName();
                const val = p.getInitializer()?.getText();
                whereProp.setInitializer(`eq(schema.${model}.${name}, ${val})`);
              }
            }
          }
          changed = true;
          globalChanged = true;
          break; // restart parsing
        } else if (method === "findMany") {
          access.replaceWithText(`db.query.${model}.findMany`);
          if (firstArg && firstArg.getKind() === SyntaxKind.ObjectLiteralExpression) {
              const whereProp = firstArg.getProperty("where") as PropertyAssignment;
              if (whereProp && whereProp.getInitializer()?.getKind() === SyntaxKind.ObjectLiteralExpression) {
                  const whereObj = whereProp.getInitializer() as ObjectLiteralExpression;
                  const props = whereObj.getProperties();
                  if (props.length === 1 && props[0].getKind() === SyntaxKind.PropertyAssignment) {
                  const p = props[0] as PropertyAssignment;
                  const name = p.getName();
                  const val = p.getInitializer()?.getText();
                  whereProp.setInitializer(`eq(schema.${model}.${name}, ${val})`);
                  }
              }
          }
          changed = true;
          globalChanged = true;
          break;
        } else if (method === "create") {
          if (firstArg && firstArg.getKind() === SyntaxKind.ObjectLiteralExpression) {
              const dataProp = firstArg.getProperty("data") as PropertyAssignment;
              if (dataProp) {
                  callExpr.replaceWithText(`db.insert(schema.${model}).values(${dataProp.getInitializer()?.getText()}).returning().then(r => r[0])`);
                  changed = true;
                  globalChanged = true;
                  break;
              }
          }
        } else if (method === "update") {
          if (firstArg && firstArg.getKind() === SyntaxKind.ObjectLiteralExpression) {
              const whereProp = firstArg.getProperty("where") as PropertyAssignment;
              const dataProp = firstArg.getProperty("data") as PropertyAssignment;
              if (whereProp && dataProp && whereProp.getInitializer()?.getKind() === SyntaxKind.ObjectLiteralExpression) {
                  const whereObj = whereProp.getInitializer() as ObjectLiteralExpression;
                  const props = whereObj.getProperties();
                  if (props.length === 1 && props[0].getKind() === SyntaxKind.PropertyAssignment) {
                      const p = props[0] as PropertyAssignment;
                      const name = p.getName();
                      const val = p.getInitializer()?.getText();
                      callExpr.replaceWithText(`db.update(schema.${model}).set(${dataProp.getInitializer()?.getText()}).where(eq(schema.${model}.${name}, ${val})).returning().then(r => r[0])`);
                      changed = true;
                      globalChanged = true;
                      break;
                  }
              }
          }
        } else if (method === "delete") {
          if (firstArg && firstArg.getKind() === SyntaxKind.ObjectLiteralExpression) {
              const whereProp = firstArg.getProperty("where") as PropertyAssignment;
              if (whereProp && whereProp.getInitializer()?.getKind() === SyntaxKind.ObjectLiteralExpression) {
                  const whereObj = whereProp.getInitializer() as ObjectLiteralExpression;
                  const props = whereObj.getProperties();
                  if (props.length === 1 && props[0].getKind() === SyntaxKind.PropertyAssignment) {
                      const p = props[0] as PropertyAssignment;
                      const name = p.getName();
                      const val = p.getInitializer()?.getText();
                      callExpr.replaceWithText(`db.delete(schema.${model}).where(eq(schema.${model}.${name}, ${val})).returning().then(r => r[0])`);
                      changed = true;
                      globalChanged = true;
                      break;
                  }
              }
          }
        }
      }
    }

    if (changed) {
      const imports = file.getImportDeclarations();
      const hasDrizzleOrm = imports.some(i => i.getModuleSpecifierValue() === "drizzle-orm");
      const hasSchema = imports.some(i => i.getModuleSpecifierValue() === "@/lib/schema");
      
      if (!hasDrizzleOrm) {
          file.addImportDeclaration({
              namedImports: ["eq", "and", "or", "desc", "asc", "inArray"],
              moduleSpecifier: "drizzle-orm"
          });
      } else {
          const drizzleImport = imports.find(i => i.getModuleSpecifierValue() === "drizzle-orm");
          if (drizzleImport) {
              const named = drizzleImport.getNamedImports().map(i => i.getName());
              if (!named.includes("eq")) drizzleImport.addNamedImport("eq");
              if (!named.includes("and")) drizzleImport.addNamedImport("and");
              if (!named.includes("or")) drizzleImport.addNamedImport("or");
              if (!named.includes("desc")) drizzleImport.addNamedImport("desc");
              if (!named.includes("inArray")) drizzleImport.addNamedImport("inArray");
          }
      }

      if (!hasSchema) {
          file.addImportDeclaration({
              namespaceImport: "schema",
              moduleSpecifier: "@/lib/schema"
          });
      }

      file.saveSync();
      changedFilesCount++;
      console.log(`Updated ${file.getFilePath()}`);
    }
  }
}


console.log(`Refactored ${changedFilesCount} files.`);
