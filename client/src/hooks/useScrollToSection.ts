export function useScrollToSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Offset for the navbar
        behavior: "smooth",
      });
    }
  };

  return scrollToSection;
}
