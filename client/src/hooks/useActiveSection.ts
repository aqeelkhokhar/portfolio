import { useEffect, useState } from "react";

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState("about");
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Skip detection if we're in the middle of a programmatic scroll
      if (isScrolling) return;

      const sections = [
        "about",
        "experience",
        "skills",
        "projects",
        "education",
        "contact",
        "book-appointment",
      ];

      let bestSection = "about";
      let bestScore = -Infinity;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate how much of the section is visible in the viewport
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        // Calculate a score based on visibility and position
        // Higher score for sections that are more visible and closer to the top
        const visibilityScore = visibleHeight / rect.height;
        const positionScore = Math.max(0, 1 - (rect.top / viewportHeight));
        
        // Add bonus for sections that are at the top of the viewport
        const topBonus = rect.top <= 150 ? 0.5 : 0;
        
        const score = visibilityScore * positionScore + topBonus;

        if (score > bestScore) {
          bestScore = score;
          bestSection = sectionId;
        }
      }

      setActiveSection(bestSection);
    };

    // Listen for custom scroll events that indicate programmatic scrolling
    const handleProgrammaticScroll = () => {
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 1000); // Increased delay
    };

    // Listen for manual active section setting
    const handleSetActiveSection = (event: CustomEvent) => {
      setActiveSection(event.detail.sectionId);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("programmatic-scroll", handleProgrammaticScroll);
    window.addEventListener("set-active-section", handleSetActiveSection as EventListener);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("programmatic-scroll", handleProgrammaticScroll);
      window.removeEventListener("set-active-section", handleSetActiveSection as EventListener);
    };
  }, [isScrolling]);

  return activeSection;
}
