import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import QuizSetupForm from "./QuizSetupForm";

export default async function SetupGamePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-8">Quiz Setup</h1>
        <div className="max-w-md mx-auto">
          <div className="bg-card rounded-lg shadow-sm p-8">
            <QuizSetupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
