"use client";
import SpriteSheetPlayer from "@/components/SpriteSheetPlayer";
import React from "react";

const SpriteSheetPage = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full h-auto max-h-full">
        <SpriteSheetPlayer />
      </div>
    </div>
  );
};

export default SpriteSheetPage;
