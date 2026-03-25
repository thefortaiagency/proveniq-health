import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { sendWaitlistNotification } from "@/lib/email";

const DATA_FILE = path.join(process.cwd(), "data", "waitlist.json");

interface WaitlistEntry {
  name: string;
  email: string;
  practice: string;
  role: string;
  timestamp: string;
}

async function getEntries(): Promise<WaitlistEntry[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveEntries(entries: WaitlistEntry[]) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2));
}

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

    const entries = await getEntries();

    // Check for duplicate email
    if (entries.some((e) => e.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json(
        { error: "This email is already on the waitlist" },
        { status: 409 }
      );
    }

    entries.push({
      name,
      email,
      practice: practice || "",
      role: role || "",
      timestamp: new Date().toISOString(),
    });

    await saveEntries(entries);

    // Send email notification (don't block on failure)
    sendWaitlistNotification({ name, email, practice: practice || "", role: role || "" })
      .catch((err) => console.error("Email notification failed:", err));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
