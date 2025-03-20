"use client";

import { useState } from "react";
import { updateNickname } from "./actions";

interface UpdateNicknameFormProps {
  currentNickname: string;
  userId: string;
}

export default function UpdateNicknameForm({ currentNickname, userId }: UpdateNicknameFormProps) {
  const [nickname, setNickname] = useState(currentNickname);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      const result = await updateNickname(userId, nickname);
      if (result.success) {
        setIsSuccess(true);
        setMessage("Nickname successfully updated!");
      } else {
        setIsSuccess(false);
        setMessage(result.error || "An error occured");
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage("An error occured");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="nickname" className="text-sm font-medium">
          Nickname
        </label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="Choose a nickname"
        />
        <p className="text-xs text-muted-foreground">
          Name visible by other users
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`px-4 py-2 rounded-md transition-colors flex items-center justify-center
          border border-primary hover:bg-primary hover:text-white
          disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? "Mise à jour..." : "Update your nickname"}
      </button>

      {message && (
        <p className={`text-sm ${isSuccess ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
