// src/app/contact/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import client from "@/lib/api/client";
import {
  Mail,
  Phone,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Users,
  GraduationCap,
  CreditCard,
  Shield,
} from "lucide-react";
import { z } from "zod";

// Create Zod schema matching the Joi validation
const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  subject: z
    .string()
    .min(1, "Subject is required")
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject cannot exceed 200 characters"),

  category: z.enum(
    [
      "general",
      "support",
      "tutor",
      "community",
      "payment",
      "report",
      "feedback",
      "other",
    ],
    {
      errorMap: () => ({ message: "Please select a valid category" }),
    },
  ),

  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message cannot exceed 5000 characters"),
});

// Infer TypeScript type from schema
type ContactFormData = z.infer<typeof contactSchema>;

// Create a contact API interface
interface ContactResponse {
  success: boolean;
  message?: string;
}

// Create a contact API interface with proper typing
const contactApi = {
  sendMessage: (data: ContactFormData): Promise<ContactResponse> =>
    client.post<ContactResponse>("/contact", data),
};

interface FormErrors {
  name?: string[];
  email?: string[];
  subject?: string[];
  category?: string[];
  message?: string[];
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Helper function to check if form has any errors
  const hasErrors = () => {
    return Object.values(errors).some(
      (errorArray) => errorArray && errorArray.length > 0,
    );
  };

  // Validate form whenever formData changes
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const formErrors = validateForm();
      setErrors(formErrors);
    }
  }, [formData]);

  const validateField = (name: keyof ContactFormData, value: string) => {
    try {
      const fieldSchema = contactSchema.shape[name];

      if (name === "category") {
        fieldSchema.parse(value);
      } else {
        fieldSchema.parse(value);
      }
      return undefined;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors.map((e) => e.message);
      }
      return ["Invalid value"];
    }
  };

  const validateForm = () => {
    try {
      contactSchema.parse(formData);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors: FormErrors = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof FormErrors;
          if (!formErrors[field]) {
            formErrors[field] = [];
          }
          formErrors[field]?.push(err.message);
        });
        return formErrors;
      }
      return {};
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate single field on blur
    const fieldError = validateField(
      name as keyof ContactFormData,
      formData[name as keyof ContactFormData],
    );
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear submit error when user starts typing
    if (submitStatus === "error") {
      setSubmitStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    setTouched(allTouched);

    // Validate all fields
    const formErrors = validateForm();
    setErrors(formErrors);

    // If there are errors, don't submit
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      // Use the API client
      const response = await contactApi.sendMessage(formData);

      if (response.success) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          category: "general",
          message: "",
        });
        setErrors({});
        setTouched({});
      } else {
        throw new Error(response.message || "Failed to send message");
      }
    } catch (error: any) {
      console.error("Contact form error:", error);
      setSubmitStatus("error");
      setErrorMessage(
        error.message || "Failed to send message. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (fieldName: keyof FormErrors) => {
    const baseClass =
      "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-colors";
    const errorClass =
      errors[fieldName] && errors[fieldName]?.length && touched[fieldName]
        ? "border-red-500 bg-red-50"
        : "border-gray-300";
    return `${baseClass} ${errorClass}`;
  };

  const categories = [
    { value: "general", label: "General Inquiry" },
    { value: "support", label: "Technical Support" },
    { value: "tutor", label: "Tutor Application" },
    { value: "community", label: "Community Registration" },
    { value: "payment", label: "Payment & Billing" },
    { value: "report", label: "Report an Issue" },
    { value: "feedback", label: "Feedback & Suggestions" },
    { value: "other", label: "Other" },
  ];

  const faqs = [
    {
      icon: <GraduationCap className="w-4 h-4" />,
      question: "How do I become a tutor?",
      answer:
        "Visit our Tutor Onboarding page and complete the application process. The onboarding fee is KES 1,160 (including VAT).",
      link: "/onboarding/tutor",
    },
    {
      icon: <CreditCard className="w-4 h-4" />,
      question: "Having payment issues?",
      answer:
        "Contact our billing team at payments@somohub.com with your transaction details for assistance.",
      link: "mailto:payments@somohub.com",
    },
    {
      icon: <Shield className="w-4 h-4" />,
      question: "Report a safety concern",
      answer:
        "Use our reporting system or email safety@somohub.com immediately for urgent matters.",
      link: "mailto:safety@somohub.com",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to us and we'll get
            back to you as soon as possible.
          </p>
        </div>

        {/* Contact Form & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Form - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Send us a message
              </h2>

              {submitStatus === "success" ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Thank you for reaching out. We'll get back to you within
                    24-48 hours. A confirmation email has been sent to your
                    inbox.
                  </p>
                  <button
                    onClick={() => setSubmitStatus("idle")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={getInputClassName("name")}
                        placeholder="John Doe"
                        disabled={isSubmitting}
                      />
                      {errors.name &&
                        errors.name.length > 0 &&
                        touched.name && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.name[0]}
                          </p>
                        )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={getInputClassName("email")}
                        placeholder="john@example.com"
                        disabled={isSubmitting}
                      />
                      {errors.email &&
                        errors.email.length > 0 &&
                        touched.email && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.email[0]}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Subject and Category Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={getInputClassName("subject")}
                        placeholder="What is this about?"
                        disabled={isSubmitting}
                      />
                      {errors.subject &&
                        errors.subject.length > 0 &&
                        touched.subject && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.subject[0]}
                          </p>
                        )}
                    </div>

                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Category *
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={getInputClassName("category")}
                        disabled={isSubmitting}
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      {errors.category &&
                        errors.category.length > 0 &&
                        touched.category && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.category[0]}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      rows={5}
                      className={getInputClassName("message")}
                      placeholder="How can we help you?"
                      disabled={isSubmitting}
                    />
                    {errors.message &&
                      errors.message.length > 0 &&
                      touched.message && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.message[0]}
                        </p>
                      )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-gray-400">* Required fields</p>
                    <button
                      type="submit"
                      disabled={isSubmitting || hasErrors()}
                      className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>

                  {submitStatus === "error" && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Failed to send message
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          {errorMessage ||
                            "Please try again or email us directly at support@somohub.com"}
                        </p>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Sidebar - Takes 1 column (unchanged) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Help */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Quick Help</h3>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/help"
                    className="text-sm text-gray-600 hover:text-purple-600 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    Visit our Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/onboarding/tutor"
                    className="text-sm text-gray-600 hover:text-purple-600 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    Tutor Application Guide
                  </Link>
                </li>
              </ul>
            </div>

            {/* Response Time */}
            <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Response Time</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                We typically respond within:
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium text-gray-900">24-48 hours</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-medium text-gray-900">
                    Immediate (business hours)
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Urgent issues</span>
                  <span className="font-medium text-gray-900">4-6 hours</span>
                </div>
              </div>
            </div>

            {/* Support Hours */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Support Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium text-gray-900">
                    8:00 AM - 6:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium text-gray-900">
                    9:00 AM - 2:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium text-gray-900">Closed</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                East Africa Time (EAT)
              </p>
            </div>

            {/* Direct Email Contacts */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Direct Contacts
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-600">Support:</span>
                  <a
                    href="mailto:support@somohub.com"
                    className="text-purple-600 hover:underline"
                  >
                    support@somohub.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-600">Payments:</span>
                  <a
                    href="mailto:payments@somohub.com"
                    className="text-purple-600 hover:underline"
                  >
                    payments@somohub.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-600">Safety:</span>
                  <a
                    href="mailto:safety@somohub.com"
                    className="text-purple-600 hover:underline"
                  >
                    safety@somohub.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-600">General:</span>
                  <a
                    href="mailto:info@somohub.com"
                    className="text-purple-600 hover:underline"
                  >
                    info@somohub.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  {faq.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{faq.answer}</p>
                  <Link
                    href={faq.link}
                    className="text-xs text-purple-600 hover:text-purple-800 font-medium inline-flex items-center gap-1"
                  >
                    Learn more
                    <span className="text-lg leading-none">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
