import type { Campaign } from './types';

export const starterTemplates = {
  blank: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2>Your Title Here</h2>
  <p>Start writing your content here...</p>
</div>`,
  welcome: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fafafa; border-radius: 8px;">
  <h1 style="color: #333;">Welcome to Vape Deal Spot!</h1>
  <p style="font-size: 16px; line-height: 1.5; color: #555;">We are thrilled to have you on board. Check out our latest collections and exclusive deals designed just for you.</p>
  <div style="text-align: center; margin-top: 30px;">
    <a href="#" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Shop Now</a>
  </div>
</div>`,
  promotional: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
  <h1 style="color: #e63946;">HUGE SALE - UP TO 50% OFF!</h1>
  <p style="font-size: 18px; color: #333;">Don't miss out on our biggest sale of the season. Grab your favorite vape juices and devices at unbeatable prices.</p>
  <img src="https://via.placeholder.com/600x300?text=Sale+Banner" alt="Sale" style="max-width: 100%; border-radius: 8px; margin: 20px 0;" />
  <p>Use code: <strong>SAVE50</strong> at checkout.</p>
</div>`,
  newsletter: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px;">
    <h2>The Weekly Cloud</h2>
    <span style="color: #666; font-size: 12px;">Your weekly vape news</span>
  </div>
  <h3 style="margin-top: 0;">Top Story: The Evolution of Pod Systems</h3>
  <p style="line-height: 1.6; color: #444;">This week we dive deep into how pod systems have changed the vaping landscape forever...</p>
  <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
  <h3>Community Spotlight</h3>
  <p style="line-height: 1.6; color: #444;">Check out this amazing coil build from our community member @VapeWizard.</p>
</div>`,
  product: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <span style="background: #333; color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">NEW ARRIVAL</span>
  <h1 style="margin-top: 15px;">Meet the SMOK Nord 5</h1>
  <img src="https://via.placeholder.com/600x400?text=Product+Image" alt="Product" style="max-width: 100%; border-radius: 8px; margin: 20px 0;" />
  <p style="font-size: 16px; line-height: 1.6; color: #444;">The SMOK Nord 5 is here. Featuring an 80W max output, 2000mAh internal battery, and dual-side airflow system.</p>
  <div style="margin-top: 20px;">
    <a href="#" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Product</a>
  </div>
</div>`
};

// Mock initial campaigns
export const initialCampaigns: Campaign[] = [
  {
    id: 'c-1',
    name: 'Welcome Series - Email 1',
    subject: 'Welcome to Vape Deal Spot!',
    senderName: 'Vape Deal Spot',
    senderEmail: 'hello@vapedealspot.com',
    contentHtml: starterTemplates.welcome,
    status: 'sent',
    audience: { type: 'all' },
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    sentAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    recipientCount: 245
  },
  {
    id: 'c-2',
    name: 'Black Friday Sale Announcement',
    subject: 'Huge Black Friday Savings Inside \uD83D\uDD25',
    senderName: 'Vape Deal Spot',
    senderEmail: 'hello@vapedealspot.com',
    contentHtml: starterTemplates.promotional,
    status: 'draft',
    audience: { type: 'all' },
    createdAt: new Date().toISOString(),
  }
];
