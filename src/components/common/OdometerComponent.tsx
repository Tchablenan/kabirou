"use client";

import Odometer from "odometer";
import { useEffect, useRef, useState } from "react";

const OdometerComponent = ({ max = 100 }) => {
  const odometerRef = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const odometerInitRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Odometer or do something with it

    // Example usage of Odometer
    if (odometerRef.current) {
      odometerInitRef.current = new Odometer({
        el: odometerRef.current,
        value,
      });
    }
  }, [value]);
  useEffect(() => {
    if (odometerRef.current && odometerInitRef.current) {
      odometerInitRef.current.update(value); // Update odometer when value changes
    }
  }, [value]);

  useEffect(() => {
    const startCountup = () => {
      setValue(max);
    };

    const handleIntersection: IntersectionObserverCallback = (
      entries,
      observer
    ) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCountup();
          observer.unobserve(entry.target);
        }
      });
    };

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    if (odometerRef.current) {
      observer.observe(odometerRef.current);
    }

    return () => {
      if (odometerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(odometerRef.current);
      }
      observer.disconnect();
    };
  }, [max]);

  return (
    <>
      <div ref={odometerRef} className="odometer">
        0
      </div>
    </>
  );
};

export default OdometerComponent;
