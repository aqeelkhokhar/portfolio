import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useState } from "react";
import {
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
  FaGithub,
  FaInfoCircle,
} from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Projects } from "../types";

export default function Project({ projects }: { projects: Projects[] }) {
  const gridNumber: number = 2;
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const fallbackSrc: string =
    "https://images.unsplash.com/photo-1551033406-611cf9a28f67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80";
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const isAtEnd = currentProjectIndex + 2 >= projects.length;
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
      setCurrentProjectIndex((prevIndex) => prevIndex + 2);
    }
  };

  const prevProject = () => {
    if (!isAtStart) {
      setDirection("left");
      setCurrentProjectIndex((prevIndex) => prevIndex - 2);
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
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Professional Projects
          </h2>
          <div className="w-20 h-1 bg-primary-500 mx-auto rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {projects
            .slice(currentProjectIndex, currentProjectIndex + 2)
            .map((project, index) => (
              <div
                key={currentProjectIndex + index}
                className={`group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-500 ease-in-out hover:shadow-xl hover:translate-y-[-5px] cursor-pointer ${
                  direction === "right"
                    ? "animate-in slide-in-from-right fade-in"
                    : "animate-in slide-in-from-left fade-in"
                }`}
                onClick={(e) => handleClick(e, currentProjectIndex + index)}
              >
                {/* Project content */}
                {project.images?.length || project.image ? (
                  <div className="w-full h-48 overflow-hidden relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:text-primary-500 absolute top-2 right-2 bg-white/80 backdrop-blur z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        openProjectDetails(currentProjectIndex + index);
                      }}
                    >
                      <FaInfoCircle className="h-4 w-4" />
                    </Button>
                    <ImageWithFallback
                      src={project.images?.[0] || project.image || ""}
                      fallbackSrc={fallbackSrc}
                      alt={`${project.title} screenshot`}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : null}

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-heading text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {project.title}
                    </h3>
                    <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap ml-2">
                      {project.period}
                    </span>
                  </div>

                  <div className="text-sm text-primary-800 dark:text-primary-300 font-semibold mb-2 line-clamp-1">
                    {project.role} • {project.company}
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies
                      .slice(0, gridNumber)
                      .map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    {project.technologies.length > gridNumber && (
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs">
                        +{project.technologies.length - gridNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t pt-3 mt-auto">
                    {project.githubUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full hover:text-primary-500"
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
                        className="h-6 w-6 rounded-full hover:text-primary-500"
                        asChild
                      >
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaExternalLinkAlt className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button
            onClick={prevProject}
            variant="ghost"
            size="icon"
            disabled={isAtStart}
            className={`h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 transition-all duration-200 ${
              isAtStart
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-primary-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-110"
            }`}
          >
            <FaChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={nextProject}
            variant="ghost"
            size="icon"
            disabled={isAtEnd}
            className={`h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 transition-all duration-200 ${
              isAtEnd
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-primary-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-110"
            }`}
          >
            <FaChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Project Detail Dialog */}
      {selectedProject !== null && projects[selectedProject] && (
        <Dialog
          open={selectedProject !== null}
          onOpenChange={closeProjectDetails}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {projects[selectedProject].title}
              </DialogTitle>
              <div className="text-sm text-gray-500">
                {projects[selectedProject].period}
              </div>
            </DialogHeader>

            <div className="text-sm text-primary-700 dark:text-primary-300 italic mb-4">
              <strong>My Role:</strong> {projects[selectedProject].role}
              <span className="text-gray-600 dark:text-gray-400 ml-4 bg-gray-200 dark:bg-gray-700 p-2 rounded">
                {projects[selectedProject].company}
              </span>
            </div>

            {/* Project images carousel in dialog */}
            {projects[selectedProject].images &&
            projects[selectedProject].images.length > 0 ? (
              <div className="w-full h-80 overflow-hidden my-4">
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
              <div className="w-full h-80 overflow-hidden my-4">
                <ImageWithFallback
                  src={projects[selectedProject].image}
                  fallbackSrc={fallbackSrc}
                  alt={`${projects[selectedProject].title} screenshot`}
                  className="w-full h-80 object-contain"
                />
              </div>
            ) : null}

            {/* Project description */}
            <div className="text-lg mb-4">
              {projects[selectedProject].description}
            </div>

            {/* Project highlights */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">Key Achievements</h4>
              <ul className="space-y-2">
                {projects[selectedProject].highlights.map((highlight, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                    <span dangerouslySetInnerHTML={{ __html: highlight }} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Technologies Used</h4>
              <div className="flex flex-wrap gap-2">
                {projects[selectedProject].technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {projects?.[selectedProject]?.liveUrl && (
              <div className="mt-6">
                <Button asChild className="w-full sm:w-auto">
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
