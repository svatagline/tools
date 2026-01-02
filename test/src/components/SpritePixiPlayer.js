"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

export default function SpritePixiPlayer() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    let app;

    const init = async () => {
      app = new PIXI.Application();

      await app.init({
        width: 256,
        height: 256,
        backgroundAlpha: 0,
      });

      ref.current.appendChild(app.canvas);

      // ✅ CORRECT texture loading
      const texture = await PIXI.Assets.load("/sprite_sheet.png");

      const frameTexture = new PIXI.Texture(
        texture.baseTexture,
        new PIXI.Rectangle(0, 0, 256, 256)
      );

      const sprite = new PIXI.Sprite(frameTexture);
      app.stage.addChild(sprite);
    };

    init();

    return () => {
      if (app) app.destroy(true);
    };
  }, []);

  return <div ref={ref} />;
}
