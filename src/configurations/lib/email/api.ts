export interface SendTestEmailPayload {
  toEmail: string;
  subject: string;
  html: string;
  senderName: string;
  senderEmail: string;
}

export interface SendCampaignPayload {
  campaignId: string;
  subject: string;
  html: string;
  senderName: string;
  senderEmail: string;
  recipientEmails: string[];
}

/**
 * Injects mandatory compliance footer into HTML payload
 */
export function injectComplianceFooter(html: string, address: string = "123 Vape Street, Vape City, VC 12345"): string {
  const footer = `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #666; text-align: center;">
      <p>Sent by <strong>Vape Deal Spot</strong></p>
      <p>${address}</p>
      <p><a href="{{unsubscribe_url}}" style="color: #666; text-decoration: underline;">Unsubscribe</a></p>
    </div>
  `;
  return `${html}\n${footer}`;
}

/**
 * Sends a single test email
 */
export async function sendTestEmail(payload: SendTestEmailPayload): Promise<{ success: boolean; message: string }> {
  console.log("[EMAIL API] Initiating Test Send", payload);
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.warn("Missing Backend Dependency: No email provider (e.g. Resend, SendGrid, SES) is integrated. The API boundary is ready, but the actual dispatch layer is not implemented in this repository. Returning local mock success.");
  
  return { success: true, message: "Test email mock sent successfully (Backend pending)." };
}

/**
 * Dispatches a full campaign to an audience
 */
export async function sendCampaign(payload: SendCampaignPayload): Promise<{ success: boolean; message: string }> {
  console.log("[EMAIL API] Initiating Campaign Dispatch", payload);
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  console.warn("Missing Backend Dependency: Campaign dispatch requires an active email provider API integration. Currently not available in this environment. Returning local mock success.");
  
  return { success: true, message: "Campaign mock sent successfully (Backend pending)." };
}
