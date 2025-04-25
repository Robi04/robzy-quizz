"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCategories } from "./actions";

// Type pour les catégories
interface Category {
  id: string;
  lib_category: string;
}

export default function QuizSetupForm() {
  const [questionCount, setQuestionCount] = useState(5);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("general");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          setSelectedCategory(data[0].id);
        } else {
          setError("Aucune catégorie disponible");
        }
      } catch (error) {
        console.error("Erreur:", error);
        setError("Impossible de charger les catégories");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

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
        {loading ? (
          <div className="p-2 text-center">Chargement des catégories...</div>
        ) : error ? (
          <div className="p-2 text-center text-red-500">{error}</div>
        ) : (
          <select 
            id="category" 
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none bg-background"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
              <option key='7' value='7'>
              General Knowledge
              </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.lib_category}
              </option>
            ))}
          </select>
        )}
      </div>
      
      {/* Bouton de démarrage */}
      <Link
        href={`/game?category=${selectedCategory}&count=${questionCount}`}
        className={`w-full block text-center mt-6 bg-primary ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'} text-secondary py-3 px-4 rounded-lg font-medium text-lg transition-colors`}
        aria-disabled={loading}
        onClick={(e) => loading && e.preventDefault()}
      >
        {loading ? "Chargement..." : "Start Quiz"}
      </Link>
    </form>
  );
}
