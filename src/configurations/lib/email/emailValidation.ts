import { SUPPORTED_VARIABLES } from './personalization';

export type ValidationSeverity = 'passed' | 'warning' | 'error';

export interface EmailCheckResult {
  id: string;
  label: string;
  severity: ValidationSeverity;
  message?: string;
}

export function performEmailChecks(htmlContent: string, subject?: string, sender?: string): EmailCheckResult[] {
  const checks: EmailCheckResult[] = [];

  // 1. Subject Check
  if (!subject || subject.trim() === '') {
    checks.push({ id: 'subject', label: 'Subject', severity: 'error', message: 'Subject line is missing.' });
  } else {
    checks.push({ id: 'subject', label: 'Subject', severity: 'passed' });
  }

  // 2. Sender Check
  if (!sender || sender.trim() === '') {
    checks.push({ id: 'sender', label: 'Sender Information', severity: 'error', message: 'Sender information is missing.' });
  } else {
    checks.push({ id: 'sender', label: 'Sender Information', severity: 'passed' });
  }

  // 3. Content Check
  if (!htmlContent || htmlContent.trim() === '') {
    checks.push({ id: 'content', label: 'Email Content', severity: 'error', message: 'Email body is empty.' });
  } else {
    checks.push({ id: 'content', label: 'Email Content', severity: 'passed' });
  }

  // 4. Unsubscribe Link Check
  if (htmlContent && !htmlContent.toLowerCase().includes('unsubscribe')) {
    checks.push({ id: 'unsubscribe', label: 'Unsubscribe Link', severity: 'warning', message: 'No obvious unsubscribe link found. Compliance footer may add this automatically.' });
  } else {
    checks.push({ id: 'unsubscribe', label: 'Unsubscribe Link', severity: 'passed' });
  }

  // 5. Size Check (Warning if > 100KB approx)
  const sizeKb = new Blob([htmlContent]).size / 1024;
  if (sizeKb > 100) {
    checks.push({ id: 'size', label: 'HTML Size', severity: 'warning', message: `Email HTML is getting large (${sizeKb.toFixed(1)} KB) and may require optimization or risk clipping.` });
  } else {
    checks.push({ id: 'size', label: 'HTML Size', severity: 'passed' });
  }

  // 6. Links Check (Empty or suspicious links)
  // Very basic regex to find hrefs that might be empty or '#'
  const linkRegex = /href=["'](.*?)["']/gi;
  let hasEmptyLinks = false;
  let match;
  while ((match = linkRegex.exec(htmlContent)) !== null) {
    const href = match[1].trim();
    if (href === '' || href === '#') {
      hasEmptyLinks = true;
      break;
    }
  }
  if (hasEmptyLinks) {
    checks.push({ id: 'links', label: 'Links', severity: 'warning', message: 'Found empty or placeholder links (e.g. href="#").' });
  } else {
    checks.push({ id: 'links', label: 'Links', severity: 'passed' });
  }

  // 7. Image Alt Text Check
  const imgRegex = /<img\s+[^>]*>/gi;
  let hasMissingAlt = false;
  while ((match = imgRegex.exec(htmlContent)) !== null) {
    const imgTag = match[0];
    if (!/alt=["'][^"']*["']/i.test(imgTag)) {
      hasMissingAlt = true;
      break;
    }
  }
  if (hasMissingAlt) {
    checks.push({ id: 'images', label: 'Image Alt Text', severity: 'warning', message: 'One or more images are missing alt text.' });
  } else {
    checks.push({ id: 'images', label: 'Image Alt Text', severity: 'passed' });
  }

  // 8. Unresolved/Unknown Personalization Tokens
  // We look for {{...}} and see if the variable is in AVAILABLE_VARIABLES
  const tokenRegex = /{{([^}]+)}}/g;
  const unknownTokens: string[] = [];
  const knownKeys = SUPPORTED_VARIABLES.map(v => v.key);
  
  while ((match = tokenRegex.exec(htmlContent)) !== null) {
    const fullToken = match[1];
    // Split by | in case of fallback e.g. first_name|there
    const varName = fullToken.split('|')[0].trim();
    if (!knownKeys.includes(varName)) {
      unknownTokens.push(`{{${fullToken}}}`);
    }
  }

  if (unknownTokens.length > 0) {
    checks.push({ id: 'tokens', label: 'Personalization Tokens', severity: 'warning', message: `Found unknown or unresolved tokens: ${unknownTokens.join(', ')}` });
  } else {
    checks.push({ id: 'tokens', label: 'Personalization Tokens', severity: 'passed' });
  }

  return checks;
}
