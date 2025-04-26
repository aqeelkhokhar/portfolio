import { Button } from "@/components/ui/button";
import { useScrollToSection } from "@/hooks/useScrollToSection";
import { UserIcon } from "lucide-react";
import {
  FaCodeBranch,
  FaEnvelope,
  FaFileArrowDown,
  FaLocationDot,
  FaPhone,
} from "react-icons/fa6";
import useLoadIcons from "../hooks/useLoadIcons";
import { getIconComponent } from "../lib/utils";
import { PersonalInfo, SocialLinks } from "../types";

export default function Hero({
  personalInfo,
  socialLinks,
}: {
  personalInfo: PersonalInfo;
  socialLinks: SocialLinks[];
}) {
  const icons = useLoadIcons();

  const scrollToSection = useScrollToSection();

  const handleContactClick = () => {
    scrollToSection("contact");
  };

  return (
    <section
      id="hero"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-5 gap-8 items-center">
          <div className="md:col-span-3 animate-fadeIn">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="text-primary dark:text-white">
                {personalInfo?.title}
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {personalInfo?.tagline}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleContactClick}
                className="inline-flex items-center px-6 py-3 rounded-lg transition duration-300"
                size="lg"
              >
                <FaEnvelope className="mr-2" /> Contact Me
              </Button>
              {personalInfo?.resumeLink && (
                <Button
                  variant="secondary"
                  className="inline-flex items-center px-6 py-3 rounded-lg transition duration-300"
                  asChild
                  size="lg"
                >
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={personalInfo?.resumeLink}
                    download
                  >
                    <FaFileArrowDown className="mr-2" /> Download Resume
                  </a>
                </Button>
              )}
            </div>
            <div className="flex mt-8 space-x-4">
              {socialLinks?.map((socialLink: SocialLinks, index: number) => (
                <a
                  key={index}
                  href={socialLink?.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400 transition duration-300"
                >
                  {getIconComponent(icons, socialLink?.icon, "text-2xl")}
                </a>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 flex justify-center md:justify-end animate-slideUp">
            {personalInfo?.profileImage ? (
              <img
                src={personalInfo?.profileImage}
                alt="Description of the image"
                className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-white dark:border-gray-800 shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  if (!personalInfo?.profileImage) return;

                  const modal = document.createElement("div");
                  modal.className =
                    "fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4";

                  const closeButton = document.createElement("button");
                  closeButton.className =
                    "absolute top-6 right-6 text-white text-3xl hover:text-primary-400 transition-all duration-300 hover:rotate-90 hover:bg-black/20 p-2 rounded-full";
                  closeButton.innerHTML = "&times;";
                  closeButton.onclick = () => modal.remove();

                  const img = document.createElement("img");
                  img.src = personalInfo.profileImage;
                  img.className = "max-w-[90vw] max-h-[90vh] object-contain";

                  modal.appendChild(closeButton);
                  modal.appendChild(img);
                  document.body.appendChild(modal);
                }}
              />
            ) : (
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 overflow-hidden rounded-full border-4 border-white dark:border-gray-800 shadow-lg bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700">
                <div className="absolute inset-0 flex items-center justify-center text-7xl text-primary dark:text-primary-400">
                  <UserIcon size={84} strokeWidth={1.5} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
          <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition duration-300 animate-fadeIn">
            <FaLocationDot className="text-primary-500 text-2xl mb-3" />
            <h3 className="font-medium text-gray-900 dark:text-white">
              Location
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              {personalInfo?.location}
            </p>
          </div>
          <div
            className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition duration-300 animate-fadeIn"
            style={{ animationDelay: "100ms" }}
          >
            <FaEnvelope className="text-primary-500 text-2xl mb-3" />
            <h3 className="font-medium text-gray-900 dark:text-white">Email</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              {personalInfo?.email}
            </p>
          </div>
          <div
            className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition duration-300 animate-fadeIn"
            style={{ animationDelay: "200ms" }}
          >
            <FaPhone className="text-primary-500 text-2xl mb-3" />
            <h3 className="font-medium text-gray-900 dark:text-white">Phone</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              +{personalInfo?.countryCode} {personalInfo?.phone}
            </p>
          </div>
          <div
            className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition duration-300 animate-fadeIn"
            style={{ animationDelay: "300ms" }}
          >
            <FaCodeBranch className="text-primary-500 text-2xl mb-3" />
            <h3 className="font-medium text-gray-900 dark:text-white">
              Experience
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              {personalInfo?.experience}+
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
