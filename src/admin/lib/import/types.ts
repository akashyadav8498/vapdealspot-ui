export type ImportRow = {
  productKey?: string;
  name?: string;
  brand?: string;
  category?: string;
  description?: string;
  price?: number | string;
  originalPrice?: number | string;
  merchant?: string;
  affiliateUrl?: string;
  image?: string;
  status?: string;
  availability?: string;
};

export type ValidationIssueSeverity = "error" | "warning";

export type ValidationIssue = {
  field?: keyof ImportRow | string;
  message: string;
  severity: ValidationIssueSeverity;
};

export type ValidatedRow = {
  rowNumber: number;
  data: ImportRow;
  issues: ValidationIssue[];
};

export type ImportResult = {
  total: number;
  valid: number;
  warnings: number;
  errors: number;
  fileWarnings: string[];
  rows: ValidatedRow[];
};
