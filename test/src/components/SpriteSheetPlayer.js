// SpriteSheetPlayer.js
import { useEffect, useRef } from "react";
import { useState } from "react";

export const ANIMATIONS = {
  IDLE: { start: 0, end: 60, loop: true },
  TOSS: { start: 61, end: 173, loop: true },
  HEAD: { start: 174, end: 204, loop: true },
  TAIL: { start: 205, end: 300, loop: true },
};

const SpriteCanvas = ({
  src,
  frameWidth,
  frameHeight,
  columns,
  fps = 25,
  animation, // { start, end, loop }
  onComplete, // callback after non-loop animation
}) => {
  const canvasRef = useRef(null);
  const frameRef = useRef(animation.start);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    frameRef.current = animation.start;
  }, [animation.start]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = src;

    const frameDuration = 1000 / fps;
    let rafId;

    const animate = (time) => {
      if (time - lastTimeRef.current >= frameDuration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const frame = frameRef.current;
        const col = frame % columns;
        const row = Math.floor(frame / columns);

        ctx.drawImage(
          image,
          col * frameWidth,
          row * frameHeight,
          frameWidth,
          frameHeight,
          0,
          0,
          frameWidth,
          frameHeight
        );

        frameRef.current++;

        if (frameRef.current > animation.end) {
          if (animation.loop) {
            frameRef.current = animation.start;
          } else {
            onComplete?.();
            return;
          }
        }

        lastTimeRef.current = time;
      }

      rafId = requestAnimationFrame(animate);
    };

    image.onload = () => {
      canvas.width = frameWidth;
      canvas.height = frameHeight;
      rafId = requestAnimationFrame(animate);
    };

    return () => cancelAnimationFrame(rafId);
  }, [src, frameWidth, frameHeight, columns, fps, animation, onComplete]);

  return <canvas ref={canvasRef} />;
};

export default function CoinGame() {
  const [anim, setAnim] = useState(ANIMATIONS.IDLE);
  const [resultOpt, setResultOpt] = useState("HEAD");

  setTimeout(() => {
    const result = resultOpt === "HEAD" ? "TAIL" : "HEAD";
    setResultOpt(result);

    const resultANIMATIONS =
      result === "HEAD" ? ANIMATIONS.HEAD : ANIMATIONS.TAIL;

    // 🔥 SWITCH ANIMATION MID-WAY
    console.log("Change animation to", result);
    setAnim(resultANIMATIONS);
  }, 10000);

  return (
    <SpriteCanvas
      src="/sprite_sheet.png"
      frameWidth={486}
      frameHeight={250}
      columns={18}
      animation={anim}
    />
  );
}
