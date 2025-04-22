import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { useScrollToSection } from "@/hooks/useScrollToSection";
import { cn } from "@/lib/utils";
import { MenuIcon, MoonIcon, SunIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { PersonalInfo } from "../types";

interface NavItem {
  label: string;
  sectionId: string;
}

const navItems: NavItem[] = [
  { label: "About", sectionId: "about" },
  { label: "Experience", sectionId: "experience" },
  { label: "Skills", sectionId: "skills" },
  { label: "Projects", sectionId: "projects" },
  { label: "Education", sectionId: "education" },
  { label: "Contact", sectionId: "contact" },
  { label: "Book Appointment", sectionId: "book-appointment" },
];

export default function Navbar({
  activeSection,
  personalInfo,
}: {
  activeSection: string;
  personalInfo: PersonalInfo;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const scrollToSection = useScrollToSection();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavItemClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 z-50 transition-all duration-300",
        isScrolled ? "shadow-md dark:shadow-lg" : ""
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {personalInfo?.name && (
            <div className="flex items-center">
              <button
                onClick={() => handleNavItemClick("hero")}
                className="font-heading font-bold text-xl text-primary dark:text-white cursor-pointer"
              >
                {personalInfo?.name}
              </button>
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.sectionId}
                onClick={() => handleNavItemClick(item.sectionId)}
                className={cn(
                  "font-medium transition duration-150 px-4 py-2",
                  activeSection === item.sectionId
                    ? "text-white dark:text-gray-900 bg-gray-600 dark:bg-gray-300 rounded-md"
                    : "text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary-400"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Dark Mode Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-600" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-white dark:bg-gray-800 shadow-lg py-2 px-4 animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col space-y-3 pb-3">
            {navItems.map((item) => (
              <button
                key={item.sectionId}
                onClick={() => handleNavItemClick(item.sectionId)}
                className={cn(
                  "px-4 py-2 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150",
                  activeSection === item.sectionId
                    ? "text-primary dark:text-primary-400"
                    : ""
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
