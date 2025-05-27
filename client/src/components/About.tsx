import { FaStar } from "react-icons/fa";

export default function About({ summary }: { summary: string }) {
  return (
    <section
      id="about"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 scroll-mt-20"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 relative inline-block">
            About Me
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full" />
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          {summary?.split("\n")?.map((paragraph, index) => {
            if (!paragraph.trim()) return null;

            return (
              <div
                key={index}
                className="flex gap-4 items-start mb-6 last:mb-0"
              >
                <FaStar className="text-yellow-500 mt-1 flex-shrink-0 h-5 w-5" />
                <p
                  className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: paragraph }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
