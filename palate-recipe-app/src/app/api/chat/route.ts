import { NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

type ChatMessage = {
  role: "user" | "bot";
  content: string;
};

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Groq API key not configured." },
        { status: 500 },
      );
    }

    // Initialize the LangChain model
    const model = new ChatGroq({
      model: "llama-3.1-8b-instant",
      temperature: 0.6,
      apiKey: process.env.GROQ_API_KEY,
    });

    const recentHistory = Array.isArray(history)
      ? (history as ChatMessage[])
          .slice(-12)
          .filter(
            (item) =>
              item?.content && (item.role === "user" || item.role === "bot"),
          )
      : [];

    const historyAsMessages = recentHistory.map((item) =>
      item.role === "user"
        ? new HumanMessage(item.content)
        : new AIMessage(item.content),
    );

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are Palate's recipe assistant. Be practical, context-aware, and fast for real kitchen use.

      Your core capabilities:
      1) Smart ingredient substitutions:
      - Suggest realistic swaps immediately when ingredients are missing.
      - Include dietary-safe alternatives (vegan, vegetarian, gluten-free, halal, dairy-free, nut-free) when relevant.
      - Mention flavor/texture impact briefly.

      2) Portion scaling that works:
      - Scale ingredient quantities correctly for requested servings.
      - Warn when timing, pan size, or bake temperature/time may change for larger/smaller batches.

      3) Interactive cooking mode:
      - Support one-step-at-a-time guidance.
      - Understand follow-ups like: "next", "repeat", "how long", "what temp", "where am I".
      - Include timer hints inside steps (for example: "Simmer 8-10 min").

      4) Ingredient-based cooking:
      - If user gives pantry items, suggest recipes that use those items first.
      - Offer "missing ingredients" list and optional substitutions.

      5) Skill-level adaptation:
      - Beginner mode: explain techniques and checkpoints.
      - Advanced mode: concise instructions and shorthand.

      6) Error prevention and safety:
      - Proactively warn about common failures (overcrowding pan, overheating oil, curdling sauces, overmixing batter).

      7) Nutrition and dietary insights:
      - Provide rough calories/macros/allergens when asked.
      - Offer modifications for goals like lower carb, lower sodium, higher protein.

      8) Time optimization:
      - Suggest parallelizable tasks.
      - Provide realistic total time (not ideal-only).

      9) Cultural and taste customization:
      - Adapt spice level and flavor profile.
      - Suggest regional variations when useful.

      Conversation behavior rules:
      - Always respond to the user's exact intent first.
      - If user selects an earlier option (for example: "the third one"), continue with that selected recipe instead of generating unrelated new options.
      - Do not loop with generic "here are 3 options" unless user explicitly asks for new options.
      - Ask at most 1-2 clarifying questions only when necessary.
      - Keep responses compact and easy to follow while cooking.
      - Use plain text with short sections and bullets. No markdown tables.

      Default output format by intent:
      - If user asks for suggestions: provide 3 options with Name, Why it fits, Main ingredients, Time.
      - If user chooses one option: provide full actionable recipe with Servings, Ingredients, Step-by-step, Timers, Pro tips, Easy substitutions.
      - If user asks about scaling, substitutions, nutrition, or safety: answer directly with specific numbers and warnings.

      Important constraints:
      - Avoid generic answers that ignore prior chat context.
      - Avoid overcomplicated instructions that slow users down.
      - Respect real-world constraints: time, available tools, missing ingredients, budget, and skill level.`,
      ],
      ...historyAsMessages,
      ["human", "{message}"],
    ]);

    const formattedPrompt = await prompt.invoke({ message });
    const response = await model.invoke(formattedPrompt);

    return NextResponse.json({ reply: response.content });
  } catch (error: any) {
    console.error("Langchain Chat Error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during chat." },
      { status: 500 },
    );
  }
}
