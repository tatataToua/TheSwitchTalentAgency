import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, name, email, phone, subject, message, djId, venueName, eventDate } = body

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("contact_inquiries")
      .insert({
        type,
        name,
        email,
        phone,
        subject,
        message,
        dj_id: djId || null,
        venue_name: venueName || null,
        event_date: eventDate || null,
        status: "new",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save inquiry" }, { status: 500 })
    }

    const emailData = {
      to: "toualee10@gmail.com",
      subject: `[Switch Talent Agency] ${subject || `New ${type} inquiry`}`,
      html: generateEmailHTML(type, { name, email, phone, subject, message, djId, venueName, eventDate }),
    }

    // For now, we'll simulate email sending and log the data
    console.log("[v0] Email would be sent:", emailData)

    // In a real implementation, you would use a service like Resend, SendGrid, or similar
    // const emailResponse = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from: 'noreply@switchtalentagency.com',
    //     to: 'toualee10@gmail.com',
    //     subject: emailData.subject,
    //     html: emailData.html,
    //   }),
    // })

    return NextResponse.json({
      success: true,
      message: "Inquiry submitted successfully",
      inquiryId: data.id,
    })
  } catch (error) {
    console.error("Email API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateEmailHTML(type: string, data: any) {
  const { name, email, phone, subject, message, djId, venueName, eventDate } = data

  let specificContent = ""

  switch (type) {
    case "booking":
      specificContent = `
        <p><strong>Booking Details:</strong></p>
        <ul>
          <li><strong>DJ Requested:</strong> ${djId || "Not specified"}</li>
          <li><strong>Venue:</strong> ${venueName || "Not specified"}</li>
          <li><strong>Event Date:</strong> ${eventDate || "Not specified"}</li>
        </ul>
      `
      break
    case "dj_application":
      specificContent = `
        <p><strong>DJ Application Details:</strong></p>
        <p>A new DJ is interested in joining The Switch Talent Agency.</p>
      `
      break
    case "trade_request":
      specificContent = `
        <p><strong>Trade Request Details:</strong></p>
        <p>A DJ is requesting to trade residencies or gigs.</p>
      `
      break
    default:
      specificContent = `<p><strong>General Inquiry</strong></p>`
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Inquiry - Switch Talent Agency</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .footer { margin-top: 20px; padding: 15px; background: #333; color: white; text-align: center; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎵 The Switch Talent Agency</h1>
          <h2>New ${type.replace("_", " ").toUpperCase()} Inquiry</h2>
        </div>
        <div class="content">
          <h3>Contact Information:</h3>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone || "Not provided"}</li>
          </ul>
          
          ${specificContent}
          
          <h3>Message:</h3>
          <p style="background: white; padding: 15px; border-left: 4px solid #8B5CF6; margin: 15px 0;">
            ${message}
          </p>
          
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <div class="footer">
          <p>The Switch Talent Agency - Connecting World-Class DJs</p>
        </div>
      </div>
    </body>
    </html>
  `
}
