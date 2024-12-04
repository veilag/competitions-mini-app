import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface HyperTextProps {
  text: string;
  duration?: number;
  className?: string;
  animateOnLoad?: boolean;
  onAnimationEnd?: () => void;
}

const alphabets = "АБВГДЕËЖЗИЙКЛМНОПРСТИФХЦЧШЩЬЪЭЮЯ".split("");

const getRandomInt = (max: number) => Math.floor(Math.random() * max);

const HyperText = forwardRef(function HyperText(
  {
    text,
    className,
    onAnimationEnd,
  }: HyperTextProps
) {
  const [displayText, setDisplayText] = useState(text.split(""));
  const iterations = useRef(0);

  const startAnimation = () => {
    iterations.current = 0;

    const animate = () => {
      if (iterations.current < text.length) {
        setDisplayText((t) =>
          t.map((l, i) =>
            l === " "
              ? l
              : i <= iterations.current
                ? text[i]
                : alphabets[getRandomInt(32)]
          )
        );
        iterations.current += 0.5;
        requestAnimationFrame(animate);
      } else if (onAnimationEnd) {
        onAnimationEnd();
      }
    };

    animate();
  };

  useEffect(() => {
    setDisplayText(text.split(""));
    startAnimation();
  }, [text]);

  return (
    <div className="flex scale-100 cursor-default overflow-hidden">
      <AnimatePresence>
        {displayText.map((letter, index) => (
          <motion.span
            key={index}
            className={cn("font-mono", letter === " " ? "w-3" : "", className)}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 3 }}
          >
            {letter.toUpperCase()}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
});

export default HyperText;
