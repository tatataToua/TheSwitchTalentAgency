import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { requestingDjId, targetDjId, requestingVenue, targetVenue, requestedDate, targetDate, message } = body

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("trade_requests")
      .insert({
        requesting_dj_id: requestingDjId,
        target_dj_id: targetDjId,
        requesting_venue: requestingVenue,
        target_venue: targetVenue,
        requested_date: requestedDate,
        target_date: targetDate,
        message,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create trade request" }, { status: 500 })
    }

    const { data: requestingDj } = await supabase
      .from("djs")
      .select("name, stage_name")
      .eq("id", requestingDjId)
      .single()

    const { data: targetDj } = await supabase.from("djs").select("name, stage_name").eq("id", targetDjId).single()

    const emailData = {
      to: "toualee10@gmail.com",
      subject: "[Switch Talent Agency] New Trade Request",
      html: generateTradeRequestEmailHTML({
        requestingDj: requestingDj?.stage_name || requestingDj?.name,
        targetDj: targetDj?.stage_name || targetDj?.name,
        requestingVenue,
        targetVenue,
        requestedDate,
        targetDate,
        message,
      }),
    }

    console.log("[v0] Trade request email would be sent:", emailData)

    return NextResponse.json({
      success: true,
      message: "Trade request submitted successfully",
      tradeRequestId: data.id,
    })
  } catch (error) {
    console.error("Trade request API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateTradeRequestEmailHTML(data: any) {
  const { requestingDj, targetDj, requestingVenue, targetVenue, requestedDate, targetDate, message } = data

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Trade Request - Switch Talent Agency</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .trade-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { margin-top: 20px; padding: 15px; background: #333; color: white; text-align: center; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔄 The Switch Talent Agency</h1>
          <h2>New Trade Request</h2>
        </div>
        <div class="content">
          <div class="trade-details">
            <h3>Trade Details:</h3>
            <p><strong>${requestingDj}</strong> wants to trade with <strong>${targetDj}</strong></p>
            
            <div style="display: flex; justify-content: space-between; margin: 20px 0;">
              <div style="flex: 1; margin-right: 10px;">
                <h4>Requesting DJ's Gig:</h4>
                <p><strong>Venue:</strong> ${requestingVenue}</p>
                <p><strong>Date:</strong> ${requestedDate}</p>
              </div>
              <div style="flex: 1; margin-left: 10px;">
                <h4>Target DJ's Gig:</h4>
                <p><strong>Venue:</strong> ${targetVenue}</p>
                <p><strong>Date:</strong> ${targetDate}</p>
              </div>
            </div>
          </div>
          
          <h3>Message:</h3>
          <p style="background: white; padding: 15px; border-left: 4px solid #8B5CF6; margin: 15px 0;">
            ${message}
          </p>
          
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <div class="footer">
          <p>The Switch Talent Agency - Facilitating DJ Collaborations</p>
        </div>
      </div>
    </body>
    </html>
  `
}
