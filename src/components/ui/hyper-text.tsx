"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import { useEffect, useRef, useState, forwardRef } from "react";

import { cn } from "@/lib/utils";

interface HyperTextProps {
  text: string;
  duration?: number;
  framerProps?: Variants;
  className?: string;
  animateOnLoad?: boolean;
  onAnimationEnd?: () => void;
}

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const getRandomInt = (max: number) => Math.floor(Math.random() * max);

const HyperText = forwardRef(function HyperText(
  {
    text,
    duration = 800,
    framerProps = {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 3 },
    },
    className,
    animateOnLoad = true,
    onAnimationEnd,
  }: HyperTextProps,
  ref
) {
  const [displayText, setDisplayText] = useState(text.split(""));
  const interations = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAnimation = () => {
    interations.current = 0;
    clearInterval(intervalRef.current!); // Clear any ongoing interval
    intervalRef.current = setInterval(() => {
      if (interations.current < text.length) {
        setDisplayText((t) =>
          t.map((l, i) =>
            l === " "
              ? l
              : i <= interations.current
                ? text[i]
                : alphabets[getRandomInt(26)]
          )
        );
        interations.current += 0.1;
      } else {
        clearInterval(intervalRef.current!);
        if (onAnimationEnd) onAnimationEnd();
      }
    }, duration / (text.length * 10));
  };

  useEffect(() => {
    setDisplayText(text.split(""));
    startAnimation();
    return () => clearInterval(intervalRef.current!);
  }, [text]);

  return (
    <div className="flex scale-100 cursor-default overflow-hidden">
      <AnimatePresence>
        {displayText.map((letter, index) => (
          <motion.span
            key={index}
            className={cn("font-mono", letter === " " ? "w-3" : "", className)}
            {...framerProps}
          >
            {letter.toUpperCase()}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
});

export default HyperText;
