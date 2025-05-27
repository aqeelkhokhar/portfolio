import useLoadIcons from "../hooks/useLoadIcons";
import { getIconComponent } from "../lib/utils";
import { SkillCategories } from "../types";

export default function Skills({ skills }: { skills: SkillCategories[] }) {
  const icons = useLoadIcons();

  return (
    <section
      id="skills"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 scroll-mt-20"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Technical Skills
          </h2>
          <div className="w-20 h-1 bg-primary-500 mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((skillCategory, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 
                       transform transition-all duration-300 ease-in-out 
                       hover:scale-105 hover:shadow-xl hover:bg-primary-50/50 dark:hover:bg-primary-900/20
                       border border-transparent hover:border-primary-200 dark:hover:border-primary-800"
            >
              <div className="flex items-center mb-6">
                <div
                  className="w-12 h-12 flex items-center justify-center bg-primary-100 dark:bg-primary-700/30 text-primary-600 dark:text-primary-500 rounded-lg mr-4
                             transform transition-all duration-300 ease-in-out group-hover:scale-110"
                >
                  {getIconComponent(icons, skillCategory.icon, "text-2xl")}
                </div>
                <h3 className="font-heading text-xl font-semibold text-gray-900 dark:text-white">
                  {skillCategory.category}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skillCategory.items.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
