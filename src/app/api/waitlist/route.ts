import { NextRequest, NextResponse } from "next/server";
import { sendWaitlistNotification, sendWaitlistConfirmation } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, practice, role } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Send email notification
    const sent = await sendWaitlistNotification({
      name,
      email,
      practice: practice || "",
      role: role || "",
    });

    if (!sent) {
      console.error("Waitlist signup (notification failed):", { name, email, practice, role });
    }

    // Send confirmation email to the person who signed up
    const confirmed = await sendWaitlistConfirmation({
      name,
      email,
      practice: practice || "",
      role: role || "",
    });

    if (!confirmed) {
      console.error("Waitlist confirmation email failed:", { email });
    }

    console.log("Waitlist signup:", { name, email, practice, role, timestamp: new Date().toISOString() });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Waitlist API error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
