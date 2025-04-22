import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, RequestParams } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Check, Clock, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface TimeSlot {
  start: string;
  end: string;
}

interface AppointmentFormValues {
  name: string;
  email: string;
  subject: string;
  description: string;
  date: Date | undefined;
  timeSlot: TimeSlot | null;
}

export default function AppointmentBooking() {
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [visibleSlots, setVisibleSlots] = useState<number>(8);
  const { toast } = useToast();

  const form = useForm<AppointmentFormValues>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      description: "",
      date: undefined,
      timeSlot: null,
    },
  });

  const selectedDate = form.watch("date");

  // Function to check if a date is today
  const isToday = (date: Date | undefined): boolean => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Function to format time from ISO string
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return format(date, "h:mm a");
  };

  // Function to fetch available time slots when a date is selected
  const fetchAvailableSlots = async (date: Date) => {
    setIsLoading(true);
    setAvailableSlots([]);

    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      // Use URL with query string instead of trying to send data in a GET request
      const url = `/api/calendar/availability?date=${encodeURIComponent(
        formattedDate
      )}`;

      const response = await apiRequest({
        method: "GET",
        url: url,
      } as RequestParams);

      const data = await response.json();

      if (data.availableSlots && data.availableSlots.length > 0) {
        // If the API returns slots, use them
        setAvailableSlots(data.availableSlots);
      } else {
        // If the API returns an empty array, generate 30-minute slots
        generateTimeSlots(date);
      }
    } catch (error) {
      // If there's an error, generate time slots instead
      generateTimeSlots(date);
      toast({
        title: "Notice",
        description:
          "Using default time slots as we couldn't connect to the calendar.",
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to load more time slots
  const loadMoreSlots = () => {
    setVisibleSlots((prev) => prev + 8);
  };

  // Function to generate 30-minute time slots for the entire day
  const generateTimeSlots = (date: Date) => {
    const slots: TimeSlot[] = [];
    const slotDate = new Date(date);

    // Reset time to start of day
    slotDate.setHours(0, 0, 0, 0);

    // Generate slots from 00:00 to 23:30 in 30-minute increments
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = new Date(slotDate);
        startTime.setHours(hour, minute, 0, 0);

        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + 30);

        // Skip slots in the past if it's for today
        const now = new Date();
        if (isToday(date) && startTime <= now) {
          continue;
        }

        slots.push({
          start: startTime.toISOString(),
          end: endTime.toISOString(),
        });
      }
    }

    setAvailableSlots(slots);
    setVisibleSlots(8);
  };

  // Handle date selection
  const onDateChange = (date: Date | undefined) => {
    form.setValue("date", date);
    form.setValue("timeSlot", null);

    if (date) {
      fetchAvailableSlots(date);
    }
  };

  // Handle form submission
  const onSubmit = async (data: AppointmentFormValues) => {
    if (!data.timeSlot) {
      toast({
        title: "Time slot required",
        description:
          "Please select an available time slot for your appointment.",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);

    try {
      const response = await apiRequest({
        method: "POST",
        url: "/api/calendar/book",
        data: {
          name: data.name,
          email: data.email,
          subject: data.subject,
          description: data.description,
          startTime: data.timeSlot.start,
          endTime: data.timeSlot.end,
        },
      });

      if (response.ok) {
        setBookingSuccess(true);
        toast({
          title: "Appointment Booked!",
          description:
            "Your appointment has been scheduled successfully. Check your email for confirmation.",
          variant: "default",
        });

        // Reset form
        form.reset();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to book appointment");
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description:
          error instanceof Error
            ? error.message
            : "Could not book your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <section
      id="book-appointment"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Schedule an Appointment
          </h2>
          <div className="w-20 h-1 bg-primary-500 mx-auto rounded"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            Select a date and time to schedule a meeting
          </p>
        </div>

        {bookingSuccess ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Appointment Scheduled Successfully!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Thank you for scheduling an appointment. You'll receive a
              confirmation email shortly with all the details.
            </p>
            <Button onClick={() => setBookingSuccess(false)}>
              Schedule Another Appointment
            </Button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-heading text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Select Date & Time
                    </h3>

                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Appointment Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={onDateChange}
                                disabled={(date) => {
                                  // Only disable past dates, not weekends anymore
                                  const today = new Date();
                                  today.setHours(0, 0, 0, 0);
                                  return date < today;
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timeSlot"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Slot</FormLabel>
                          <FormControl>
                            <div className="space-y-3">
                              {isLoading ? (
                                <div className="flex justify-center items-center py-8">
                                  <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                                  <span className="ml-2 text-gray-500">
                                    Loading available times...
                                  </span>
                                </div>
                              ) : !selectedDate ? (
                                <div className="text-center py-8 text-gray-500">
                                  Please select a date first
                                </div>
                              ) : availableSlots.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                  No available time slots for this date
                                </div>
                              ) : (
                                <>
                                  <div className="grid grid-cols-2 gap-2">
                                    {availableSlots
                                      .slice(0, visibleSlots)
                                      .map((slot, index) => (
                                        <Button
                                          key={index}
                                          type="button"
                                          variant={
                                            field.value?.start === slot.start
                                              ? "default"
                                              : "outline"
                                          }
                                          className="flex items-center justify-center"
                                          onClick={() =>
                                            form.setValue("timeSlot", slot)
                                          }
                                        >
                                          <Clock className="mr-2 h-4 w-4" />
                                          {formatTime(slot.start)}
                                        </Button>
                                      ))}
                                  </div>

                                  {availableSlots.length > visibleSlots && (
                                    <div className="mt-4 text-center">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={loadMoreSlots}
                                        className="text-primary-500 border-primary-300"
                                      >
                                        Show More Times
                                      </Button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-heading text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Your Details
                    </h3>

                    <FormField
                      control={form.control}
                      name="name"
                      rules={{ required: "Name is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
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
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your@email.com"
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
                      name="subject"
                      rules={{ required: "Subject is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meeting Subject</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="What's this meeting about?"
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
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Details (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Share any specific details or questions for the meeting"
                              {...field}
                              rows={4}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full px-4 py-2 font-medium rounded-lg transition duration-300 flex justify-center items-center disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isBooking}
                      >
                        {isBooking ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Booking Appointment...
                          </>
                        ) : (
                          "Book Appointment"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </section>
  );
}
