// pb_hooks/contact_notify.pb.js
// Sends an email notification to the HardBassBash team
// whenever a new contact form message is submitted.
//
// REQUIRES: SMTP configured in PocketBase Admin → Settings → Mail settings
//           (Gmail App Password — see backend/README.md)

onRecordAfterCreateSuccess((e) => {
    const record = e.record;

    const firstName  = record.getString("first_name");
    const lastName   = record.getString("last_name");
    const email      = record.getString("email");
    const instagram  = record.getString("instagram");
    const subject    = record.getString("subject");
    const message    = record.getString("message");

    const subjectLabel = {
        booking:   "Artist Booking",
        collab:    "Event Collaboration",
        press:     "Press / Media",
        merch:     "Merchandise",
        community: "Join The Community",
        other:     "Other",
    }[subject] || subject;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; background: #0a0a0a; color: #ffffff; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 2rem; }
  .header { background: #E5001A; padding: 1.5rem 2rem; margin-bottom: 2rem; }
  .header h1 { font-size: 1.5rem; margin: 0; letter-spacing: 0.1em; }
  .field { margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid #222; }
  .field-label { font-size: 0.7rem; letter-spacing: 0.3em; text-transform: uppercase; color: #888; margin-bottom: 0.3rem; }
  .field-value { font-size: 0.95rem; color: #eee; }
  .message-box { background: #111; border-left: 3px solid #E5001A; padding: 1rem 1.25rem; }
  .footer { margin-top: 2rem; font-size: 0.75rem; color: #555; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>HARDBASSBASH — New Inquiry</h1>
  </div>
  <div class="field">
    <div class="field-label">Category</div>
    <div class="field-value">${subjectLabel}</div>
  </div>
  <div class="field">
    <div class="field-label">From</div>
    <div class="field-value">${firstName} ${lastName}</div>
  </div>
  <div class="field">
    <div class="field-label">Email</div>
    <div class="field-value"><a href="mailto:${email}" style="color:#E5001A;">${email}</a></div>
  </div>
  ${instagram ? `
  <div class="field">
    <div class="field-label">Instagram</div>
    <div class="field-value"><a href="https://instagram.com/${instagram.replace('@','')}" target="_blank" style="color:#E5001A;">${instagram}</a></div>
  </div>` : ''}
  <div class="field" style="border-bottom:none;">
    <div class="field-label">Message</div>
    <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
  </div>
  <div class="footer">
    This message was submitted via the HardBassBash contact form.
    Submitted at: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB
  </div>
</div>
</body>
</html>`;

    try {
        const mailer = $app.newMailClient();
        mailer.send(new MailerMessage({
            from: {
                name:    $app.settings().meta.senderName    || "HardBassBash",
                address: $app.settings().meta.senderAddress || "ekomurdiansyah89@gmail.com",
            },
            to: [{ address: "ekomurdiansyah89@gmail.com" }],
            subject: `[HBB] New ${subjectLabel} from ${firstName}`,
            html: html,
        }));
        console.log(`[contact_notify] Email sent for inquiry from: ${email}`);
    } catch (err) {
        console.error("[contact_notify] Failed to send email:", err);
    }

}, "contact_messages");
