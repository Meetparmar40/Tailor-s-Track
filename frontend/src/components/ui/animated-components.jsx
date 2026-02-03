'use client';

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import * as React from 'react';
import { cn } from '@/lib/utils';

// Animated Grid Background - Magic UI Style
export function GridBackground({ children, className }) {
  return (
    <div className={cn("relative w-full bg-white", className)}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
      {children}
    </div>
  );
}

// Animated Beam - Magic UI Style
export function AnimatedBeam({ className, delay = 0 }) {
  return (
    <motion.div
      className={cn("absolute h-px w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent", className)}
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: "100%", opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 3,
        delay: delay,
        repeat: Infinity,
        repeatDelay: 2,
        ease: "easeInOut"
      }}
    />
  );
}

// Floating Orbs Animation
export function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "absolute rounded-full blur-3xl",
            i % 2 === 0 ? "bg-teal-500/20" : "bg-cyan-500/20"
          )}
          style={{
            width: `${150 + i * 50}px`,
            height: `${150 + i * 50}px`,
            left: `${10 + i * 20}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}

// Sparkles Animation - Aceternity UI Style
export function Sparkles({ children, className }) {
  const [sparkles, setSparkles] = React.useState([]);

  React.useEffect(() => {
    const generateSparkle = () => ({
      id: Math.random(),
      createdAt: Date.now(),
      size: Math.random() * 10 + 5,
      style: {
        top: Math.random() * 100 + "%",
        left: Math.random() * 100 + "%",
        zIndex: 2,
      },
    });

    const interval = setInterval(() => {
      const now = Date.now();
      const sparkle = generateSparkle();
      setSparkles((s) => [...s.filter((sp) => now - sp.createdAt < 750), sparkle]);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className={cn("relative inline-block", className)}>
      {sparkles.map((sparkle) => (
        <motion.span
          key={sparkle.id}
          className="absolute pointer-events-none"
          style={sparkle.style}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 180 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.5 }}
        >
          <svg
            width={sparkle.size}
            height={sparkle.size}
            viewBox="0 0 160 160"
            fill="none"
          >
            <path
              d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
              fill="#FFC700"
            />
          </svg>
        </motion.span>
      ))}
      {children}
    </span>
  );
}

// Text Gradient Animation
export function GradientText({ children, className }) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient",
        className
      )}
    >
      {children}
    </span>
  );
}

// Bento Grid Card with Hover Effect
export function BentoCard({ children, className, ...props }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-gray-200/50 bg-white/80 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-indigo-200/50",
        className
      )}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(99, 102, 241, 0.1), transparent 40%)`,
        }}
      />
      {children}
    </motion.div>
  );
}

// Animated Counter
export function AnimatedCounter({ value, duration = 2 }) {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, value, duration]);

  return <span ref={ref}>{count}</span>;
}

// Magnetic Button Effect
export function MagneticButton({ children, className, ...props }) {
  const ref = React.useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Typewriter Effect
export function TypewriterEffect({ words, className }) {
  const [currentWordIndex, setCurrentWordIndex] = React.useState(0);
  const [currentText, setCurrentText] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    const word = words[currentWordIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < word.length) {
          setCurrentText(word.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(word.slice(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <span className={cn("inline-block", className)}>
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-[3px] h-[1em] ml-1 bg-teal-500 align-middle"
      />
    </span>
  );
}

// Marquee Animation
export function Marquee({ children, className, reverse = false, pauseOnHover = true }) {
  return (
    <div className={cn("flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]", className)}>
      <motion.div
        className={cn("flex gap-4 py-4", pauseOnHover && "hover:[animation-play-state:paused]")}
        animate={{ x: reverse ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

// Animated Border Card
export function AnimatedBorderCard({ children, className }) {
  return (
    <div className={cn("relative rounded-2xl p-[2px] overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: "conic-gradient(from 0deg, #14b8a6, #06b6d4, #0ea5e9, #14b8a6)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative rounded-2xl bg-white p-6">
        {children}
      </div>
    </div>
  );
}

// Glowing Stars Background
export function GlowingStars({ className }) {
  const stars = React.useMemo(() => 
    [...Array(50)].map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 2,
    })), []
  );

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-teal-400/50"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
}

// 3D Tilt Card
export function TiltCard({ children, className }) {
  const ref = React.useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateXVal = ((e.clientY - centerY) / (rect.height / 2)) * -10;
    const rotateYVal = ((e.clientX - centerX) / (rect.width / 2)) * 10;
    rotateX.set(rotateXVal);
    rotateY.set(rotateYVal);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}