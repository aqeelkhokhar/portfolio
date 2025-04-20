import About from "@/components/About";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Project from "@/components/Project";
import Skills from "@/components/Skills";
import { useActiveSection } from "@/hooks/useActiveSection";
import AppointmentBooking from "../components/AppointmentBooking";
import { usePortfolio } from "../hooks/usePortfolioData";

export default function Home() {
  const { personalInfo, experience, skills, projects, education, socialLinks } =
    usePortfolio();

  const activeSection = useActiveSection();

  return (
    <div className="antialiased bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen">
      {personalInfo && (
        <Navbar activeSection={activeSection} personalInfo={personalInfo} />
      )}
      <main className="pt-20 pb-16">
        {personalInfo && (
          <Hero socialLinks={socialLinks} personalInfo={personalInfo} />
        )}
        {personalInfo?.summary && <About summary={personalInfo.summary} />}
        {experience?.length > 0 && <Experience experience={experience} />}
        {skills?.length > 0 && <Skills skills={skills} />}
        {projects?.length > 0 && <Project projects={projects} />}
        {education?.length > 0 && <Education education={education} />}
        {personalInfo && (
          <Contact socialLinks={socialLinks} personalInfo={personalInfo} />
        )}
        <AppointmentBooking />
      </main>
      {socialLinks?.length > 0 && personalInfo && (
        <Footer socialLinks={socialLinks} personalInfo={personalInfo} />
      )}
    </div>
  );
}
