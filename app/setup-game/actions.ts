"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function getCategories() {
    const supabase = await createClient();

    const {
        data: categories, error: categoriesError
    } = await supabase.from('category').select();

    if (categoriesError) {
        throw new Error(categoriesError.message);
    }
    console.log(categories);
    return categories;
}