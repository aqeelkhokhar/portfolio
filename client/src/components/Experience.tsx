import { FaStar } from "react-icons/fa";
import { Jobs } from "../types";

export default function Experience({
  experience: workExperience,
}: {
  experience: Jobs[];
}) {
  return (
    <section
      id="experience"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 scroll-mt-20"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 relative inline-block">
            Work Experience
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full" />
          </h2>
        </div>

        <div className="relative mt-12">
          {workExperience.map((job: Jobs, index: number) => (
            <div
              key={index}
              className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8 last:mb-0"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
                <div className="flex justify-between flex-wrap gap-3">
                  <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-white">
                    {job.title}
                    <span className="text-gray-600 dark:text-gray-400 ml-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-2 rounded-lg">
                      {job?.type}
                    </span>
                  </h3>

                  <span className="inline-flex items-center px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-700/30 dark:to-primary-800/30 text-primary-700 dark:text-primary-400 rounded-full shadow-sm">
                    {job.period}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-2 mb-4">
                  {job.company} - {job.location}
                </p>
                <ul className="space-y-3">
                  {job.responsibilities.map((responsibility, i) => {
                    if (!responsibility.trim()) return null;

                    // Match **Heading:** rest of line
                    const headingMatch = responsibility.match(
                      /^\*\*(.+?):\*\*\s*(.*)$/
                    );

                    if (headingMatch) {
                      return (
                        <li key={i} className="flex gap-3 items-start">
                          <span className="text-gray-700 dark:text-gray-300">
                            <b className="text-gray-900 dark:text-white">
                              {headingMatch[1]}:
                            </b>{" "}
                            {headingMatch[2]}
                          </span>
                        </li>
                      );
                    }

                    // Match **Heading** (no colon)
                    if (
                      responsibility.startsWith("**") &&
                      responsibility.endsWith("**")
                    ) {
                      return (
                        <li key={i} className="flex gap-3 items-start">
                          <span className="text-gray-700 dark:text-gray-300">
                            <b className="text-gray-900 dark:text-white">
                              {responsibility.replace(/\*\*/g, "")}
                            </b>
                          </span>
                        </li>
                      );
                    }

                    // Normal responsibility with star icon
                    return (
                      <li key={i} className="flex gap-3 items-start">
                        <FaStar className="text-yellow-500 mt-1 flex-shrink-0 h-5 w-5" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {responsibility}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
