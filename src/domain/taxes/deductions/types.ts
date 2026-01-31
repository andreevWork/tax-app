export type Period = 'year' | 'month';

export interface PersonalDeduction {
  amount: number;
}

export type ChildrenDeductionType =
  | 'per_child_monthly'
  | 'per_child_year'
  | 'none';

export interface IncomeLimit {
  amount: number;
  period: Period;
}

export type ChildIndex = number | 'all';

export interface ChildDeductionRule {
  childIndex: ChildIndex;
  amount: number;
}

// ===== Children Deduction (Discriminated Union) =====
interface BaseChildrenDeduction {
  incomeLimit: IncomeLimit | null;
  rules: ChildDeductionRule[];
}

export interface PerChildMonthlyDeduction extends BaseChildrenDeduction {
  type: 'per_child_monthly';
}

export interface PerChildYearDeduction extends BaseChildrenDeduction {
  type: 'per_child_year';
}

export interface NoChildrenDeduction {
  type: 'none';
  incomeLimit: null;
  rules: [];
}

export type ChildrenDeduction =
  | PerChildMonthlyDeduction
  | PerChildYearDeduction
  | NoChildrenDeduction;

export interface Deductions {
  personal: PersonalDeduction;
  children: ChildrenDeduction;
}

export interface DeductionsResult {
  personal: number;
  children: number;
  totalDeductions: number;
}
