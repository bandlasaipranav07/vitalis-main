import React from 'react';
import { motion } from 'motion/react';

interface InfiniteCarouselProps {
  items: React.ReactNode[];
  speed?: number; // lower is faster
  direction?: 'left' | 'right';
  className?: string;
}

export default function InfiniteCarousel({ 
  items, 
  speed = 30, 
  direction = 'left',
  className = "" 
}: InfiniteCarouselProps) {
  // Duplicate items to create the infinite effect
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className={`overflow-hidden whitespace-nowrap relative ${className}`}>
      {/* Gradient masks for smooth edges */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-inherit to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-inherit to-transparent z-10" />
      
      <motion.div
        className="flex gap-8 items-center w-max"
        animate={{
          x: direction === 'left' ? [0, -100 * (items.length / duplicatedItems.length) + '%'] : [-100 * (items.length / duplicatedItems.length) + '%', 0],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {duplicatedItems.map((item, idx) => (
          <div key={`carousel-outer-${idx}`} className="flex-shrink-0">
            {React.isValidElement(item) 
              ? React.cloneElement(item as React.ReactElement, { key: `carousel-inner-${idx}` }) 
              : item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
