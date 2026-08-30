export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Only POST requests are allowed."
        });
    }

    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({
                error: "No image received."
            });
        }

        const response = await fetch(
            "https://api.openai.com/v1/responses",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                        `Bearer ${process.env.OPENAI_API_KEY}`
                },

                body: JSON.stringify({
                    model: "gpt-5.6",

                    input: [
                        {
                            role: "user",

                            content: [
                                {
                                    type: "input_text",

                                    text: `
Analyze this image for AuraTune.

Determine the visual scene, atmosphere,
mood, energy level and suitable music style.

Return ONLY valid JSON:

{
  "scene": "string",
  "description": "string",
  "mood": ["string", "string", "string"],
  "energy": 0,
  "style": "string",
  "music_type": "string",
  "instruments": ["string", "string", "string"]
}

Rules:
- scene describes the main environment.
- description briefly describes the atmosphere.
- mood contains exactly 3 mood words.
- energy is a number from 0 to 100.
- style is a suitable music style.
- music_type is a suitable music category.
- instruments contains exactly 3 instruments or sound elements.
- Return JSON only.
`
                                },

                                {
                                    type: "input_image",
                                    image_url: image
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("OpenAI error:", data);

            return res.status(response.status).json({
                error:
                    data.error?.message ||
                    "OpenAI request failed."
            });
        }

        const output = data.output_text;

        if (!output) {
            return res.status(500).json({
                error: "No analysis returned."
            });
        }

        let analysis;

        try {
            analysis = JSON.parse(output);
        } catch {
            return res.status(500).json({
                error: "AI returned invalid JSON."
            });
        }

        return res.status(200).json({
            success: true,
            analysis
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "AuraTune image analysis failed."
        });
    }
}