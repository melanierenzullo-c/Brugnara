import { ConvexClient } from "convex/browser";
import fs from "fs";

const client = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL || "https://cautious-guanaco-567.eu-west-1.convex.cloud");

async function testUpload() {
    try {
        console.log("1. Fetching upload URL...");
        const uploadUrl = await client.mutation("files:generateUploadUrl");
        console.log("Upload URL:", uploadUrl);

        console.log("2. Uploading dummy image...");
        // Create a tiny valid dummy image (1x1 transparent PNG)
        const dummyImageBuffer = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");

        const uploadResult = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": "image/png" },
            body: dummyImageBuffer,
        });

        if (!uploadResult.ok) {
            throw new Error(`Upload failed: ${uploadResult.statusText}`);
        }

        const { storageId } = await uploadResult.json();
        console.log("Uploaded! Storage ID:", storageId);

        console.log("3. Fetching categories to get an ID...");
        const cats = await client.query("kategorien:list");
        if (!cats || cats.length === 0) throw new Error("No categories found");
        const katId = cats[0]._id;

        console.log("4. Creating product...");
        const productId = await client.mutation("produkte:create", {
            name: "Test Produkt",
            beschreibung: "Das ist ein Test",
            foto: storageId,
            nameIt: "Prodotto Test",
            beschreibungIt: "Questo è un test",
            kategorieId: katId,
            slug: "test-produkt",
        });

        console.log("✅ Success! Product created with ID:", productId);
    } catch (err) {
        console.error("❌ Error:", err);
    }
}

testUpload();
