// SpriteSheetPlayer.js
import { useEffect, useRef } from "react";
import { useState } from "react";

export const ANIMATIONS = {
  COMMON: { start: 0, end: 134 },
  HEAD: { start: 135, end: 185 },
  TAIL: { start: 187, end: 239 },
};

const SpriteCanvas = ({
  src,
  frameWidth,
  frameHeight,
  columns,
  fps = 15,
  animation,
  onComplete,
  roundId,
}) => {
  const canvasRef = useRef(null);
  const frameRef = useRef(animation.start);
  const lastTimeRef = useRef(null);
  const rafRef = useRef(null);
  const animIdRef = useRef(Math.random().toString(36).slice(2, 7));

  useEffect(() => {
    console.log(
      `%c[ROUND ${roundId}] ▶️ ANIMATION START [${animation.start} → ${animation.end}] (animId=${animIdRef.current})`,
      "color: orange"
    );

    frameRef.current = animation.start;
    lastTimeRef.current = null;
  }, [animation, roundId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = src;

    const frameDuration = 1000 / fps;

    const animate = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;

      if (time - lastTimeRef.current >= frameDuration) {
        const frame = frameRef.current;

        console.log(
          `[ROUND ${roundId}] frame=${frame} animId=${animIdRef.current}`
        );

        ctx.clearRect(0, 0, canvas.width, canvas.height);

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
          console.log(`%c[ROUND ${roundId}] ⛔ ANIMATION END`, "color: red");

          cancelAnimationFrame(rafRef.current);
          onComplete?.();
          return;
        }

        lastTimeRef.current = time;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    image.onload = () => {
      console.log(`%c[ROUND ${roundId}] 🖼 IMAGE LOADED`, "color: gray");

      canvas.width = frameWidth;
      canvas.height = frameHeight;
      rafRef.current = requestAnimationFrame(animate);
    };

    return () => {
      console.log(`%c[ROUND ${roundId}] ❌ RAF CLEANUP`, "color: purple");
      cancelAnimationFrame(rafRef.current);
    };
  }, [
    src,
    frameWidth,
    frameHeight,
    columns,
    fps,
    animation,
    onComplete,
    roundId,
  ]);

  return <canvas ref={canvasRef} />;
};

export default function SpriteSheetPlayer() {
  const [anim, setAnim] = useState(ANIMATIONS.COMMON);
  const [tossOption, setTossOption] = useState("HEAD"); // just for demo
  const roundIdRef = useRef(0);
  const resultRef = useRef(null);

  const startRound = () => {
    roundIdRef.current += 1;
    resultRef.current = null;

    console.log(
      `%c[ROUND ${roundIdRef.current}] START → COMMON`,
      "color: cyan"
    );

    setAnim({ ...ANIMATIONS.COMMON });
  };

  useEffect(() => {
    startRound();
  }, []);

  const handleCommonComplete = () => {
    setTossOption(tossOption === "HEAD" ? "TAIL" : "HEAD"); // just for demo
    const result = tossOption; //Math.random() < 0.5 ? "HEAD" : "TAIL";
    resultRef.current = result;

    console.log(
      `%c[ROUND ${roundIdRef.current}] RESULT = ${result}`,
      "color: yellow"
    );

    setAnim({ ...(result === "HEAD" ? ANIMATIONS.HEAD : ANIMATIONS.TAIL) });
  };

  const handleResultComplete = () => {
    console.log(
      `%c[ROUND ${roundIdRef.current}] END (${resultRef.current})`,
      "color: lime"
    );

    setTimeout(startRound, 500); // next round
  };

  return (
    <SpriteCanvas
      src="/sprite_sheet.png"
      frameWidth={306}
      frameHeight={208}
      columns={16}
      animation={anim}
      roundId={roundIdRef.current}
      onComplete={
        anim.start === ANIMATIONS.COMMON.start
          ? handleCommonComplete
          : handleResultComplete
      }
    />
  );
}
