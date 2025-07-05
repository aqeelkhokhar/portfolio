export function useScrollToSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Immediately set the active section for instant navbar highlighting
      const setActiveSectionEvent = new CustomEvent('set-active-section', {
        detail: { sectionId }
      });
      window.dispatchEvent(setActiveSectionEvent);
      
      // Dispatch custom event to indicate programmatic scrolling
      const programmaticScrollEvent = new CustomEvent('programmatic-scroll');
      window.dispatchEvent(programmaticScrollEvent);
      
      // Add a small delay to ensure the DOM is ready
      setTimeout(() => {
        const headerOffset = 100; // Increased offset for better visibility
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        
        // Force update active section after scrolling completes with longer delay
        setTimeout(() => {
          // Trigger multiple scroll events to ensure detection
          for (let i = 0; i < 3; i++) {
            setTimeout(() => {
              const event = new Event('scroll');
              window.dispatchEvent(event);
            }, i * 100);
          }
        }, 800); // Increased delay to ensure smooth scroll completes
      }, 100);
    }
  };

  return scrollToSection;
}
