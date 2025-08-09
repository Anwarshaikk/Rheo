'use client';

import { RheoButton } from "@/components/rheo/RheoButton";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  return (
    <main className="rheo-hero flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg text-center">
        <h1 className="text-4xl font-bold text-rheo-text mb-4">Welcome to Rheo</h1>
        <p className="text-rheo-subtle mb-8">From idea to invoice.</p>
        <RheoButton onClick={handleSignIn}>
          Sign in with Google
        </RheoButton>
      </div>
    </main>
  );
}
