import useLoadIcons from "../hooks/useLoadIcons";
import { getIconComponent } from "../lib/utils";
import { PersonalInfo, SocialLinks } from "../types";

export default function Footer({
  socialLinks,
  personalInfo,
}: {
  socialLinks: SocialLinks[];
  personalInfo: PersonalInfo;
}) {
  const icons = useLoadIcons();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center space-x-6 mb-6">
            {socialLinks?.map((socialLink: SocialLinks, index: number) => (
              <a
                key={index}
                href={socialLink.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-400 transition duration-300"
              >
                {getIconComponent(icons, socialLink?.icon, "text-xl")}
              </a>
            ))}
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            &copy; {currentYear} {personalInfo?.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
