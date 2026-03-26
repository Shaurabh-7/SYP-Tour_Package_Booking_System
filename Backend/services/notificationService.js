import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatCurrency = (value) => {
  const amount = Number(value);
  if (Number.isNaN(amount)) return escapeHtml(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const getBaseTemplate = ({ title, greeting, intro, details = [], closing }) => {
  const rows = details
    .map(
      ({ label, value }) => `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#0f172a;width:190px;">
            ${escapeHtml(label)}
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#334155;">
            ${escapeHtml(value)}
          </td>
        </tr>
      `
    )
    .join("");

  return `
    <div style="margin:0;padding:24px;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 35px rgba(15,23,42,0.08);">
        <div style="padding:28px 32px;background:linear-gradient(135deg,#0f766e,#1d4ed8);">
          <h1 style="margin:0;font-size:24px;line-height:1.3;color:#ffffff;">${escapeHtml(title)}</h1>
        </div>
        <div style="padding:32px;">
          <p style="margin:0 0 16px;font-size:16px;line-height:1.8;">${escapeHtml(greeting)}</p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#475569;">${escapeHtml(intro)}</p>
          ${
            rows
              ? `<table style="width:100%;border-collapse:collapse;margin:24px 0;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                  <tbody>${rows}</tbody>
                </table>`
              : ""
          }
          <p style="margin:0;font-size:15px;line-height:1.8;color:#475569;">${escapeHtml(closing)}</p>
          <p style="margin:24px 0 0;font-size:15px;line-height:1.8;">
            Regards,<br />
            <strong>NepalYatra Team</strong>
          </p>
        </div>
      </div>
    </div>
  `;
};

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP configuration is missing. Skipping email send.");
    return;
  }

  await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME || "NepalYatra"}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

const sendWelcomeEmail = async ({ name, email }) =>
  sendEmail({
    to: email,
    subject: "Welcome to NepalYatra",
    html: getBaseTemplate({
      title: "Welcome to NepalYatra",
      greeting: `Dear ${name},`,
      intro:
        "Thank you for registering with NepalYatra. Your account has been created successfully and is now ready to use.",
      details: [
        { label: "Registered Email", value: email },
        { label: "Account Status", value: "Active" },
      ],
      closing:
        "We are delighted to help you discover, plan, and manage memorable travel experiences with confidence.",
    }),
  });

const sendBookingCreatedEmail = async ({ user, booking, tourPackage }) =>
  sendEmail({
    to: user.email,
    subject: `Booking Confirmed - ${tourPackage.name}`,
    html: getBaseTemplate({
      title: "Booking Confirmation",
      greeting: `Dear ${user.name},`,
      intro:
        "Your booking has been placed successfully. Please review the details below for your records.",
      details: [
        { label: "Booking ID", value: booking.id },
        { label: "Package", value: tourPackage.name },
        { label: "Destination", value: tourPackage.destination || "N/A" },
        { label: "Number of People", value: booking.numberOfPeople },
        { label: "Total Amount", value: formatCurrency(booking.totalAmount) },
        { label: "Booking Status", value: booking.status },
        { label: "Payment Status", value: booking.paymentStatus },
      ],
      closing:
        "Please keep this email for reference. If you need support, our team will be happy to assist you.",
    }),
  });

const sendBookingUpdatedEmail = async ({ user, booking, tourPackage }) =>
  sendEmail({
    to: user.email,
    subject: `Booking Updated - ${tourPackage.name}`,
    html: getBaseTemplate({
      title: "Booking Updated",
      greeting: `Dear ${user.name},`,
      intro:
        "Your booking information has been updated. Please review the latest details below.",
      details: [
        { label: "Booking ID", value: booking.id },
        { label: "Package", value: tourPackage.name },
        { label: "Current Status", value: booking.status },
        { label: "Payment Status", value: booking.paymentStatus },
        { label: "Number of People", value: booking.numberOfPeople },
        { label: "Total Amount", value: formatCurrency(booking.totalAmount) },
      ],
      closing:
        "If you did not expect this update, please contact support so we can assist you promptly.",
    }),
  });

const sendBookingCancelledEmail = async ({ user, booking, tourPackage }) =>
  sendEmail({
    to: user.email,
    subject: `Booking Cancelled - ${tourPackage.name}`,
    html: getBaseTemplate({
      title: "Booking Cancelled",
      greeting: `Dear ${user.name},`,
      intro:
        "This email confirms that the booking below has been cancelled.",
      details: [
        { label: "Booking ID", value: booking.id },
        { label: "Package", value: tourPackage.name },
        { label: "Destination", value: tourPackage.destination || "N/A" },
        { label: "Final Status", value: "Cancelled" },
      ],
      closing:
        "If you require further assistance regarding this cancellation, please reach out to our support team.",
    }),
  });

const sendBookingCompletedEmail = async ({ user, booking, tourPackage }) =>
  sendEmail({
    to: user.email,
    subject: `Booking Completed - ${tourPackage.name}`,
    html: getBaseTemplate({
      title: "Booking Completed",
      greeting: `Dear ${user.name},`,
      intro:
        "Your booking has been marked as completed. We sincerely hope you enjoyed the experience.",
      details: [
        { label: "Booking ID", value: booking.id },
        { label: "Package", value: tourPackage.name },
        { label: "Destination", value: tourPackage.destination || "N/A" },
        { label: "Final Status", value: "Completed" },
      ],
      closing:
        "Thank you for choosing NepalYatra. We look forward to serving you again on your future journeys.",
    }),
  });

export {
  sendWelcomeEmail,
  sendBookingCreatedEmail,
  sendBookingUpdatedEmail,
  sendBookingCancelledEmail,
  sendBookingCompletedEmail,
};
