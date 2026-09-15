import type { APIRoute } from "astro";
import { Resend } from "resend";

// Error fix
export const prerender = false;

// Grab API key from .env
const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();

    // Form data
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const message = formData.get("message")?.toString().trim();
    const website = formData.get("website")?.toString();

    // Spam detection
    if (website) {
        return new Response("Spam detected", { status: 400 });
    }

    // If fields are left empty
    if (!name || !email || !message) {
        return new Response("Missing fields", { status: 400 });
  }

  // Message
    const { error } = await resend.emails.send({
        from: "Portfolio <hello@yourdomain.com>",
        to: ["your@email.com"],
        subject: `New message from ${name}`,
        replyTo: email,
        text: `
Name: ${name}
Email: ${email}

${message}
        `,
    });

    // Error message
    if (error) {
        console.error(error);
        return new Response("Failed to send", { status: 500 });
    }

    // Success message
    return new Response("Message sent!", { status: 200 });
};
