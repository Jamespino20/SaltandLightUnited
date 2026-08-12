import { NextResponse } from "next/server";
import { chatWithSLU } from "@/lib/gemini";
import { ChatMessage } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: "Messages array is required" },
        { status: 400 }
      );
    }

    const validMessages: ChatMessage[] = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    }));

    const reply = await chatWithSLU(validMessages);

    return NextResponse.json({
      success: true,
      data: { role: "assistant", content: reply },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Chat failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
