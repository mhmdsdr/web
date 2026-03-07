import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import fs from "fs";
import path from "path";

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    // Read local inventory
    const booksFilePath = path.join(process.cwd(), "src/data/books.json");
    let inventory = "";
    try {
        const booksData = fs.readFileSync(booksFilePath, "utf8");
        const books = JSON.parse(booksData);
        inventory = books.map((b: any) =>
            `- ${b.title} by ${b.author} (${b.category}): ${b.description || "No description"}. Price: ${b.price} IQD.`
        ).join("\n");
    } catch (e) {
        console.error("Error reading inventory:", e);
    }

    const result = await streamText({
        model: openai("gpt-4o"),
        system: `You are a helpful and friendly librarian at Taswahn Bookstore in Maysan, Iraq. 
                 You help customers find books and explain their content based on the provided inventory. 
                 Be polite and professional. Respond in Arabic.
                 
                 Here is the current bookstore inventory:
                 ${inventory}
                 
                 If a user asks for suggestions, use this inventory. If they ask about a book not in the list, tell them we can try to order it for them.
                 Only talk about books and bookstore services.`,
        messages,
    });

    // return result.toDataStreamResponse();
    return new Response("Chat is currently disabled for build fixes.");
}
