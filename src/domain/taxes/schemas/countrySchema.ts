import { z } from 'zod';

export const taxBracketSchema = z.object({
  max: z.number().nullable(),
  rate: z.number().min(0).max(1),
});

export const incomeTaxSchema = z.object({
  type: z.enum(['progressive', 'flat']),
  brackets: z.array(taxBracketSchema).min(1),
});

// ===== Deductions =====
export const childDeductionRuleSchema = z.object({
  childIndex: z.union([z.number().positive(), z.literal('all')]),
  amount: z.number().nonnegative(),
});

export const incomeLimitSchema = z.object({
  amount: z.number().positive(),
  period: z.enum(['year', 'month']),
});

const perChildMonthlyDeductionSchema = z.object({
  type: z.literal('per_child_monthly'),
  incomeLimit: incomeLimitSchema.nullable(),
  rules: z.array(childDeductionRuleSchema),
});

const perChildYearDeductionSchema = z.object({
  type: z.literal('per_child_year'),
  incomeLimit: incomeLimitSchema.nullable(),
  rules: z.array(childDeductionRuleSchema),
});

const noChildrenDeductionSchema = z.object({
  type: z.literal('none'),
  incomeLimit: z.null(),
  rules: z.array(childDeductionRuleSchema).length(0),
});

export const childrenDeductionSchema = z.discriminatedUnion('type', [
  perChildMonthlyDeductionSchema,
  perChildYearDeductionSchema,
  noChildrenDeductionSchema,
]);

export const personalDeductionSchema = z.object({
  amount: z.number().nonnegative(),
});

export const deductionsSchema = z.object({
  personal: personalDeductionSchema,
  children: childrenDeductionSchema,
});

// ===== Consumption Tax =====
export const consumptionTaxSchema = z.object({
  type: z.enum(['vat', 'sales_tax', 'gst']),
  rate: z.number().min(0).max(1),
});

// ===== Country =====
export const countrySchema = z.object({
  countryCode: z.string().length(2),
  name: z.string().min(1),
  currency: z.string().length(3),
  incomeTax: incomeTaxSchema,
  deductions: deductionsSchema,
  consumptionTaxes: z.array(consumptionTaxSchema),
});

// ===== Type exports inferred from schemas =====
export type ValidatedCountry = z.infer<typeof countrySchema>;

// ===== Validation functions =====
export function validateCountry(data: unknown): ValidatedCountry {
  return countrySchema.parse(data);
}

export function safeValidateCountry(data: unknown) {
  return countrySchema.safeParse(data);
}
