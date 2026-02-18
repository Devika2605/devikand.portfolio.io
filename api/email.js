export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { from_name, from_email, company, message } = req.body;

    const response = await fetch(
      `https://api.emailjs.com/api/v1.0/email/send`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id:  process.env.EJS_SERVICE,
          template_id: process.env.EJS_TEMPLATE,
          user_id:     process.env.EJS_PUBLIC,
          template_params: {
            from_name,
            from_email,
            company: company || 'Not provided',
            message,
            reply_to: from_email
          }
        })
      }
    );

    if (!response.ok) throw new Error('EmailJS error: ' + response.status);
    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}