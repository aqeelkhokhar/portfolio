import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
  FaGithub,
  FaInfoCircle,
  FaStar,
} from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Projects } from "../types";

export default function Project({ projects }: { projects: Projects[] }) {
  const isMobile = useIsMobile();
  const gridNumber: number = 2;
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const fallbackSrc: string =
    "https://images.unsplash.com/photo-1551033406-611cf9a28f67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80";
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const projectsPerPage = isMobile ? 1 : 2;
  const isAtEnd = currentProjectIndex + projectsPerPage >= projects.length;
  const isAtStart = currentProjectIndex === 0;

  const openProjectDetails = (index: number) => {
    setSelectedProject(index);
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  const nextProject = () => {
    if (!isAtEnd) {
      setDirection("right");
      setCurrentProjectIndex((prevIndex) => prevIndex + projectsPerPage);
    }
  };

  const prevProject = () => {
    if (!isAtStart) {
      setDirection("left");
      setCurrentProjectIndex((prevIndex) => prevIndex - projectsPerPage);
    }
  };

  const handleClick = (e: React.MouseEvent, index: number) => {
    if (e.target instanceof HTMLButtonElement) {
      e.stopPropagation();
      return;
    }
    openProjectDetails(index);
  };

  return (
    <section
      id="projects"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 scroll-mt-20"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 relative inline-block">
            Professional Projects
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full" />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {projects
            .slice(currentProjectIndex, currentProjectIndex + projectsPerPage)
            .map((project, index) => (
              <div
                key={currentProjectIndex + index}
                className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out hover:shadow-xl hover:translate-y-[-8px] cursor-pointer ${
                  direction === "right"
                    ? "animate-in slide-in-from-right fade-in"
                    : "animate-in slide-in-from-left fade-in"
                }`}
                onClick={(e) => handleClick(e, currentProjectIndex + index)}
              >
                {/* Project content */}
                {project.images?.length || project.image ? (
                  <div className="w-full h-56 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full hover:text-primary-500 absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm z-20 transition-transform duration-300 hover:scale-110"
                      onClick={(e) => {
                        e.stopPropagation();
                        openProjectDetails(currentProjectIndex + index);
                      }}
                    >
                      <FaInfoCircle className="h-5 w-5" />
                    </Button>
                    <ImageWithFallback
                      src={project.images?.[0] || project.image || ""}
                      fallbackSrc={fallbackSrc}
                      alt={`${project.title} screenshot`}
                      className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                ) : null}

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
                      {project.title}
                    </h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap ml-3 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                      {project.period}
                    </span>
                  </div>

                  <div className="text-base text-primary-700 dark:text-primary-300 font-semibold mb-3 line-clamp-1">
                    {project.role} • {project.company}
                  </div>

                  <p className="text-base text-gray-700 dark:text-gray-300 line-clamp-2 mb-5">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.technologies
                      .slice(0, gridNumber)
                      .map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium shadow-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    {project.technologies.length > gridNumber && (
                      <span className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium shadow-sm">
                        +{project.technologies.length - gridNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto">
                    {project.githubUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:text-primary-500 bg-gray-100 dark:bg-gray-800 transition-all duration-300 hover:scale-110"
                        asChild
                      >
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaGithub className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:text-primary-500 bg-gray-100 dark:bg-gray-800 transition-all duration-300 hover:scale-110"
                        asChild
                      >
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaExternalLinkAlt className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-8">
          <Button
            onClick={prevProject}
            variant="ghost"
            size="icon"
            disabled={isAtStart}
            className={`h-12 w-12 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 transition-all duration-300 ${
              isAtStart
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-primary-500 hover:scale-110 hover:shadow-lg"
            }`}
          >
            <FaChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            onClick={nextProject}
            variant="ghost"
            size="icon"
            disabled={isAtEnd}
            className={`h-12 w-12 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 transition-all duration-300 ${
              isAtEnd
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-primary-500 hover:scale-110 hover:shadow-lg"
            }`}
          >
            <FaChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Project Detail Dialog */}
      {selectedProject !== null && projects[selectedProject] && (
        <Dialog
          open={selectedProject !== null}
          onOpenChange={closeProjectDetails}
        >
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white relative inline-block">
                {projects[selectedProject].title}
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full" />
              </DialogTitle>
              <div className="text-base text-gray-600 dark:text-gray-400 mt-4">
                {projects[selectedProject].period}
              </div>
            </DialogHeader>

            <div className="text-base text-primary-700 dark:text-primary-300 italic mb-6">
              <strong>My Role:</strong> {projects[selectedProject].role}
              <span className="text-gray-600 dark:text-gray-400 ml-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-2 rounded-lg">
                {projects[selectedProject].company}
              </span>
            </div>

            {/* Project images carousel in dialog */}
            {projects[selectedProject].images &&
            projects[selectedProject].images.length > 0 ? (
              <div className="w-full h-80 overflow-hidden my-6">
                <Carousel
                  showArrows={true}
                  showStatus={false}
                  showThumbs={true}
                  infiniteLoop={true}
                  className="project-carousel-dialog"
                >
                  {projects[selectedProject].images.map((imgSrc, idx) => (
                    <div key={idx} className="h-80">
                      <ImageWithFallback
                        src={imgSrc}
                        fallbackSrc={fallbackSrc}
                        alt={`${projects[selectedProject].title} screenshot ${
                          idx + 1
                        }`}
                        className="w-full h-80 object-contain"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            ) : projects[selectedProject].image ? (
              <div className="w-full h-80 overflow-hidden my-6">
                <ImageWithFallback
                  src={projects[selectedProject].image}
                  fallbackSrc={fallbackSrc}
                  alt={`${projects[selectedProject].title} screenshot`}
                  className="w-full h-80 object-contain"
                />
              </div>
            ) : null}

            {/* Project description */}
            <div className="text-lg mb-6">
              {projects[selectedProject].description}
            </div>

            {/* Project highlights */}
            <div className="mb-8">
              <h4 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white relative inline-block">
                Key Achievements
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full" />
              </h4>
              <ul className="space-y-3 mt-6">
                {projects[selectedProject].highlights.map((highlight, i) => {
                  if (!highlight.trim()) return null;

                  return (
                    <li key={i} className="flex gap-4 items-start">
                      {highlight && (
                        <FaStar className="text-yellow-500 mt-1 flex-shrink-0 h-5 w-5" />
                      )}
                      <span
                        className="text-gray-700 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: highlight }}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
            {/* Project impact */}
            <div className="mb-8">
              <h4 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white relative inline-block">
                Impacts
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full" />
              </h4>
              <ul className="space-y-3 mt-6">
                {projects[selectedProject]?.impacts?.map((impact, i) => {
                  if (!impact.trim()) return null;

                  return (
                    <li key={i} className="flex gap-4 items-start">
                      {impact && (
                        <FaStar className="text-yellow-500 mt-1 flex-shrink-0 h-5 w-5" />
                      )}
                      <span
                        className="text-gray-700 dark:text-gray-300"
                        dangerouslySetInnerHTML={{ __html: impact }}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Technologies */}
            <div>
              <h4 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white relative inline-block">
                Technologies Used
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full" />
              </h4>
              <div className="flex flex-wrap gap-3 mt-6">
                {projects[selectedProject].technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-gray-200 rounded-xl text-sm font-medium shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {projects?.[selectedProject]?.liveUrl && (
              <div className="mt-8">
                <Button
                  asChild
                  className="w-full sm:w-auto bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <a
                    href={projects[selectedProject]?.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                  </a>
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
