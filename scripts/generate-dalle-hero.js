#!/usr/bin/env node

const https = require("https");
const fs = require("fs");
const path = require("path");

const PROMPT = "A wide cinematic abstract visualization representing clinical data intelligence. No people or faces. A sleek modern desktop monitor sitting on a clean white desk displays an elegant clinical analytics dashboard with charts and data visualizations in deep teal and warm gold on a white interface. Floating translucent data elements emerge subtly from the screen, rendered as clean geometric forms with teal-to-gold gradients. Clean white and light gray background. Photorealistic product photography style, editorial lighting, sharp focus. Professional health technology aesthetic. No text, no words, no letters on screen. Minimal, premium, business-professional.";

const config = {
  model: "dall-e-3",
  prompt: PROMPT,
  n: 1,
  size: "1792x1024",
  quality: "hd",
  style: "natural",
};

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("Set OPENAI_API_KEY");
    process.exit(1);
  }

  console.log("Generating DALL-E hero image (no humans)...");

  const data = JSON.stringify(config);

  const options = {
    hostname: "api.openai.com",
    port: 443,
    path: "/v1/images/generations",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiKey,
      "Content-Length": Buffer.byteLength(data),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = "";
      res.on("data", (chunk) => { responseData += chunk; });
      res.on("end", () => {
        const response = JSON.parse(responseData);
        if (response.error) {
          console.error("API Error:", response.error.message);
          reject(response.error);
          return;
        }

        const imageUrl = response.data[0].url;
        console.log("Revised prompt:", response.data[0].revised_prompt);

        const outPath = path.join(__dirname, "..", "public", "images", "hero-visual.png");
        https.get(imageUrl, (imgRes) => {
          const file = fs.createWriteStream(outPath);
          imgRes.pipe(file);
          file.on("finish", () => {
            file.close();
            console.log("Saved to:", outPath);
            resolve();
          });
        });
      });
    });

    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

main().catch(console.error);
