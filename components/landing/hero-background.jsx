"use client";

import { motion } from "motion/react";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main large rotating circle */}

      <motion.div
        initial={{ rotateX: 0, rotateY: 0, rotateZ: 0}}
        animate={{
          rotateX: [40, 45, -30, 60, 40],
          rotateY: [0, -60, 40, -20, 0],
          rotateZ: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] border border-white/50 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.1)]"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Secondary inner circle with inverse 3D rotation */}
        <motion.div
          animate={{
            rotateX: [90, -60, 30, -45, 90],
            rotateY: [90, 40, -20, 60, 90],
            rotateZ: [360, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 border border-white/50 rounded-full shadow-inner"
        />
                <motion.div
          animate={{
            rotateX: [180, -45, 45, -30, 30, 180],
            rotateY: [180, 40, -20, 60, 180],
            rotateZ: [360, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 border border-white/50 rounded-full shadow-inner"
        />


      </motion.div>

      {/* Additional floating ambient circles */}
    
    </div>
  );
}
