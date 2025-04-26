import { FaCheckCircle } from "react-icons/fa";
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
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Work Experience
          </h2>
          <div className="w-20 h-1 bg-primary-500 mx-auto rounded"></div>
        </div>

        <div className="relative mt-12">
          {workExperience.map((job: Jobs, index: number) => (
            <div
              key={index}
              className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6 last:mb-0"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex justify-between flex-wrap gap-2">
                  <h3 className="font-heading text-xl font-semibold text-gray-900 dark:text-white">
                    {job.title}
                    <span className="text-gray-600 dark:text-gray-400 ml-4 bg-gray-200 dark:bg-gray-700 p-2 rounded">
                      {job?.type}
                    </span>
                  </h3>

                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-primary-100 dark:bg-primary-700/30 text-primary-700 dark:text-primary-400 rounded-full">
                    {job.period}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-1 mb-4">
                  {job.company} - {job.location}
                </p>
                <ul className="space-y-2">
                  {job.responsibilities.map((responsibility, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-gray-700 dark:text-gray-300"
                    >
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
