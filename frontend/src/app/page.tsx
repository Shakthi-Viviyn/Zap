"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 relative px-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 drop-shadow-md leading-tight">
          Welcome  
          <br />
          to<span className="text-blue-600"> Zap!</span>
        </h1>
        <p className="text-lg text-gray-600 mt-4 drop-shadow-sm">
          Making your crypto easier.
        </p>
      </div>

      <div className="mt-6 flex space-x-4">
        <Button variant="outline" onClick={() => router.push("/login")}>Login</Button>
        <Button onClick={() => router.push("/signup")}>Sign Up</Button>
      </div>
    </div>
  );
}
