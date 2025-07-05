import About from "@/components/About";
import AnimatedSection from "@/components/AnimatedSection";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Project from "@/components/Project";
import Skills from "@/components/Skills";
import VideoIntro from "@/components/VideoIntro";
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
          <AnimatedSection>
            <Hero socialLinks={socialLinks} personalInfo={personalInfo} />
          </AnimatedSection>
        )}
        {personalInfo?.summary && (
          <AnimatedSection>
            <About summary={personalInfo.summary} />
          </AnimatedSection>
        )}
        {experience?.length > 0 && (
          <AnimatedSection>
            <Experience experience={experience} />
          </AnimatedSection>
        )}
        {skills?.length > 0 && (
          <AnimatedSection>
            <Skills skills={skills} />
          </AnimatedSection>
        )}
        {projects?.length > 0 && (
          <AnimatedSection>
            <Project projects={projects} />
          </AnimatedSection>
        )}
        {education?.length > 0 && (
          <AnimatedSection>
            <Education education={education} />
          </AnimatedSection>
        )}
        {personalInfo && (
          <AnimatedSection>
            <Contact socialLinks={socialLinks} personalInfo={personalInfo} />
          </AnimatedSection>
        )}
        <AnimatedSection>
          <AppointmentBooking />
        </AnimatedSection>
      </main>
      
      {/* Video Introduction Component - Only show if YouTube URL exists */}
      {personalInfo?.youtubeVideoUrl && (
        <VideoIntro 
          youtubeUrl={personalInfo.youtubeVideoUrl} 
          title="Meet Raheel Butt - Introduction"
        />
      )}
      
      {socialLinks?.length > 0 && personalInfo && (
        <Footer socialLinks={socialLinks} personalInfo={personalInfo} />
      )}
    </div>
  );
}
