export default function CustomError({ error }: { error: Error | null }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <h1 className="text-6xl font-bold">Oops!</h1>
      <h2 className="mt-4 text-2xl">Something Went Wrong</h2>
      <p className="mt-2 text-lg">Error: {error?.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 text-blue-500 hover:underline"
      >
        Reload Page
      </button>
    </div>
  );
}
