import type { Contact } from './types';

// Mock initial contacts
export const initialContacts: Contact[] = [
  { id: '1', email: 'aditya@example.com', firstName: 'Aditya', lastName: 'Kumar', isSubscribed: true, createdAt: new Date().toISOString() },
  { id: '2', email: 'john@example.com', firstName: 'John', lastName: 'Doe', isSubscribed: true, createdAt: new Date().toISOString() },
  { id: '3', email: 'jane@example.com', firstName: 'Jane', lastName: 'Doe', isSubscribed: false, createdAt: new Date().toISOString() },
];
