const { Resend } = require('resend');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, company, message, website } = req.body || {};

  // Honeypot field — bots fill this, humans don't
  if (website) {
    return res.status(200).json({ success: true });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: 'Prasanna Technologies Website <noreply@prasannatechnologies.com>',
      to: 'vedhshetty1206@gmail.com',
      replyTo: email,
      subject: `New Enquiry for Prasanna Technologies from ${name}`,
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1a3c34; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px;">New Enquiry for Prasanna Technologies</h1>
          </div>
          <div style="padding: 24px; border: 1px solid #e5e5e5; border-top: none;">
            <p style="font-size: 14px; color: #555; margin-top: 0;">A new enquiry has been submitted through the Prasanna Technologies website contact form. Details are below:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 120px; vertical-align: top;">Name</td>
                <td style="padding: 8px 0;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Email</td>
                <td style="padding: 8px 0;">${email}</td>
              </tr>
              ${company ? `<tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Company</td>
                <td style="padding: 8px 0;">${company}</td>
              </tr>` : ''}
            </table>
            <div style="margin-top: 8px;">
              <p style="font-weight: bold; margin-bottom: 8px;">Message</p>
              <p style="background-color: #f7f7f7; padding: 16px; border-radius: 6px; line-height: 1.6;">${String(message).replace(/\n/g, '<br>')}</p>
            </div>
            <p style="font-size: 12px; color: #999; margin-top: 24px;">Reply directly to this email to respond to ${name} at ${email}.</p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
};
