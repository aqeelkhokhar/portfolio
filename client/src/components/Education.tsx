import { FaBook, FaGraduationCap, FaSchool } from "react-icons/fa";
import { Educations } from "../types";

export default function Education({ education }: { education: Educations[] }) {
  const getEducationIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case "bs information technology":
      case "bachelor":
        return <FaGraduationCap className="text-3xl" />;
      case "intermediate computer science":
      case "intermediate":
        return <FaSchool className="text-3xl" />;
      case "matriculation, computer science":
      case "matriculation":
        return <FaBook className="text-3xl" />;
      default:
        return <FaGraduationCap className="text-3xl" />;
    }
  };

  return (
    <section
      id="education"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 scroll-mt-20"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Education
          </h2>
          <div className="w-20 h-1 bg-primary-500 mx-auto rounded"></div>
        </div>

        <div className="space-y-8">
          {education.map((edu, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex items-center justify-center bg-primary-100 dark:bg-primary-700/30 text-primary-600 dark:text-primary-500 rounded-lg">
                  {getEducationIcon(edu.degree)}
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-gray-900 dark:text-white">
                    {edu.degree}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {edu.institution}
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                    {edu.period}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
