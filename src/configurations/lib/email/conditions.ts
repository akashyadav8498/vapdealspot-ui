import type { SampleCustomer } from './personalization';

export type ConditionField = 
  | 'first_name'
  | 'email'
  | 'city'
  | 'country'
  | 'last_purchase'
  | 'total_orders'
  | 'total_spent'
  | 'discount_code'
  | 'product_name'
  | 'segment'
  | 'tags'
  | 'device';

export type ConditionOperator = 
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'exists'
  | 'notExists';

export interface BlockCondition {
  field: ConditionField;
  operator: ConditionOperator;
  value?: string | number;
}

export const CONDITION_FIELDS: { label: string; value: ConditionField }[] = [
  { label: 'First Name', value: 'first_name' },
  { label: 'Email', value: 'email' },
  { label: 'City', value: 'city' },
  { label: 'Country', value: 'country' },
  { label: 'Last Purchase', value: 'last_purchase' },
  { label: 'Total Orders', value: 'total_orders' },
  { label: 'Total Spent', value: 'total_spent' },
  { label: 'Discount Code', value: 'discount_code' },
  { label: 'Product Name', value: 'product_name' },
  { label: 'Segment', value: 'segment' },
  { label: 'Tags', value: 'tags' },
  { label: 'Device', value: 'device' },
];

export const CONDITION_OPERATORS: { label: string; value: ConditionOperator }[] = [
  { label: 'Equals', value: 'equals' },
  { label: 'Does Not Equal', value: 'notEquals' },
  { label: 'Contains', value: 'contains' },
  { label: 'Does Not Contain', value: 'notContains' },
  { label: 'Greater Than', value: 'greaterThan' },
  { label: 'Greater Than or Equal', value: 'greaterThanOrEqual' },
  { label: 'Less Than', value: 'lessThan' },
  { label: 'Less Than or Equal', value: 'lessThanOrEqual' },
  { label: 'Exists (is set)', value: 'exists' },
  { label: 'Does Not Exist', value: 'notExists' },
];

/**
 * Evaluates a given block condition against sample customer data.
 * Returns true if the condition passes or is empty, false if it fails.
 */
export function evaluateCondition(condition: BlockCondition | undefined, customerData: SampleCustomer): boolean {
  if (!condition) return true;

  const { field, operator, value } = condition;
  const customerValue = customerData[field];

  // If the field doesn't exist in the data:
  if (customerValue === undefined || customerValue === null) {
    if (operator === 'notExists') return true;
    return false; // For exists, equals, greaterThan, etc. it fails
  }

  const strCustomerValue = String(customerValue).toLowerCase();
  const strCompareValue = String(value || '').toLowerCase();

  const numCustomerValue = typeof customerValue === 'number' ? customerValue : parseFloat(String(customerValue).replace(/[^0-9.-]+/g, ''));
  const numCompareValue = parseFloat(String(value || '').replace(/[^0-9.-]+/g, ''));

  switch (operator) {
    case 'exists':
      return true;
    case 'notExists':
      return false;
    case 'equals':
      if (Array.isArray(customerValue)) {
        return customerValue.some(v => String(v).toLowerCase() === strCompareValue);
      }
      return strCustomerValue === strCompareValue;
    case 'notEquals':
      if (Array.isArray(customerValue)) {
        return !customerValue.some(v => String(v).toLowerCase() === strCompareValue);
      }
      return strCustomerValue !== strCompareValue;
    case 'contains':
      if (Array.isArray(customerValue)) {
        return customerValue.some(v => String(v).toLowerCase().includes(strCompareValue));
      }
      return strCustomerValue.includes(strCompareValue);
    case 'notContains':
      if (Array.isArray(customerValue)) {
        return !customerValue.some(v => String(v).toLowerCase().includes(strCompareValue));
      }
      return !strCustomerValue.includes(strCompareValue);
    case 'greaterThan':
      if (isNaN(numCustomerValue) || isNaN(numCompareValue)) return false;
      return numCustomerValue > numCompareValue;
    case 'greaterThanOrEqual':
      if (isNaN(numCustomerValue) || isNaN(numCompareValue)) return false;
      return numCustomerValue >= numCompareValue;
    case 'lessThan':
      if (isNaN(numCustomerValue) || isNaN(numCompareValue)) return false;
      return numCustomerValue < numCompareValue;
    case 'lessThanOrEqual':
      if (isNaN(numCustomerValue) || isNaN(numCompareValue)) return false;
      return numCustomerValue <= numCompareValue;
    default:
      return false;
  }
}
