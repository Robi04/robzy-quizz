"use client";

import { useState } from "react";
import Link from "next/link";

export default function QuizSetupForm() {
  const [questionCount, setQuestionCount] = useState(5);
  
  return (
    <form className="space-y-6">
      {/* Nombre de questions */}
      <div className="space-y-2">
        <label htmlFor="question-count" className="text-lg font-medium block">
          Number of Questions
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            id="question-count"
            min="1"
            max="20"
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xl font-semibold text-primary min-w-[2rem] text-center">
            {questionCount}
          </span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>1</span>
          <span>10</span>
          <span>20</span>
        </div>
      </div>
      
      {/* Sélection de la catégorie */}
      <div className="space-y-2">
        <label htmlFor="category" className="text-lg font-medium block">
          Question Category
        </label>
        <select 
          id="category" 
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none bg-background"
          defaultValue="general"
        >
          <option value="general">General Knowledge</option>
          <option value="science">Science</option>
          <option value="history">History</option>
          <option value="geography">Geography</option>
          <option value="entertainment">Entertainment</option>
          <option value="sports">Sports</option>
        </select>
      </div>
      
      {/* Bouton de démarrage */}
      <Link
        href="#"
        className="w-full block text-center mt-6 bg-primary hover:bg-primary/90 text-secondary py-3 px-4 rounded-lg font-medium text-lg transition-colors"
      >
        Start Quiz
      </Link>
    </form>
  );
}
