import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handler(event, context) {
  try {
    // 🟡 Debug line — this helps confirm your key is actually loading
    console.log("API Key loaded:", !!process.env.OPENAI_API_KEY);

    const { year, major, memory } = JSON.parse(event.body);

    const prompt = `
      Write a short, authentic student testimonial for Fort Lewis College.
      Include:
      - Year: ${year}
      - Major: ${major}
      - Favorite Memory: ${memory}
      Do not use a name. Write in first person ("I") and keep the tone warm, natural, and genuine.
      Example style: "As a junior majoring in Environmental Studies, one of my favorite memories at Fort Lewis was hiking with my classmates near campus."
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const result = completion.choices[0].message.content.trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };
  } catch (err) {
    console.error("Error in generate function:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
