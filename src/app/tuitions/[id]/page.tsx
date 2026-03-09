// src/app/tuitions/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";
import { useFavorites } from "@/app/context/FavoritesContext";
import tuitionApi from "@/lib/api/tuition";
import paymentApi from "@/lib/api/payment";
import { TutorSession } from "@/types/tuition.types";
import FavoriteButton from "@/app/components/FavoriteButton";
import ShareButton from "@/app/components/ShareButton";
import Login from "@/app/components/ui/Login";
import {
  Calendar,
  Clock,
  Star,
  Video,
  GraduationCap,
  ChevronRight,
  ArrowLeft,
  Loader2,
  User,
  CalendarDays,
  FileText,
  CalendarRange,
  X,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
  Smartphone,
  Building,
} from "lucide-react";

interface PaymentInitResponse {
  success: boolean;
  data?: {
    authorization_url: string;
    reference: string;
    payment_id: number | string;
  };
  message?: string;
}
// Payment Modal Component
const PaymentModal = ({
  isOpen,
  onClose,
  amount,
  currency,
  sessionId,
  sessionName,
  onPaymentComplete,
}: {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency: string;
  sessionId: number;
  sessionName: string;
  onPaymentComplete: (reference: string) => void;
}) => {
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "mobile_money" | "bank_transfer"
  >("mobile_money");
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
    if (user?.phone) {
      setPhoneNumber(user.phone);
    }
  }, [user]);

  const initializePaystackPayment = async () => {
    setProcessing(true);
    try {
      const response = (await paymentApi.initializePayment({
        amount,
        currency,
        email,
        phone: phoneNumber,
        payment_method: paymentMethod,
        metadata: {
          session_id: sessionId,
          session_name: sessionName,
          payment_type: "session_enrollment",
        },
      })) as PaymentInitResponse;

      if (response.success && response.data) {
        const { authorization_url, reference, payment_id } = response.data;

        // Store both reference and payment_id in session storage
        sessionStorage.setItem("pending_payment_reference", reference);
        sessionStorage.setItem("pending_payment_id", payment_id.toString());
        sessionStorage.setItem("pending_session_id", sessionId.toString());
        sessionStorage.setItem("pending_payment_type", "session_enrollment");

        window.location.href = authorization_url;
      } else {
        toast.error(response.message || "Failed to initialize payment");
        setProcessing(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to initialize payment");
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Complete Payment
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Amount */}
          <div className="mb-6 p-4 bg-purple-50 rounded-xl">
            <p className="text-sm text-purple-600 mb-1">Amount to Pay</p>
            <p className="text-2xl font-bold text-gray-900">
              {new Intl.NumberFormat("en-KE", {
                style: "currency",
                currency,
                minimumFractionDigits: 0,
              }).format(amount)}
            </p>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Payment Method
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setPaymentMethod("mobile_money")}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                  paymentMethod === "mobile_money"
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Smartphone
                  className={`w-5 h-5 ${
                    paymentMethod === "mobile_money"
                      ? "text-purple-600"
                      : "text-gray-400"
                  }`}
                />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Mobile Money</p>
                  <p className="text-xs text-gray-500">M-Pesa (via Paystack)</p>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("card")}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                  paymentMethod === "card"
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <CreditCard
                  className={`w-5 h-5 ${
                    paymentMethod === "card"
                      ? "text-purple-600"
                      : "text-gray-400"
                  }`}
                />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Card Payment</p>
                  <p className="text-xs text-gray-500">
                    Visa, Mastercard, Verve (via Paystack)
                  </p>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod("bank_transfer")}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                  paymentMethod === "bank_transfer"
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Building
                  className={`w-5 h-5 ${
                    paymentMethod === "bank_transfer"
                      ? "text-purple-600"
                      : "text-gray-400"
                  }`}
                />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Bank Transfer</p>
                  <p className="text-xs text-gray-500">
                    Pay with your bank account (via Paystack)
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>

            {paymentMethod === "mobile_money" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number (for M-Pesa)
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="254700000000"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your M-Pesa registered phone number
                </p>
              </div>
            )}
          </div>

          {/* Payment Button */}
          <button
            onClick={initializePaystackPayment}
            disabled={
              processing ||
              !email ||
              (paymentMethod === "mobile_money" && !phoneNumber)
            }
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ${new Intl.NumberFormat("en-KE", {
                style: "currency",
                currency,
                minimumFractionDigits: 0,
              }).format(amount)}`
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Payments are processed securely by Paystack.
            {paymentMethod === "mobile_money" &&
              " You'll receive an STK push on your phone."}
            {paymentMethod === "bank_transfer" &&
              " You'll get bank details after clicking pay."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function TuitionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { isFavorite } = useFavorites();
  const [session, setSession] = useState<TutorSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [eligibility, setEligibility] = useState<{
    canEnroll: boolean;
    reason?: string;
    requiresPayment: boolean;
    amount: number;
    currency: string;
  } | null>(null);

  const ITEMS_PER_PAGE = 10;
  const sessionId = parseInt(params.id as string);

  // Check for payment callback from Paystack
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const reference = queryParams.get("reference");
    const trxref = queryParams.get("trxref");

    if (reference || trxref) {
      handlePaymentCallback(reference || trxref || "");
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    if (sessionId) {
      fetchSessionDetails();
    }
  }, [sessionId]);

  // Refetch when auth loading completes and user is available
  useEffect(() => {
    if (!authLoading && sessionId) {
      fetchSessionDetails();
    }
  }, [authLoading, user?.uuid, sessionId]);

  const handlePaymentCallback = async (reference: string) => {
    try {
      setEnrolling(true);
      toast.loading("Verifying payment...", { id: "payment-verification" });

      // Add a small delay to allow webhook to process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Verify payment on backend
      const verifyResponse = await paymentApi.verifyPayment(reference);

      if (verifyResponse.success) {
        if (verifyResponse.data?.status === "success") {
          // Payment successful, proceed with enrollment
          const enrollResponse = await tuitionApi.enrollInSession(
            sessionId,
            reference,
          );

          if (enrollResponse.success) {
            toast.success(
              "Payment successful! You are now enrolled in the session.",
              {
                id: "payment-verification",
              },
            );
            fetchSessionDetails(); // Refresh to update enrollment status

            // Clean up URL
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname,
            );
          }
        } else {
          toast.error("Payment verification failed. Please contact support.", {
            id: "payment-verification",
          });
        }
      } else {
        toast.error(verifyResponse.message || "Failed to verify payment", {
          id: "payment-verification",
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to complete enrollment", {
        id: "payment-verification",
      });
    } finally {
      setEnrolling(false);
    }
  };

  const formatLevel = (level?: string) => {
    if (!level) return null;

    const levelMap: Record<string, string> = {
      primary: "Primary",
      junior_high: "Junior High",
      senior_high: "Senior High",
      university: "University",
      adult: "Adult",
      all: "All Levels",
    };

    return levelMap[level] || level;
  };

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      const response = await tuitionApi.getSessionById(sessionId);

      if (response.success && response.data) {
        setSession(response.data);
      } else {
        toast.error("Session not found");
        router.push("/sessions");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error fetching session:", error);
      toast.error("Failed to load session details");
      setLoading(false);
      return;
    }

    // Check enrollment eligibility if user is logged in
    if (user && (user.uuid || user.id)) {
      setCheckingEligibility(true);

      try {
        const eligibilityRes =
          await tuitionApi.checkEnrollmentEligibility(sessionId);

        console.log("eligibilityRes", eligibilityRes);

        if (eligibilityRes.success && eligibilityRes.data) {
          setEligibility(eligibilityRes.data);
        } else {
          // Default eligibility if API fails
          setEligibility({
            canEnroll: true,
            reason: "You can proceed with enrollment",
            requiresPayment: session?.fee_amount
              ? session.fee_amount > 0
              : false,
            amount: session?.fee_amount || 0,
            currency: session?.fee_currency || "KES",
          });
        }
      } catch (error) {
        console.error("Error checking eligibility:", error);
        // If API fails, allow enrollment by default
        setEligibility({
          canEnroll: true,
          reason: "You can proceed with enrollment",
          requiresPayment: session?.fee_amount ? session.fee_amount > 0 : false,
          amount: session?.fee_amount || 0,
          currency: session?.fee_currency || "KES",
        });
      } finally {
        setCheckingEligibility(false);
      }
    } else {
      setEligibility(null);
    }

    setLoading(false);
  };

  const handleEnrollClick = async () => {
    if (!user) {
      // Open login modal instead of redirecting
      setShowLoginModal(true);
      return;
    }

    // If payment is required, show payment modal
    if (eligibility?.requiresPayment && session) {
      setShowPaymentModal(true);
    } else {
      // Free enrollment
      await handleFreeEnrollment();
    }
  };

  const handleFreeEnrollment = async () => {
    try {
      setEnrolling(true);
      const response = await tuitionApi.enrollInSession(sessionId);

      if (response.success) {
        toast.success("Successfully enrolled in session!");
        fetchSessionDetails();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to enroll in session");
    } finally {
      setEnrolling(false);
    }
  };

  const handlePaymentComplete = async (reference: string) => {
    setShowPaymentModal(false);
    await handlePaymentCallback(reference);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Re-fetch session details to update eligibility
    fetchSessionDetails();
  };

  const formatCurrency = (amount: number, currency: string = "KES") => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSortedSchedules = () => {
    if (!session?.schedules || !Array.isArray(session.schedules)) {
      return [];
    }

    const validSchedules = session.schedules
      .map((schedule, index) => {
        if (!schedule.date) {
          return null;
        }

        const startDate = new Date(schedule.date);

        if (isNaN(startDate.getTime())) {
          return null;
        }

        const endDate = new Date(startDate);
        endDate.setMinutes(
          endDate.getMinutes() + (session.class_duration_minutes || 90),
        );

        return {
          id: schedule.id || index,
          start_time: startDate.toISOString(),
          end_time: endDate.toISOString(),
          original_date: schedule.date,
          title: schedule.title || "",
          description: schedule.description || "",
        };
      })
      .filter((schedule) => schedule !== null)
      .sort((a, b) => {
        return (
          new Date(a!.start_time).getTime() - new Date(b!.start_time).getTime()
        );
      });

    return validSchedules;
  };

  const formatScheduleDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatScheduleDay = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleDateString("en-US", {
        weekday: "long",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatScheduleTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Time";
      }
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Time";
    }
  };

  const ScheduleModal = () => {
    const schedules = getSortedSchedules();

    const totalPages = Math.ceil(schedules.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentSchedules = schedules.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
      setCurrentPage(page);
    };

    const goToFirstPage = () => goToPage(1);
    const goToLastPage = () => goToPage(totalPages);
    const goToPreviousPage = () => goToPage(Math.max(1, currentPage - 1));
    const goToNextPage = () => goToPage(Math.min(totalPages, currentPage + 1));

    if (schedules.length === 0) {
      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Full Schedule
              </h3>
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setCurrentPage(1);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-12 text-center">
              <CalendarRange className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                No schedule available for this session
              </p>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setCurrentPage(1);
                }}
                className="w-full py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Full Schedule
            </h3>
            <button
              onClick={() => {
                setShowScheduleModal(false);
                setCurrentPage(1);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
            {/* Summary */}
            <div className="mb-4 p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-purple-700">
                <span className="font-medium">Total Classes:</span>{" "}
                {schedules.length} sessions
              </p>
            </div>

            {/* Schedule List */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-600 pb-2 border-b border-gray-200">
                <span className="w-8 font-medium text-center">#</span>
                <span className="w-32 font-medium">Date</span>
                <span className="w-24 font-medium">Day</span>
                <span className="flex-1 font-medium">Time</span>
              </div>

              {currentSchedules.map((schedule, index) => {
                const globalIndex = startIndex + index + 1;
                return (
                  <div
                    key={schedule.id || index}
                    className="flex items-center gap-4 text-sm hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <span className="w-8 text-center text-gray-500 font-mono">
                      {globalIndex}
                    </span>
                    <span className="w-32 text-gray-900 font-medium">
                      {formatScheduleDate(schedule.start_time)}
                    </span>
                    <span className="w-24 text-gray-600">
                      {formatScheduleDay(schedule.start_time)}
                    </span>
                    <span className="flex-1 text-gray-600">
                      {formatScheduleTime(schedule.start_time)} -{" "}
                      {formatScheduleTime(
                        schedule.end_time || schedule.start_time,
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, schedules.length)} of {schedules.length}{" "}
                  classes
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="First page"
                  >
                    <ChevronsLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => goToPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? "bg-purple-600 text-white"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Last page"
                  >
                    <ChevronsRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                setShowScheduleModal(false);
                setCurrentPage(1);
              }}
              className="w-full py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Show loading while auth is loading or session is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-purple-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Session Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The session you're looking for doesn't exist.
          </p>
          <Link
            href="/sessions"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sessions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Login Modal */}
      <Login
        isLoginOpen={showLoginModal}
        setIsLoginOpen={setShowLoginModal}
        // onSuccess={() => {
        //   // Re-fetch session details after successful login
        //   fetchSessionDetails();
        // }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-purple-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href="/sessions"
            className="hover:text-purple-600 transition-colors"
          >
            Sessions
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate">
            {session.name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Header */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                        session.session_type === "one_on_one"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {session.session_type === "one_on_one"
                        ? "One-on-One Session"
                        : "Group Session"}
                    </span>
                    {session.course_level && (
                      <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {formatLevel(session.course_level)}
                      </span>
                    )}
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                        session.enrollment_status === "open"
                          ? "bg-green-100 text-green-700"
                          : session.enrollment_status === "waiting_list"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {session.enrollment_status.replace("_", " ")}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 w-full">
                    {session.name}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-500 mt-2">
                    {session.course_title}
                  </p>
                  {session.course_subject && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Subject: {session.course_subject}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
                  <FavoriteButton type="session" id={session.id} size="md" />
                  <ShareButton
                    title={session.name}
                    description={
                      session.description || session.course_description
                    }
                    size="md"
                  />
                </div>
              </div>

              {/* Session Meta */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 py-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Price</p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {formatCurrency(session.fee_amount, session.fee_currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {session.class_duration_minutes || 90} min
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Classes/Week</p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {session.classes_per_week || 1}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                About This Session
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {session.description ||
                  session.course_description ||
                  "No description provided."}
              </p>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Schedule
                </h2>
                <button
                  onClick={() => {
                    setShowScheduleModal(true);
                    setCurrentPage(1);
                  }}
                  className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  <CalendarRange className="w-4 h-4" />
                  Show Full Schedule ({session.schedules?.length || 0} classes)
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(session.start_date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDays className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(session.end_date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Session Times</p>
                    <p className="font-medium text-gray-900">
                      {session.classes_per_week || 1} class(s) per week,{" "}
                      {session.class_duration_minutes || 90} minutes each
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tutor Section */}
            {session.tutor_id && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Tutor
                </h2>
                <div
                  onClick={() => router.push(`/tutors/${session.tutor_id}`)}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden flex-shrink-0">
                    {session.tutor_avatar ? (
                      <img
                        src={session.tutor_avatar}
                        alt={session.tutor_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                      {session.tutor_name || "Tutor"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {session.tutor_bio}
                    </p>
                    {session.tutor_rating && session.tutor_rating > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-700">
                          {session.tutor_rating &&
                            parseFloat(session.tutor_rating.toString()).toFixed(
                              1,
                            )}
                        </span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Enrollment Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-4">
              <div className="text-center mb-6">
                <p className="text-3xl font-semibold text-gray-900">
                  {formatCurrency(session.fee_amount, session.fee_currency)}
                </p>
                <p className="text-sm text-gray-500 mt-1">per student</p>
              </div>

              {/* Enrollment Status */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Availability</span>
                  <span className="font-medium text-gray-900">
                    {session.max_students - session.current_enrollment} spots
                    left
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 rounded-full h-2"
                    style={{
                      width: `${(session.current_enrollment / session.max_students) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Enrollment Button */}
              {session.enrollment_status === "open" &&
              session.current_enrollment < session.max_students ? (
                user ? (
                  checkingEligibility ? (
                    <button
                      disabled
                      className="w-full py-3 bg-gray-200 text-gray-500 font-medium rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Checking eligibility...
                    </button>
                  ) : eligibility === null ? (
                    <button
                      onClick={() => {
                        setCheckingEligibility(true);
                        fetchSessionDetails();
                      }}
                      className="w-full py-3 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors"
                    >
                      Retry Eligibility Check
                    </button>
                  ) : eligibility.canEnroll ? (
                    <button
                      onClick={handleEnrollClick}
                      disabled={enrolling}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {enrolling ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Enroll Now"
                      )}
                    </button>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-amber-600 mb-3">
                        {eligibility.reason || "Cannot enroll at this time"}
                      </p>
                      <button
                        disabled
                        className="w-full py-3 bg-gray-200 text-gray-500 font-medium rounded-xl cursor-not-allowed"
                      >
                        Unavailable
                      </button>
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="w-full py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors"
                  >
                    Login to Enroll
                  </button>
                )
              ) : (
                <div className="text-center">
                  <p className="text-sm text-red-600 mb-3">
                    {session.enrollment_status === "closed"
                      ? "Enrollment Closed"
                      : "Session Full"}
                  </p>
                  <button
                    disabled
                    className="w-full py-3 bg-gray-200 text-gray-500 font-medium rounded-xl cursor-not-allowed"
                  >
                    Not Available
                  </button>
                </div>
              )}

              {/* Session Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Video className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Live online sessions</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Course materials included
                  </span>
                </div>
              </div>
              {/* Session Code */}
              <div
                className="bg-transparent mt-14"
                style={{ top: "calc(4rem + 380px)" }}
              >
                <p className="text-xs text-gray-500 mb-1">Session Code</p>
                <p className="font-mono text-lg font-semibold text-gray-900 break-all">
                  {session.session_code}
                </p>
              </div>
            </div>

            {/* Session Code */}
            {/* <div
              className="bg-gray-50 rounded-2xl p-6 border border-gray-200 sticky"
              style={{ top: "calc(4rem + 380px)" }}
            >
              <p className="text-xs text-gray-500 mb-1">Session Code</p>
              <p className="font-mono text-lg font-semibold text-gray-900 break-all">
                {session.session_code}
              </p>
            </div>
            <div
              className="text-xs text-gray-400 text-center sticky"
              style={{ top: "calc(4rem + 500px)" }}
            >
              <p>Share this code with friends to join</p>
            </div> */}
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && <ScheduleModal />}

      {/* Payment Modal */}
      {showPaymentModal && session && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={session.fee_amount}
          currency={session.fee_currency}
          sessionId={sessionId}
          sessionName={session.name}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
}
