"use client";

import React, {
  useEffect,
  useRef,
  useState,
  type JSX,
  type RefObject,
} from "react";

interface TyperComponentProps {
  className?: string;
  strings?: string[];
}

const defaultStrings = ["Bank Account", "Web Payment", "Android & iOS"];

export default function TyperComponent({
  className = "theme-gradient",
  strings = defaultStrings,
}: TyperComponentProps): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);

  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  const stringRefs = useRef<Array<RefObject<HTMLBRElement | null>>>(
    strings.map(() => React.createRef<HTMLBRElement>())
  );

  useEffect(() => {
    const updateWidth = () => {
      const activeEl = stringRefs.current[activeIndex]?.current;
      if (wrapperRef.current && activeEl) {
        wrapperRef.current.style.width = `${activeEl.scrollWidth}px`;
      }
    };

    const timeout = setTimeout(updateWidth, 10);

    const interval = setInterval(() => {
      if (wrapperRef.current) wrapperRef.current.style.width = "0px";

      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % strings.length);
        setTimeout(updateWidth, 10);
      }, 600);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [activeIndex, strings.length]);

  return (
    <span ref={wrapperRef} className="cd-words-wrapper typeanimation">
      {strings.map((text, i) => (
        <b
          key={i}
          ref={stringRefs.current[i]}
          className={`${className} ${
            activeIndex === i ? "is-visible" : "is-hidden"
          }`}
        >
          {text}
        </b>
      ))}
    </span>
  );
}
