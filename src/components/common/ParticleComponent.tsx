"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Engine, Container } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

interface ParticleComponentProps {
  options: Record<string, unknown>; // You can replace this with a specific type if known (e.g., IOptions from tsparticles)
}

export default function ParticleComponent({ options }: ParticleComponentProps) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  return (
    <>
      {init && (
        <Particles
          id="particles-js"
          particlesLoaded={particlesLoaded}
          options={options}
        />
      )}
    </>
  );
}
