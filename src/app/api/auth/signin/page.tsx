import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { set } from "zod";

export default function SignInPage() {
    // Used to detect if user was redirected from a protected page
    const searchParams = useSearchParams();
    // Router for progroammatic navigation
    const router = useRouter();

    // Default redirect location after successful login
    const callbackUrl = searchParams.get("callbackUrl") ?? "/coins"

    // Form state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // UI State
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(false);

   /**
    * Handles submission of the credential login form
    *  */
   const handleCredentialsSignIn = async (e: FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      // Use NextAuth to authenticate with Credentials Provider.
      const res = await signIn("credentials", {
        redirect: false, // Prevent automatic redirect
        email,
        password,
        callbackUrl
      });
      
      setLoading(false);

      // If the response fails unexpectedly
      if (!res) {
        setError("Unexpected error occurred.");
        return;
      }

      // If server says credentials are invalid
      if (res.error) {
        setError(res.error);
        return; 
      }

      // If successful, manually redirect the user
      if (res.ok) {
        router.push(res.url || callbackUrl);
      }
    };
    
    /**
    * Handles Github or Google OAuth sign-in
    */

    const handleOAuthSignIn = (provider: "github" | "google") => {
        setError(null);
        setLoading(true);
        
        // For OAuth, we usually let NextAuth handle the redirect
        signIn(provider, { callbackUrl });

    }

    
}