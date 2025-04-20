import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useState } from "react";
import { FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Projects } from "../types";

export default function Project({ projects }: { projects: Projects[] }) {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const fallbackSrc: string =
    "https://images.unsplash.com/photo-1551033406-611cf9a28f67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80";

  const openProjectDetails = (index: number) => {
    setSelectedProject(index);
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  return (
    <section
      id="projects"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Professional Projects
          </h2>
          <div className="w-20 h-1 bg-primary-500 mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              onClick={() => openProjectDetails(index)}
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] project-card-hover-trigger"
            >
              <div className="bg-primary-500/10 p-4 flex justify-between items-center">
                <h3 className="font-heading text-xl font-semibold text-gray-900 dark:text-white">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {project.period}
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <FaInfoCircle className="text-primary-500" />
                  </Button>
                </div>
              </div>

              {/* Role Section - More Appealing */}
              <div className="mb-4 text-primary-800 dark:text-primary-300 font-semibold py-2 text-sm mx-4">
                <strong>My Role:</strong> {project.role}
                <span className="text-gray-600 dark:text-gray-400 ml-4 bg-gray-200 dark:bg-gray-700 p-2 rounded">
                  {project.company}
                </span>
              </div>

              {project.images?.length ? (
                <div className="w-full h-48 overflow-hidden">
                  <Carousel
                    showArrows={true}
                    showStatus={false}
                    showThumbs={false}
                    infiniteLoop={true}
                    autoPlay={true}
                    interval={5000}
                    stopOnHover={true}
                    className="project-carousel"
                  >
                    {project.images.map((imgSrc, idx) => (
                      <div key={idx} className="h-48">
                        <ImageWithFallback
                          src={imgSrc}
                          fallbackSrc={fallbackSrc}
                          alt={`${project.title} screenshot ${idx + 1}`}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    ))}
                  </Carousel>
                </div>
              ) : project.image ? (
                <div className="w-full h-48 overflow-hidden">
                  <ImageWithFallback
                    src={project.image}
                    fallbackSrc={fallbackSrc}
                    alt={`${project.title} screenshot`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}

              <div className="p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {project.description}
                </p>
                <ul className="space-y-2 mb-4">
                  {project.highlights.map((highlight, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-gray-700 dark:text-gray-300"
                    >
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span dangerouslySetInnerHTML={{ __html: highlight }} />
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Dialog */}
      {selectedProject !== null && projects[selectedProject] && (
        <Dialog
          open={selectedProject !== null}
          onOpenChange={closeProjectDetails}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
