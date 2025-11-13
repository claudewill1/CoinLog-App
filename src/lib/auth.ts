import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Ensures a user is authenticated before using server-side actions or API routes.
export async function requireUser() {
    // TODO:
    // 1. Retrieve session using getServerSession(authOptions)
    const session = await getServerSession(authOptions);
    // 2. If no user, throw an authentication error
    if (!session || !session.user || !session.user.id) {
        throw new Error("Unauthorized: You must be logged in to perform this action.");
    }
    // 3. Otherwise return session.user
    return session.user;
}