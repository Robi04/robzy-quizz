import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowRightIcon, MicIcon, BrainIcon } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-accent/20">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-2 text-primary">
              <MicIcon className="h-6 w-6" />
              <BrainIcon className="h-6 w-6" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 tracking-tight">
              Robzy Quizz
            </h1>
            <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Experience the next generation of quizzes powered by AI. Answer questions using your voice and challenge your knowledge in an interactive and engaging way.
            </p>
            <div className="flex flex-col md:flex-row gap-4 min-[400px]:flex-row">
              {user ? (
                <>
                <Link 
                  href="/setup-game"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 group"
                >
                  Start Playing
                  <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                 <Link 
                  href="/profile"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                 My Profile
               </Link>
               </>
              ) : (
                <>
                <Link 
                  href="/sign-in"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 group"
                >
                  Sign In to Play
                  <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (optional) */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center gap-2 p-6 bg-card rounded-lg shadow-sm">
              <MicIcon className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-semibold">Voice-Powered</h3>
              <p className="text-muted-foreground">Answer quiz questions using your voice for a hands-free experience.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2 p-6 bg-card rounded-lg shadow-sm">
              <BrainIcon className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-semibold">AI-Generated</h3>
              <p className="text-muted-foreground">Enjoy unique questions crafted by artificial intelligence.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2 p-6 bg-card rounded-lg shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10 text-primary"
              >
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
              </svg>
              <h3 className="text-xl font-semibold">Engaging Challenges</h3>
              <p className="text-muted-foreground">Test your knowledge across various topics and difficulty levels.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
