"use client";

import { Children, cloneElement, isValidElement, useMemo } from "react";
import { cn } from "@/lib/utils";

export function OrbitingCircles({
  className,
  children,
  reverse = false,
  duration = 20,
  delay = 0,
  radius = 160,
  path = true,
  iconSize = 30,
  speed = 1,
}) {
  const calculatedDuration = duration / speed;
  const childrenArray = Children.toArray(children).filter(isValidElement);
  const childrenCount = childrenArray.length;

  const childElements = useMemo(() => {
    return childrenArray.map((child, index) => {
      const angle = (360 / childrenCount) * index;
      const animationDelay = (calculatedDuration / childrenCount) * index + delay;

      return (
        <div
          key={index}
          className={cn(
            "absolute flex size-full transform-gpu items-center justify-center",
            "[animation:orbit_var(--duration)_linear_infinite]",
            reverse && "[animation-direction:reverse]"
          )}
          style={{
            "--duration": `${calculatedDuration}s`,
            animationDelay: `-${animationDelay}s`,
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              transform: `translateY(-${radius}px)`,
              width: iconSize,
              height: iconSize,
            }}
          >
            {cloneElement(child, {
              className: cn(
                "size-full",
                child.props?.className
              ),
            })}
          </div>
        </div>
      );
    });
  }, [childrenArray, childrenCount, calculatedDuration, delay, radius, reverse, iconSize]);

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center",
        className
      )}
    >
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            className="stroke-black/10 dark:stroke-white/10"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        </svg>
      )}
      {childElements}
    </div>
  );
}
