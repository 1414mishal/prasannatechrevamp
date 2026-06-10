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

  const { name, email, company, message, website, 'g-recaptcha-response': captchaToken } = req.body || {};

  // Honeypot field — bots fill this, humans don't
  if (website) {
    return res.status(200).json({ success: true });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  if (!captchaToken) {
    return res.status(400).json({ error: 'Please complete the captcha.' });
  }

  const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: captchaToken,
    }),
  });
  const verifyData = await verifyRes.json();
  if (!verifyData.success) {
    return res.status(400).json({ error: 'Captcha verification failed. Please try again.' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: 'Prasanna Technologies <noreply@prasannatechnologies.com>',
      to: 'info@prasannatechnologies.com',
      replyTo: email,
      subject: `New Enquiry for Prasanna Technologies from ${name}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background-color: #001e40; background-image: linear-gradient(135deg, #001e40 0%, #003366 100%); padding: 32px 36px;">
            <p style="color: #1591EA; margin: 0 0 6px; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">Prasanna Technologies</p>
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">New Enquiry</h1>
          </div>
          <div style="padding: 36px; border: 1px solid #e8eaed; border-top: none;">
            <p style="font-size: 14px; color: #43474f; margin: 0 0 24px; line-height: 1.6;">A new enquiry has been submitted through the Prasanna Technologies website contact form. Details are below:</p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
              <tr>
                <td style="padding: 10px 0; font-weight: 700; width: 110px; vertical-align: top; color: #001e40; font-size: 13px; border-bottom: 1px solid #eef1f5;">Name</td>
                <td style="padding: 10px 0; color: #1b1c1c; font-size: 14px; border-bottom: 1px solid #eef1f5;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: 700; vertical-align: top; color: #001e40; font-size: 13px; border-bottom: 1px solid #eef1f5;">Email</td>
                <td style="padding: 10px 0; color: #1591EA; font-size: 14px; border-bottom: 1px solid #eef1f5;">${email}</td>
              </tr>
              ${company ? `<tr>
                <td style="padding: 10px 0; font-weight: 700; vertical-align: top; color: #001e40; font-size: 13px; border-bottom: 1px solid #eef1f5;">Company</td>
                <td style="padding: 10px 0; color: #1b1c1c; font-size: 14px; border-bottom: 1px solid #eef1f5;">${company}</td>
              </tr>` : ''}
            </table>
            <p style="font-weight: 700; color: #001e40; font-size: 13px; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
            <div style="background-color: #f0f6fd; border-left: 3px solid #1591EA; border-radius: 4px; padding: 18px 20px; color: #1b1c1c; font-size: 14px; line-height: 1.7;">${String(message).replace(/\n/g, '<br>')}</div>
            <p style="font-size: 12px; color: #9aa0a6; margin: 28px 0 0; padding-top: 20px; border-top: 1px solid #eef1f5;">Reply directly to this email to respond to ${name} at ${email}.</p>
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
