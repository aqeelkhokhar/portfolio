import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
}

export default function AnimatedSection({
  children,
  className = "",
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        opacity: { duration: 0.4 },
        y: { duration: 0.6 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
