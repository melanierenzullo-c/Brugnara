import { ConvexClient } from "convex/browser";

const client = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

async function clearProducts() {
    // We can't write generic mutations from the client,
    // but let's just create a new file in `convex/` and run `npx convex run`.
    // Wait, if `npx convex dev` isn't pushing, I need to find out WHY it's not pushing!
}

clearProducts();
