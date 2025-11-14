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
    const [loading, setLoading] = useState(false);

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

    return (
        <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center">
            <div className="relatie w-full max-w-md">

                {/* Decorative gradient glow behind card */}
                <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-br from-amber-400/40 via-amber-500/30 blur-2xl opacity-70"/>

                {/* Main card container */}
                <div className="relative rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/60 backdrop-blur-xl">

                    {/* ----- Header ----- */}
                    <header className="mb-6 space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Welcome back to <span className="text-amber-300">CoinLog</span>
                        </h1>
                        <p className="text-xs text-slate-400">
                            Sign in to keep your coin collection organized and valued.
                        </p>
                    </header>


                    {/* Error display */}
                    {error && (
                        <div className="mb-4 rounded-xl border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                            {error}
                        </div>
                    )}

                    {/* ----- Credentials Login Form ----- */}
                    <form onSubmit={handleCredentialsSignIn} className="space-y-4">

                        {/* Email field */}
                        <div className="space-y-1 text-left">
                            <label className="block text-xs font-medium text-slate-200">
                                Email
                            </label>
                            <input
                                required
                                type="email"
                                placeholder="you@example.com"
                                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 shadow-inner"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password field */}
                        <div className="space-y-1 text-left">
                            <label className="block text-xs font-medium text-slate-200">
                                Password
                            </label>
                            <input
                                required
                                type="password"
                                placeholder="Your password"
                                className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 shadow-inner"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-1 w-full rounded-2xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg"
                        >
                            {loading ? "Signing in..." : "Sign in with email"}
                        </button>

                    </form>

                    {/* Divider */}
                    <div className="my-5 flex items-center gap-3 text-[10px] text-slate-500">
                        <span className="h-px flex-1 bg-slate-700"/>
                        <span className="uppdercase tracking-[0.2em]">
                            or continue with    
                        </span>
                        <span className="h-px flex-1 bg-slate-700"/>  
                    </div>

                    {/* ----- OAuth Buttons ----- */}
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => handleOAuthSignIn("github")}
                            className="flex w-full items-center justify-center rounded-2xl border border-slate-700 px-4 py-2 text-xs hover:bg-slate-800"
                        >
                            Sign in with GitHub
                        </button>
                        <button
                            onClick={() => handleOAuthSignIn("google")}
                            className="flex w-full items-center justify-center rounded-2xl border border-slate-700 px-4 py-2 text-xs hover:bg-slate-800"
                        >
                            Sign in with Google
                        </button>
                    </div>

                    {/* Footer small text */}
                    <p className="mt-5 text-center text-[11px] text-slate-500">
                        Don't have an account?{" "}
                        <span className="text-amber-300">
                            Use Google or GitHub to get started instantly.
                        </span>
                    </p>

                    <p className="mt-2 text-center text-[10px] text-slate-500">
                        <Link href="/" className="hover:text-slate-300">
                            ← Back to home
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )

    
}