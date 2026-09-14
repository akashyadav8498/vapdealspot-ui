import type { ImportRow, ValidatedRow, ValidationIssue } from "./types";

const isValidUrl = (urlStr: string) => {
  try {
    new URL(urlStr);
    return true;
  } catch (e) {
    return false;
  }
};

export const validateImportRow = (row: ImportRow, rowIndex: number): ValidatedRow => {
  const issues: ValidationIssue[] = [];

  if (!row.productKey || typeof row.productKey !== "string" || row.productKey.trim() === "") {
    issues.push({ field: "productKey", message: "productKey is required", severity: "error" });
  }

  const requiredStringFields: (keyof ImportRow)[] = ["name", "brand", "category", "description", "merchant"];

  requiredStringFields.forEach((field) => {
    const val = row[field];
    if (typeof val !== "string" || val.trim() === "") {
      issues.push({ field, message: `Missing required field: ${field}`, severity: "error" });
    }
  });

  const price = Number(row.price);
  if (isNaN(price) || price <= 0) {
    issues.push({ field: "price", message: "Price must be a valid positive number", severity: "error" });
  }

  const urlFields: (keyof ImportRow)[] = ["affiliateUrl", "image"];
  urlFields.forEach((field) => {
    const val = row[field];
    if (typeof val !== "string" || val.trim() === "") {
      issues.push({ field, message: `Missing required field: ${field}`, severity: "error" });
    } else if (!isValidUrl(val)) {
      issues.push({ field, message: `Must be a valid URL: ${field}`, severity: "error" });
    }
  });

  if (row.status !== "active" && row.status !== "inactive") {
    issues.push({ field: "status", message: 'Status must be "active" or "inactive"', severity: "error" });
  }

  if (row.availability !== "in_stock" && row.availability !== "out_of_stock" && row.availability !== "unknown") {
    issues.push({ field: "availability", message: 'Availability must be "in_stock", "out_of_stock", or "unknown"', severity: "error" });
  }

  return {
    rowNumber: rowIndex + 2, // Excel rows are 1-indexed, and row 1 is header
    data: row,
    issues,
  };
};

export const validateImportRows = (rows: ImportRow[]): ValidatedRow[] => {
  const rowValidations = rows.map((row, index) => validateImportRow(row, index));
  
  const groups = new Map<string, ValidatedRow[]>();

  rowValidations.forEach((valRow) => {
    const key = valRow.data.productKey;
    if (key && typeof key === "string" && key.trim() !== "") {
      const normalizedKey = key.trim().toLowerCase();
      if (!groups.has(normalizedKey)) {
        groups.set(normalizedKey, []);
      }
      groups.get(normalizedKey)!.push(valRow);
    }
  });

  groups.forEach((groupRows) => {
    if (groupRows.length === 0) return;

    // The first row establishes the reference for product-level fields
    const referenceRow = groupRows[0].data;
    const referenceFields = ["name", "brand", "category", "description", "image", "status"] as const;

    const seenMerchants = new Set<string>();

    groupRows.forEach((valRow, index) => {
      const row = valRow.data;
      
      // Conflict checking
      if (index > 0) {
        referenceFields.forEach((field) => {
          if (row[field] !== referenceRow[field]) {
            valRow.issues.push({ field, message: `Conflicting product field: ${field} differs from group reference`, severity: "error" });
          }
        });
      }

      // Duplicate merchant checking
      if (row.merchant && typeof row.merchant === "string" && row.merchant.trim() !== "") {
        const normalizedMerchant = row.merchant.trim().toLowerCase();
        if (seenMerchants.has(normalizedMerchant)) {
          valRow.issues.push({ field: "merchant", message: "Duplicate merchant within product group", severity: "error" });
        } else {
          seenMerchants.add(normalizedMerchant);
        }
      }
    });

    const validOfferCount = groupRows.filter(vr => !vr.issues.some(issue => issue.severity === "error")).length;
    
    if (validOfferCount === 0) {
      // Append a group-level error to the first row to summarize the block without repeating on all rows
      groupRows[0].issues.push({ 
        message: "Product group has zero valid offers and cannot be imported safely.", 
        severity: "error" 
      });
    }
  });

  return rowValidations;
};
