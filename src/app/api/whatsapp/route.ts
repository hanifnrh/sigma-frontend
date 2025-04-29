import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM!;
const client = twilio(accountSid, authToken);

export async function POST(req: Request) {
    const { message, to } = await req.json();

    try {
        const response = await client.messages.create({
            body: message,
            from: whatsappFrom,
            to: `whatsapp:${to}`,
        });
        return NextResponse.json({ success: true, sid: response.sid });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}
