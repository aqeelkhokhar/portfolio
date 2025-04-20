export default function About({ summary }: { summary: string }) {
  return (
    <section
      id="about"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About Me
          </h2>
          <div className="w-20 h-1 bg-primary-500 mx-auto rounded"></div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
          {summary?.split("\n")?.map((paragraph, index) => (
            <p
              key={index}
              className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6 last:mb-0"
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
