"use client";
import SpritePixiPlayer from "@/components/SpritePixiPlayer";
import SpriteCanvas from "@/components/SpriteSheetPlayer";
import React from "react";

const SpriteSheetPage = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full h-auto max-h-full">
        <SpriteCanvas
          src="/sprite_sheet.png"
          frameWidth={486}
          frameHeight={250}
          totalFrames={176}
          columns={14}
          fps={20}
          style={{
            width: "50vw",
            height: "auto",
          }}
        />
        {/* <SpritePixiPlayer /> */}
      </div>
    </div>
  );
};

export default SpriteSheetPage;
