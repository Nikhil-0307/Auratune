export default async function handler(req, res) {
    // Allow POST requests only
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const { image } = req.body;

        // Check image
        if (!image) {
            return res.status(400).json({
                error: "No image was provided"
            });
        }

        // Check API key
        if (!process.env.OPENROUTER_API_KEY) {
            return res.status(500).json({
                error: "OpenRouter API key is not configured"
            });
        }

        // Send image to OpenRouter
        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                        `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "HTTP-Referer":
                        "https://auratune-two.vercel.app/",
                    "X-Title":
                        "AuraTune"
                },

                body: JSON.stringify({
                    model: "openrouter/free",

                    messages: [
                        {
                            role: "user",

                            content: [
                                {
                                    type: "text",

                                    text: `
You are the AI vision engine for AuraTune.

Analyze the uploaded image and determine
what kind of music would best match its
visual atmosphere.

Return ONLY valid JSON.

Use exactly this structure:

{
  "scene": "string",
  "description": "string",
  "mood": [
    "string",
    "string",
    "string"
  ],
  "energy": 0,
  "style": "string",
  "music_type": "string",
  "instruments": [
    "string",
    "string",
    "string"
  ]
}

Rules:

1. scene:
Describe the main visual environment.

2. description:
Give a short description of the atmosphere.

3. mood:
Return exactly 3 mood words.

4. energy:
Return a number between 0 and 100.

5. style:
Choose an appropriate music style.

6. music_type:
Choose an appropriate music category.

7. instruments:
Return exactly 3 suitable instruments,
sounds or musical elements.

Examples:

Sunset beach:
Calm, Peaceful, Dreamy
Ambient / Cinematic

Mountain:
Epic, Adventurous, Inspirational
Epic Cinematic

Night city:
Energetic, Futuristic, Mysterious
Synthwave / Electronic

Rain:
Peaceful, Reflective, Atmospheric
Lo-Fi Ambient

Forest:
Natural, Relaxing, Refreshing
Organic Ambient

Do not use Markdown.
Do not add explanations.
Return JSON only.
`
                                },

                                {
                                    type: "image_url",

                                    image_url: {
                                        url: image
                                    }
                                }
                            ]
                        }
                    ]
                })
            }
        );

        // Convert OpenRouter response to JSON
        const data = await response.json();

        // Handle API errors
        if (!response.ok) {
            console.error(
                "OpenRouter error:",
                data
            );

            return res.status(
                response.status
            ).json({
                error:
                    data?.error?.message ||
                    "OpenRouter request failed"
            });
        }

        // Get AI response
        const output =
            data?.choices?.[0]?.message?.content;

        if (!output) {
            return res.status(500).json({
                error:
                    "No analysis was returned by the AI"
            });
        }

        // Remove possible Markdown code fences
        const cleanedOutput =
            output
                .replace(/```json/gi, "")
                .replace(/```/g, "")
                .trim();

        // Convert AI response to JSON
        let analysis;

        try {
            analysis =
                JSON.parse(cleanedOutput);
        } catch (error) {
            console.error(
                "Invalid AI JSON:",
                cleanedOutput
            );

            return res.status(500).json({
                error:
                    "AI returned invalid JSON"
            });
        }

        // Send result back to AuraTune
        return res.status(200).json({
            success: true,
            analysis: analysis
        });

    } catch (error) {

        console.error(
            "AuraTune error:",
            error
        );

        return res.status(500).json({
            error:
                "AuraTune image analysis failed"
        });
    }
}