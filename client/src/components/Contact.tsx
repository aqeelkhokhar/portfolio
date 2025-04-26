import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, RequestParams } from "@/lib/queryClient";
import { CheckCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaEnvelope,
  FaLinkedin,
  FaLocationDot,
  FaPhone,
} from "react-icons/fa6";
import { ContactFormValues, PersonalInfo, SocialLinks } from "../types";

export default function Contact({
  personalInfo,
  socialLinks,
}: {
  personalInfo: PersonalInfo;
  socialLinks: SocialLinks[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const linkedinUrl: string | undefined = useMemo(
    () =>
      socialLinks?.find((socialLink) => socialLink?.name === "linkedin")?.link,
    [socialLinks]
  );

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);

    try {
      await apiRequest({
        method: "POST",
        url: "/api/contact",
        data,
      } as RequestParams);

      toast({
        title: "Message sent!",
        description:
          "Your message has been sent successfully. I'll get back to you soon.",
        variant: "default",
      });

      // Reset form
      form.reset();
    } catch (error) {
      toast({
        title: "Error sending message",
        description:
          "There was an error sending your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="contact"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 scroll-mt-20"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get In Touch
          </h2>
          <div className="w-20 h-1 bg-primary-500 mx-auto rounded"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            Feel free to contact me for any opportunities or questions
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-primary-100 dark:bg-primary-700/30 text-primary-600 dark:text-primary-500 rounded-lg mr-4">
                  <FaEnvelope className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-gray-900 dark:text-white">
                    Email
                  </h3>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-primary-600 dark:text-primary-500 hover:underline"
                  >
                    {personalInfo.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-primary-100 dark:bg-primary-700/30 text-primary-600 dark:text-primary-500 rounded-lg mr-4">
                  <FaPhone className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-gray-900 dark:text-white">
                    Phone
                  </h3>
                  <a
                    href={`tel:${personalInfo.phone}`}
                    className="text-primary-600 dark:text-primary-500 hover:underline"
                  >
                    +{personalInfo?.countryCode} {personalInfo.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center bg-primary-100 dark:bg-primary-700/30 text-primary-600 dark:text-primary-500 rounded-lg mr-4">
                  <FaLocationDot className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-gray-900 dark:text-white">
                    Location
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {personalInfo.location}
                  </p>
                </div>
              </div>
            </div>

            {linkedinUrl && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary-100 dark:bg-primary-700/30 text-primary-600 dark:text-primary-500 rounded-lg mr-4">
                    <FaLinkedin className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-gray-900 dark:text-white">
                      LinkedIn
                    </h3>
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-500 underline"
                    >
                      {personalInfo.name}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="font-heading text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Send me a message
              </h3>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {form.formState.isSubmitSuccessful && (
                    <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
                      <div className="flex items-center">
                        <CheckCircle className="mr-2" />
                        <span>Your message has been sent successfully!</span>
                      </div>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your name"
                            {...field}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your@email.com"
                            {...field}
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    rules={{ required: "Subject is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Subject
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter the subject of the email"
                            {...field}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    rules={{ required: "Message is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your message here"
                            {...field}
                            rows={4}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 font-medium rounded-lg transition duration-300 flex justify-center items-center disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white dark:text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
