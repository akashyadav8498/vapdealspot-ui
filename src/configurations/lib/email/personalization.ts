export type PersonalizationVariable = {
  key: string;
  label: string;
  description: string;
  exampleValue: string;
};

export const SUPPORTED_VARIABLES: PersonalizationVariable[] = [
  { key: 'first_name', label: 'First Name', description: 'Recipient\'s first name', exampleValue: 'Aditya' },
  { key: 'last_name', label: 'Last Name', description: 'Recipient\'s last name', exampleValue: 'Sharma' },
  { key: 'email', label: 'Email', description: 'Recipient\'s email address', exampleValue: 'aditya@example.com' },
  { key: 'city', label: 'City', description: 'Recipient\'s city', exampleValue: 'Delhi' },
  { key: 'country', label: 'Country', description: 'Recipient\'s country', exampleValue: 'India' },
  { key: 'last_purchase', label: 'Last Purchase', description: 'Name of the last purchased product', exampleValue: 'Vape X' },
  { key: 'total_orders', label: 'Total Orders', description: 'Number of orders placed', exampleValue: '5' },
  { key: 'total_spent', label: 'Total Spent', description: 'Total amount spent', exampleValue: '$249.00' },
  { key: 'discount_code', label: 'Discount Code', description: 'Active discount code', exampleValue: 'WELCOME10' },
  { key: 'product_name', label: 'Product Name', description: 'Relevant product name', exampleValue: 'Vape X' },
];

export type SampleCustomer = Record<string, string | number | string[]>;

export const MOCK_CUSTOMERS: { id: string; name: string; data: SampleCustomer }[] = [
  {
    id: "c1",
    name: "Customer 1: Aditya (VIP)",
    data: {
      first_name: "Aditya",
      last_name: "Sharma",
      email: "aditya@example.com",
      city: "Delhi",
      country: "India",
      last_purchase: "Vape X",
      total_orders: 5,
      total_spent: 249.00,
      discount_code: "WELCOME10",
      product_name: "Vape X",
      segment: "VIP",
      tags: ["returning", "high-value"],
      device: "mobile"
    }
  },
  {
    id: "c2",
    name: "Customer 2: Rahul (New)",
    data: {
      first_name: "Rahul",
      last_name: "Verma",
      email: "rahul@example.com",
      city: "Mumbai",
      country: "India",
      last_purchase: "",
      total_orders: 1,
      total_spent: 49.00,
      discount_code: "NEW50",
      product_name: "Starter Kit",
      segment: "New",
      tags: ["new"],
      device: "desktop"
    }
  }
];

export const defaultSampleCustomer: SampleCustomer = MOCK_CUSTOMERS[0].data;

/**
 * Resolves personalization tokens like {{first_name}} or {{first_name|there}}
 * Input: "Hi {{first_name|there}}"
 * Output: "Hi Aditya" (if first_name is present) or "Hi there" (if fallback is used)
 */
export function resolvePersonalization(text: string, customerData: SampleCustomer = defaultSampleCustomer): string {
  if (!text) return text;
  
  // Regex to match {{key}} or {{key|fallback}}
  const tokenRegex = /\{\{\s*([a-zA-Z0-9_]+)\s*(?:\|\s*([^}]+))?\s*\}\}/g;
  
  return text.replace(tokenRegex, (match, key, fallback) => {
    // Check if it's a known supported variable
    const isSupported = SUPPORTED_VARIABLES.some(v => v.key === key);
    if (!isSupported) {
      // Leave unknown tokens untouched
      return match;
    }

    const value = customerData[key];
    
    // If value exists in customer data, use it
    if (value !== undefined && value !== null && value !== '') {
      return String(value);
    }
    
    // If fallback is provided, use it
    if (fallback !== undefined) {
      return fallback;
    }
    
    // If no fallback and value is unavailable, use safe empty string to avoid showing broken syntax
    return '';
  });
}
