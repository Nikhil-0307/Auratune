export default async function handler(req, res) {

    // =====================================================
    // ALLOW POST ONLY
    // =====================================================

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const { image, mode } = req.body;

        // =====================================================
        // CHECK IMAGE
        // =====================================================

        if (!image) {
            return res.status(400).json({
                error: "No image was provided"
            });
        }

        // =====================================================
        // CHECK API KEY
        // =====================================================

        if (!process.env.OPENROUTER_API_KEY) {
            return res.status(500).json({
                error: "OpenRouter API key is not configured"
            });
        }

        // =====================================================
        // PROMPT
        // =====================================================

        let prompt;

        if (mode === "story") {

            prompt = `
You are the AI Story Engine for AuraTune.

Look carefully at the uploaded image.

Create a short cinematic story inspired by
the visual atmosphere of the image.

Return ONLY valid JSON.

Use exactly this structure:

{
  "title": "A short cinematic title",
  "text": "The story goes here."
}

Rules:

- title must contain 3 to 8 words.
- text must contain approximately 80 to 140 words.
- Make the story emotional, imaginative and cinematic.
- Describe the atmosphere and environment visible in the image.
- You may creatively imagine events or characters.
- Do not claim imaginary details are confirmed facts.
- Keep the story suitable for a general audience.
- Do not use Markdown.
- Do not use code blocks.
- Do not add explanations.
- Return JSON only.
`;

        } else {

            prompt = `
You are the AI vision engine for AuraTune.

Analyze the uploaded image and determine
what kind of music best matches its visual atmosphere.

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

- scene: describe the main visual environment.
- description: describe the atmosphere.
- mood: exactly 3 mood words.
- energy: number from 0 to 100.
- style: appropriate music style.
- music_type: appropriate music category.
- instruments: exactly 3 suitable instruments,
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
Do not use code blocks.
Do not add explanations.
Return JSON only.
`;
        }

        // =====================================================
        // SEND IMAGE TO OPENROUTER
        // =====================================================

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

                    // Vision-capable model
                    model: "openrouter/free",

                    messages: [
                        {
                            role: "user",

                            content: [

                                {
                                    type: "text",
                                    text: prompt
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

        // =====================================================
        // READ OPENROUTER RESPONSE
        // =====================================================

        const data = await response.json();

        // =====================================================
        // OPENROUTER ERROR
        // =====================================================

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

        // =====================================================
        // GET AI OUTPUT
        // =====================================================

        let output =
            data?.choices?.[0]?.message?.content;

        console.log(
            "RAW AI OUTPUT:",
            output
        );

        if (!output) {

            return res.status(500).json({
                error:
                    "No response was returned by the AI"
            });
        }

        // =====================================================
        // HANDLE POSSIBLE ARRAY CONTENT
        // =====================================================

        if (Array.isArray(output)) {

            output = output
                .map(item => item?.text || "")
                .join("");

        }

        // Make sure output is a string
        output = String(output).trim();

        // =====================================================
        // CLEAN AI OUTPUT
        // =====================================================

        let cleanedOutput = output
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        // =====================================================
        // PARSE JSON
        // =====================================================

        let result;

        try {

            result = JSON.parse(cleanedOutput);

        } catch (error) {

            console.error(
                "Direct JSON parsing failed:"
            );

            console.error(
                cleanedOutput
            );

            // =================================================
            // TRY TO FIND JSON OBJECT
            // =================================================

            const start =
                cleanedOutput.indexOf("{");

            const end =
                cleanedOutput.lastIndexOf("}");

            if (
                start !== -1 &&
                end !== -1 &&
                end > start
            ) {

                const possibleJSON =
                    cleanedOutput.substring(
                        start,
                        end + 1
                    );

                try {

                    result =
                        JSON.parse(
                            possibleJSON
                        );

                } catch (secondError) {

                    console.error(
                        "JSON extraction failed:",
                        possibleJSON
                    );

                    return res.status(500).json({
                        error:
                            "AI returned invalid JSON"
                    });
                }

            } else {

                return res.status(500).json({
                    error:
                        "AI returned invalid JSON"
                });
            }
        }

        // =====================================================
        // STORY MODE RESPONSE
        // =====================================================

        if (mode === "story") {

            if (
                !result ||
                !result.title ||
                !result.text
            ) {

                return res.status(500).json({
                    error:
                        "AI returned an incomplete story"
                });
            }

            return res.status(200).json({

                success: true,

                story: {
                    title:
                        String(result.title),

                    text:
                        String(result.text)
                }

            });
        }

        // =====================================================
        // NORMAL AURATUNE ANALYSIS
        // =====================================================

        return res.status(200).json({

            success: true,

            analysis: result

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