const { Resend } = require("resend");
const express = require("express");
const Organization = require("../models/organization");
const router = express.Router();
require("dotenv").config();

const resend = new Resend(process.env.RESEND_KEY);

router.post("/inquiry/receive", async (req, res) => {
  const email = req.body.email;
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const organizationId = req.body.organization;

  const address = req.body.address;
  const city = req.body.city;
  const state = req.body.state;
  const zipCode = req.body.zipCode;

  const facingForeclosure = req.body.facingForeclosure;
  const currentLoanBalance = req.body.currentLoanBalance;
  const amountBehind = req.body.amountBehind;
  const loanType = req.body.loanType;
  const lenderName = req.body.lenderName;
  const auctionDate = req.body.auctionDate;
  const service = req.body.service;

  const organization = await getOrganization(organizationId);

  if (!organization) {
    return res.status(404).json("Organization not found");
  }

  const formatCurrency = (value) => {
    const num = Number(value);
    if (Number.isNaN(num)) return String(value ?? "");
    return num.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
    });
  };

  const formatDate = (value) => {
    if (!value) return "Not provided";
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  try {
    await resend.batch.send([
      {
        from: `${organization.displayName} <no-reply@nasirgriffin.com>`,
        to: [organization.email],
        subject: "New Real Estate Inquiry Received",
        html: `
        <div style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
            <tr>
              <td align="center">
                <table width="640" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
                  
                  <tr>
                    <td style="padding:24px 28px;background:#111827;color:#ffffff;">
                      <h1 style="margin:0;font-size:20px;">New Real Estate Inquiry</h1>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:24px 28px;color:#111827;">
                      <p style="margin:0 0 16px 0;font-size:14px;">
                        A new real estate inquiry has been submitted through your website.
                      </p>

                      <table width="100%" style="border-collapse:collapse;font-size:13px;">
                        <tr>
                          <td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;width:180px;">Customer Name</td>
                          <td style="padding:8px;border:1px solid #e5e7eb;">
                            ${String(firstName ?? "").trim()} ${String(lastName ?? "").trim()}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Email</td>
                          <td style="padding:8px;border:1px solid #e5e7eb;">
                            ${String(email ?? "").trim()}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Service</td>
                          <td style="padding:8px;border:1px solid #e5e7eb;text-transform:capitalize;">
                            ${String(service ?? "").trim()}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Property</td>
                          <td style="padding:8px;border:1px solid #e5e7eb;">
                            ${String(address ?? "").trim()}, ${String(city ?? "").trim()}, ${String(state ?? "").trim()} ${String(zipCode ?? "").trim()}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Facing Foreclosure</td>
                          <td style="padding:8px;border:1px solid #e5e7eb;">
                            ${facingForeclosure ? "Yes" : "No"}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Current Loan Balance</td>
                          <td style="padding:8px;border:1px solid #e5e7eb;">
                            ${formatCurrency(currentLoanBalance)}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Amount Behind</td>
                          <td style="padding:8px;border:1px solid #e5e7eb;">
                            ${formatCurrency(amountBehind)}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Loan Type</td>
                          <td style="padding:8px;border:1px solid #e5e7eb;">
                            ${String(loanType ?? "").trim()}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Lender Name</td>
                          <td style="padding:8px;border:1px solid #e5e7eb;">
                            ${String(lenderName ?? "").trim()}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Auction Date</td>
                          <td style="padding:8px;border:1px solid #e5e7eb;">
                            ${formatDate(auctionDate)}
                          </td>
                        </tr>
                      </table>

                      <p style="margin-top:18px;font-size:12px;color:#6b7280;">
                        Log into your dashboard to review and respond to this inquiry.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:18px 28px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
                      ${organization.displayName} Real Estate System Notification
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </div>
        `,
      },

      {
        from: `${organization.displayName} <no-reply@nasirgriffin.com>`,
        to: [email],
        subject: "We Received Your Real Estate Inquiry",
        html: `
        <div style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
            <tr>
              <td align="center">
                <table width="640" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
                  
                  <tr>
                    <td style="padding:24px 28px;background:#111827;color:#ffffff;">
                      <h1 style="margin:0;font-size:20px;">Inquiry Received</h1>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:24px 28px;color:#111827;">
                      <p style="margin:0 0 16px 0;font-size:14px;">
                        Hi ${String(firstName ?? "").trim() || "there"},
                      </p>

                      <p style="margin:0 0 16px 0;font-size:14px;">
                        Thank you for contacting ${organization.displayName}. We received your inquiry and our team will review your information shortly.
                      </p>

                      <div style="padding:14px 16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:12px;">
                        <p style="margin:0 0 8px 0;font-size:13px;">
                          <strong>Service Requested:</strong>
                        </p>
                        <p style="margin:0;font-size:13px;text-transform:capitalize;">
                          ${String(service ?? "").trim()}
                        </p>
                      </div>

                      <div style="padding:14px 16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:12px;">
                        <p style="margin:0 0 8px 0;font-size:13px;">
                          <strong>Property Address:</strong>
                        </p>
                        <p style="margin:0;font-size:13px;">
                          ${String(address ?? "").trim()}, ${String(city ?? "").trim()}, ${String(state ?? "").trim()} ${String(zipCode ?? "").trim()}
                        </p>
                      </div>

                      ${
                        facingForeclosure
                          ? `
                      <div style="padding:14px 16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">
                        <p style="margin:0 0 8px 0;font-size:13px;">
                          <strong>Foreclosure Details Submitted:</strong>
                        </p>
                        <p style="margin:0;font-size:13px;line-height:20px;">
                          Loan Balance: ${formatCurrency(currentLoanBalance)}<br/>
                          Amount Behind: ${formatCurrency(amountBehind)}<br/>
                          Loan Type: ${String(loanType ?? "").trim()}<br/>
                          Lender: ${String(lenderName ?? "").trim()}<br/>
                          Auction Date: ${formatDate(auctionDate)}
                        </p>
                      </div>
                      `
                          : ""
                      }

                      <p style="margin-top:18px;font-size:13px;">
                        Please do not reply to this email.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:18px 28px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
                      This is an automated message from ${organization.displayName}. Please do not share sensitive financial information via email beyond what was submitted through the secured intake form.
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </div>
        `,
      },
    ]);

    res.status(200).json("Inquiry was received successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).json("Inquiry email failed to send.");
  }
});

router.post("/inquiry/update", async (req, res) => {
  const email = req.body.email;
  const firstName = req.body.firstname;
  const organizationId = req.body.organization;
  const service = req.body.service;
  const address = req.body.address;
  const city = req.body.city;
  const state = req.body.state;
  const zipCode = req.body.zipCode;
  const message = req.body.message;

  const organization = await getOrganization(organizationId);

  if (!organization) {
    return res.status(404).json("Organization not found");
  }

  try {
    await resend.batch.send([
      {
        from: `${organization.displayName} <no-reply@nasirgriffin.com>`,
        to: [email],
        subject: "Update Regarding Your Real Estate Inquiry",
        html: `
        <div style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
            <tr>
              <td align="center">
                <table width="640" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
                  
                  <tr>
                    <td style="padding:24px 28px;background:#111827;color:#ffffff;">
                      <h1 style="margin:0;font-size:20px;">Inquiry Update</h1>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:24px 28px;color:#111827;">
                      <p style="margin:0 0 14px 0;font-size:14px;line-height:22px;color:#374151;">
                        Hi ${String(firstName ?? "").trim() || "there"}, here is an update from <strong>${String(organization.displayName ?? "").trim()}</strong> regarding your inquiry.
                      </p>

                      <div style="margin:14px 0 0 0;padding:14px 16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;">
                        <p style="margin:0 0 8px 0;font-size:13px;line-height:20px;color:#374151;">
                          <strong style="color:#111827;">Service Requested:</strong>
                        </p>
                        <p style="margin:0;font-size:14px;line-height:22px;color:#111827;text-transform:capitalize;">
                          ${String(service ?? "").trim()}
                        </p>
                      </div>

                      <div style="margin:12px 0 0 0;padding:14px 16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;">
                        <p style="margin:0 0 8px 0;font-size:13px;line-height:20px;color:#374151;">
                          <strong style="color:#111827;">Property Address:</strong>
                        </p>
                        <p style="margin:0;font-size:14px;line-height:22px;color:#111827;">
                          ${String(address ?? "").trim()}, ${String(city ?? "").trim()}, ${String(state ?? "").trim()} ${String(zipCode ?? "").trim()}
                        </p>
                      </div>

                      <div style="margin:12px 0 0 0;padding:14px 16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;">
                        <p style="margin:0 0 8px 0;font-size:13px;line-height:20px;color:#374151;">
                          <strong style="color:#111827;">Message from Our Team:</strong>
                        </p>
                        <p style="margin:0;font-size:14px;line-height:22px;color:#111827;">
                          ${String(message ?? "").trim()}
                        </p>
                      </div>

                      <p style="margin:14px 0 0 0;font-size:12px;line-height:18px;color:#6b7280;">
                        If you have questions, please contact ${String(organization.displayName ?? "").trim()} directly.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:18px 28px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
                      This is an automated update from ${String(organization.displayName ?? "").trim()}.
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </div>
        `,
      },
    ]);

    res.status(200).json("Inquiry update sent successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).json("Inquiry update failed to send.");
  }
});

// middleware
async function getOrganization(id) {
  try {
    const doc = await Organization.findById(id);
    if (!doc) return null;
    return doc;
  } catch (err) {
    console.log(err);
    return null;
  }
}

module.exports = router;