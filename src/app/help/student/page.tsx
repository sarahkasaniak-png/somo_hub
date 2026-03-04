// src/app/help/student/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  BookOpen,
  Users,
  Calendar,
  DollarSign,
  Video,
  MapPin,
  Globe,
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Search,
  MessageSquare,
  Mail,
  Phone,
  ExternalLink,
  PlayCircle,
  Download,
  Upload,
  Copy,
  Award,
  Star,
  Clock,
  Shield,
  CreditCard,
  Settings,
  UserPlus,
  GraduationCap,
  Briefcase,
  Sparkles,
  Zap,
  Rocket,
  Target,
  TrendingUp,
  ThumbsUp,
  HelpCircle as HelpIcon,
  BookMarked,
  CalendarDays,
  LayoutGrid,
  List,
  Grid,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Globe2,
  Link as LinkIcon,
  FileUp,
  FileDown,
  Printer,
  Share2,
  Bell,
  BellOff,
  Moon,
  Sun,
  Palette,
  Languages,
  Clock as ClockIcon,
  User,
  LogOut,
  Menu,
  X,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Check,
  AlertTriangle,
  Info,
  Loader2,
  Home,
  Search as SearchIcon,
  Filter as FilterIcon,
  SortAsc,
  SortDesc,
  Star as StarIcon,
  StarHalf,
  StarOff,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown,
  Flag,
  Share,
  Bookmark,
  Heart,
  ShoppingCart,
  Wallet,
  CreditCard as CreditCardIcon,
  Banknote,
  QrCode,
  Smartphone,
  Laptop,
  Tablet,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  ScreenShare,
  ScreenShareOff,
  MessageCircle,
  Users as UsersIcon,
  UserCheck as UserCheckIcon,
  UserX as UserXIcon,
  UserPlus as UserPlusIcon,
  UserMinus,
  CalendarCheck,
  CalendarX,
  Clock as ClockIcon2,
  Clock3,
  Clock4,
  Clock5,
  Clock6,
  Clock7,
  Clock8,
  Clock9,
  Clock10,
  Clock11,
  Clock12,
  AlarmClock,
  AlarmClockOff,
  Bell as BellIcon,
  BellOff as BellOffIcon,
  BellRing,
  BellPlus,
  BellMinus,
  BellDot,
  MessageSquare as MessageSquareIcon,
  MessageCircle as MessageCircleIcon,
  MessageSquareDashed,
  MessageSquarePlus,
  MessageSquareX,
  MessageSquareWarning,
  Mail as MailIcon,
  MailOpen,
  MailQuestion,
  MailCheck,
  MailX,
  Phone as PhoneIcon,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  PhoneOff,
} from "lucide-react";

interface HelpSection {
  id: string;
  title: string;
  icon: any;
  description: string;
  articles: HelpArticle[];
}

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  link?: string;
  steps?: string[];
  tips?: string[];
  warning?: string;
  note?: string;
  example?: string;
  examples?: string[];
  video?: string;
  faqs?: { question: string; answer: string }[];
}

export default function StudentHelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "getting-started",
  );
  const [expandedArticles, setExpandedArticles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<
    "all" | "finding" | "learning" | "payments" | "account"
  >("all");

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const toggleArticle = (articleId: string) => {
    setExpandedArticles((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId],
    );
  };

  const helpSections: HelpSection[] = [
    {
      id: "getting-started",
      title: "Getting Started as a Student",
      icon: Rocket,
      description: "Everything you need to know to begin your learning journey",
      articles: [
        {
          id: "create-account",
          title: "Creating Your Student Account",
          description: "How to sign up and set up your profile",
          content:
            "Getting started on SomoHub is easy. Here's how to create your student account.",
          steps: [
            "Go to SomoHub.com and click 'Sign Up'",
            "Choose 'Student' as your account type",
            "Enter your email address and create a password",
            "Verify your email via the OTP sent to your inbox",
            "Complete your profile with your name and optional details",
            "Upload a profile picture (optional but recommended)",
            "Set your learning preferences and interests",
            "Start exploring courses and tutors",
          ],
          tips: [
            "Use a real email address you check regularly",
            "Choose a strong password with letters, numbers, and symbols",
            "Add a profile photo to help tutors recognize you",
            "Complete your profile to get personalized recommendations",
          ],
          link: "/register/student",
        },
        {
          id: "complete-profile",
          title: "Completing Your Student Profile",
          description:
            "Enhance your profile to get better learning recommendations",
          content:
            "A complete profile helps tutors understand your needs and personalize your learning experience.",
          steps: [
            "Go to Settings → Profile",
            "Add your full name (or preferred name)",
            "Upload a clear profile picture",
            "Add your educational background (optional)",
            "Select subjects you're interested in",
            "Set your preferred learning levels (primary, high school, university, etc.)",
            "Add your timezone for accurate scheduling",
            "Specify your learning goals",
            "Save your changes",
          ],
          tips: [
            "A professional photo helps tutors recognize you in video sessions",
            "Listing your interests helps with course recommendations",
            "Setting your timezone ensures accurate session times",
            "You can update your profile anytime",
          ],
          link: "/settings/profile",
        },
      ],
    },
    {
      id: "finding-tutors",
      title: "Finding the Right Tutor",
      icon: SearchIcon,
      description:
        "How to search, filter, and choose the best tutor for your needs",
      articles: [
        {
          id: "search-tutors",
          title: "Searching for Tutors and Courses",
          description: "Use our search tools to find the perfect match",
          content:
            "SomoHub makes it easy to find tutors and courses that match your learning goals.",
          steps: [
            "Go to the 'Find Tutors' or 'Browse Courses' page",
            "Use the search bar to search by subject, tutor name, or keyword",
            "Apply filters to narrow results:",
            "  - Subject (Mathematics, Physics, English, etc.)",
            "  - Level (Primary, Junior High, Senior High, University, Adult)",
            "  - Price range",
            "  - Tutor rating (4+ stars, 3+ stars, etc.)",
            "  - Availability (days, times)",
            "  - Teaching mode (virtual, in-person, hybrid)",
            "  - Language",
            "Sort results by relevance, rating, price, or popularity",
            "Click on tutor profiles to view details",
          ],
          tips: [
            "Use specific subject names for better results",
            "Check tutor ratings and reviews from other students",
            "Look at tutor qualifications and experience",
            "Read course descriptions carefully",
            "Bookmark promising tutors for later comparison",
          ],
          example:
            "Searching 'KCSE Mathematics' filters by subject, level, and shows all relevant tutors",
          link: "/find-tutors",
        },
        {
          id: "evaluate-tutors",
          title: "Evaluating Tutors and Courses",
          description: "How to choose the best tutor for your needs",
          content:
            "Not all tutors are the same. Here's what to look for when choosing.",
          steps: [
            "Review tutor profiles thoroughly",
            "Check their qualifications and experience",
            "Read their bio and teaching philosophy",
            "Look at their subject specialties and levels",
            "Check their hourly rate and course prices",
            "Read student reviews and ratings",
            "View their response rate and response time",
            "Check their availability for your schedule",
            "Review course curricula and learning outcomes",
            "Look at prerequisites to ensure you're ready",
            "Compare multiple tutors before deciding",
          ],
          tips: [
            "Look for tutors with experience in your specific exam board (KCSE, IGCSE, etc.)",
            "Check if they have experience with students at your level",
            "Read both positive and negative reviews",
            "Consider if their teaching style matches your learning style",
            "Don't choose solely based on price - quality matters",
          ],
          warning:
            "Be wary of tutors with consistently low ratings or no reviews. Check for verified credentials.",
          link: "/find-tutors",
        },
        {
          id: "contact-tutors",
          title: "Contacting Tutors Before Enrollment",
          description: "How to ask questions before signing up",
          content:
            "You can message tutors to ask questions before enrolling in their courses.",
          steps: [
            "Go to the tutor's profile page",
            "Click the 'Contact' or 'Message' button",
            "Write your message with specific questions",
            "Ask about their teaching approach",
            "Inquire about availability if not listed",
            "Request more details about course content",
            "Ask about their experience with your specific needs",
            "Wait for the tutor to respond (usually within 24 hours)",
            "Check your messages for their reply",
          ],
          tips: [
            "Be specific about what you want to learn",
            "Mention your current level and goals",
            "Ask about materials or resources needed",
            "Don't share personal contact information",
            "Keep all communication on the platform for safety",
          ],
          note: "Tutors typically respond within 24 hours. You can check their response rate on their profile.",
          link: "/messages",
        },
      ],
    },
    {
      id: "enrollment",
      title: "Enrolling in Courses",
      icon: UserPlusIcon,
      description: "How to enroll in sessions and manage your learning",
      articles: [
        {
          id: "enroll-session",
          title: "How to Enroll in a Session",
          description: "Step-by-step guide to joining a course",
          content: "Once you've found the right course, here's how to enroll.",
          steps: [
            "Go to the course or session you want to join",
            "Review all session details:",
            "  - Start and end dates",
            "  - Schedule (days and times)",
            "  - Total weeks and classes",
            "  - Session fee",
            "  - Maximum students",
            "  - Current enrollment",
            "Click the 'Enroll Now' button",
            "Review your enrollment summary",
            "Proceed to payment",
            "Complete payment using your preferred method",
            "Receive confirmation email",
            "Access your course materials and session links",
          ],
          tips: [
            "Check the session schedule carefully to ensure it fits your availability",
            "Note the start date so you don't miss the first class",
            "Save the confirmation email for reference",
            "Add session dates to your calendar",
          ],
          warning:
            "Enrollment is only confirmed after successful payment. Spaces are limited and available on first-come, first-served basis.",
          link: "/courses",
        },
        {
          id: "payment-methods",
          title: "Payment Methods for Students",
          description: "How to pay for your sessions",
          content:
            "SomoHub offers multiple convenient payment options for students.",
          steps: [
            "After clicking 'Enroll Now', you'll be taken to checkout",
            "Review the amount to be paid",
            "Select your payment method:",
            "  - M-Pesa (Paybill or Till Number)",
            "  - Bank transfer (EFT)",
            "  - Credit/Debit card (Visa, Mastercard)",
            "  - PayPal (for international students)",
            "Enter required payment details",
            "Confirm the payment",
            "Wait for payment confirmation (instant for most methods)",
            "You'll receive a receipt via email",
            "Your enrollment is now active",
          ],
          tips: [
            "M-Pesa payments are usually instant",
            "Bank transfers may take 1-2 hours to reflect",
            "Save your payment reference number",
            "Check your email for payment confirmation",
            "Contact support if payment isn't confirmed within 24 hours",
          ],
          note: "Students pay the full session fee upfront. This secures your spot and ensures the tutor is committed to teaching.",
          link: "/payment-methods",
        },
        {
          id: "view-enrollments",
          title: "Viewing Your Enrollments",
          description: "How to see all your enrolled courses",
          content: "Track all your active and past enrollments in one place.",
          steps: [
            "Go to 'My Learning' or 'My Enrollments' from your dashboard",
            "View all your enrolled sessions",
            "Filter by status: Active, Completed, Upcoming",
            "Click on any session to view details",
            "See session schedule and upcoming classes",
            "Access class meeting links",
            "View course materials and resources",
            "Track your progress and attendance",
            "Leave reviews for completed sessions",
          ],
          tips: [
            "Check your enrollments regularly for updates",
            "Note upcoming class dates and times",
            "Access materials before each class",
            "Review your attendance record",
          ],
          link: "/my-learning",
        },
      ],
    },
    {
      id: "attending-classes",
      title: "Attending Live Classes",
      icon: Video,
      description: "How to join and participate in virtual sessions",
      articles: [
        {
          id: "join-class",
          title: "Joining a Live Class",
          description: "Step-by-step guide to attending your sessions",
          content:
            "All virtual classes use BigBlueButton (BBB) for a seamless learning experience.",
          steps: [
            "Go to 'My Learning' and find your session",
            "On the day of class, find the scheduled class in your list",
            "5-10 minutes before start time, click 'Join Class'",
            "You'll be taken to the BBB meeting room",
            "Allow access to your microphone and camera when prompted",
            "Enter your name as it appears on your profile",
            "Wait for the tutor to start the session",
            "Participate using these features:",
            "  - Raise hand to ask questions",
            "  - Use chat for text questions",
            "  - Share screen when permitted",
            "  - Use whiteboard when enabled",
            "  - Join breakout rooms for group work",
          ],
          tips: [
            "Join 5 minutes early to test your audio and video",
            "Use headphones to reduce echo",
            "Find a quiet place with good internet",
            "Mute your mic when not speaking",
            "Use the raise hand feature instead of interrupting",
            "Close other browser tabs to save bandwidth",
          ],
          warning:
            "Never share your class access link with others. Only enrolled students are allowed to join.",
          video: "https://example.com/bbb-student-tutorial",
        },
        {
          id: "tech-requirements",
          title: "Technical Requirements",
          description: "What you need for a smooth learning experience",
          content: "Ensure you have the right setup for virtual classes.",
          steps: [
            "Check your internet connection (minimum 5 Mbps recommended)",
            "Use a modern browser (Chrome, Firefox, Edge recommended)",
            "Ensure you have:",
            "  - Working microphone",
            "  - Webcam (recommended but optional)",
            "  - Speakers or headphones",
            "  - Updated browser",
            "Test your setup before your first class",
            "Have a backup plan (mobile data) in case of internet issues",
          ],
          tips: [
            "Wired internet connections are more stable than WiFi",
            "Close bandwidth-heavy applications during class",
            "Keep your device charged or plugged in",
            "Have the tutor's contact info in case of technical issues",
          ],
          link: "/tech-requirements",
        },
        {
          id: "class-etiquette",
          title: "Classroom Etiquette",
          description: "How to be a respectful and engaged student",
          content: "Good etiquette makes classes better for everyone.",
          steps: [
            "Be punctual - join a few minutes early",
            "Mute your microphone when not speaking",
            "Use the 'raise hand' feature to ask questions",
            "Be respectful in chat - no inappropriate messages",
            "Pay attention and avoid multitasking",
            "Participate when asked",
            "Don't record sessions without permission",
            "Don't share class links with others",
            "Be patient with technical difficulties",
            "Thank your tutor at the end",
          ],
          tips: [
            "Taking notes helps you stay engaged",
            "Ask questions if something isn't clear",
            "Other students benefit from your questions too",
            "A positive attitude makes learning better",
          ],
          warning:
            "Disruptive behavior may result in being removed from the class or suspended from the platform.",
        },
      ],
    },
    {
      id: "payments-refunds",
      title: "Payments & Refunds",
      icon: CreditCardIcon,
      description: "Understanding payments, receipts, and refunds",
      articles: [
        {
          id: "payment-process",
          title: "How Student Payments Work",
          description: "Understanding the payment process",
          content: "Here's how payments work for students on SomoHub.",
          steps: [
            "When you enroll, you pay the full session fee upfront",
            "Your payment secures your spot in the session",
            "Funds are held securely by SomoHub",
            "Tutors are paid weekly after teaching classes",
            "You can access all session materials immediately",
            "You'll receive a receipt via email",
            "Payment history is available in your account",
          ],
          tips: [
            "Save your receipts for your records",
            "Check your payment history regularly",
            "Contact support immediately if you see unauthorized charges",
          ],
          note: "Your upfront payment ensures tutors are committed to teaching and sessions run as scheduled.",
          link: "/payment-history",
        },
        {
          id: "refund-policy",
          title: "Cancellation and Refund Policy",
          description: "When and how you can get a refund",
          content:
            "Our refund policy is designed to be fair to both students and tutors.",
          steps: [
            "Review refund eligibility before canceling:",
            "  • More than 7 days before session starts: 90% refund",
            "  • 3-7 days before session starts: 50% refund",
            "  • Less than 3 days before session starts: No refund",
            "  • After session starts: No refund for remaining classes",
            "  • Tutor cancels session: 100% refund",
            "  • Technical issues preventing attendance: Case-by-case",
            "To request a refund:",
            "  Go to 'My Enrollments'",
            "  Find the session and click 'Request Refund'",
            "  Select reason and submit",
            "  Refund processed within 5-10 business days",
            "  Money returns to original payment method",
          ],
          tips: [
            "Submit refund requests as early as possible",
            "Check your refund eligibility before requesting",
            "Contact support if refund isn't received within 10 days",
            "Platform fees are non-refundable",
          ],
          warning:
            "Refund requests must be submitted through the Platform. Direct requests to tutors cannot be processed.",
          example:
            "If you cancel a KES 5,000 session 5 days before start, you'll receive KES 2,500 (50% refund).",
          link: "/refund-policy",
        },
        {
          id: "payment-issues",
          title: "Troubleshooting Payment Issues",
          description: "What to do if your payment doesn't go through",
          content: "If you experience payment problems, try these solutions.",
          steps: [
            "Check your internet connection",
            "Verify you have sufficient funds",
            "For M-Pesa:",
            "  - Confirm you're using the correct Paybill/Till number",
            "  - Check you've entered the correct amount",
            "  - Wait for confirmation SMS",
            "For card payments:",
            "  - Check card details are correct",
            "  - Ensure card is not expired",
            "  - Verify with your bank for any blocks",
            "If payment fails but money was deducted:",
            "  - Wait 30 minutes (may auto-resolve)",
            "  - Contact support with payment reference",
            "  - Provide screenshots of any error messages",
          ],
          tips: [
            "Save payment reference numbers",
            "Take screenshots of error messages",
            "Contact support within 24 hours if issues persist",
          ],
          link: "/support/payments",
        },
      ],
    },
    {
      id: "after-class",
      title: "After the Class",
      icon: Award,
      description: "Reviews, certificates, and continuing your learning",
      articles: [
        {
          id: "leave-review",
          title: "Leaving Reviews and Ratings",
          description: "How to provide feedback on your learning experience",
          content:
            "Your feedback helps other students and helps tutors improve.",
          steps: [
            "After a session ends, go to 'My Learning'",
            "Find the completed session",
            "Click 'Leave a Review'",
            "Rate the tutor (1-5 stars)",
            "Write a detailed review of your experience",
            "Mention what you liked and areas for improvement",
            "Submit your review",
            "Your review will be published on the tutor's profile",
          ],
          tips: [
            "Be honest and constructive",
            "Mention specific things you learned",
            "Highlight what made the tutor effective",
            "Respectful feedback is most helpful",
            "Both positive and constructive reviews help",
          ],
          note: "Reviews are public and help other students make informed decisions.",
          link: "/my-learning",
        },
        {
          id: "certificates",
          title: "Getting Certificates of Completion",
          description: "How to earn and access course certificates",
          content:
            "Many courses offer certificates upon successful completion.",
          steps: [
            "Complete all required classes and assignments",
            "Meet the attendance requirements (usually 80%+)",
            "Tutor will mark your completion",
            "Certificate becomes available in your account",
            "Go to 'My Certificates' to view and download",
            "Share certificates on LinkedIn or your resume",
            "Print or save for your records",
          ],
          tips: [
            "Check certificate requirements before enrolling",
            "Attend all classes to ensure completion",
            "Download and save certificates immediately",
            "Verify certificate details are correct",
          ],
          link: "/my-certificates",
        },
        {
          id: "continue-learning",
          title: "Continuing Your Learning Journey",
          description: "Next steps after completing a course",
          content: "Keep growing with these recommendations.",
          steps: [
            "Review what you've learned",
            "Identify areas for further study",
            "Check tutor's other courses",
            "Explore related subjects",
            "Look for advanced level courses",
            "Join learning communities",
            "Connect with other students",
            "Set new learning goals",
          ],
          tips: [
            "Many tutors offer progressive course series",
            "Join communities related to your interests",
            "Follow your favorite tutors for updates",
            "Share your achievements on social media",
          ],
          link: "/recommendations",
        },
      ],
    },
    {
      id: "account-settings",
      title: "Account Settings",
      icon: Settings,
      description: "Manage your profile, notifications, and preferences",
      articles: [
        {
          id: "edit-profile",
          title: "Editing Your Profile",
          description: "Keep your information up to date",
          content: "Regularly update your profile to get the best experience.",
          steps: [
            "Go to Settings → Profile",
            "Update personal information",
            "Change profile picture",
            "Update learning interests",
            "Change password",
            "Update email address (requires verification)",
            "Add or update phone number",
            "Set your timezone",
            "Save changes",
          ],
          tips: [
            "Use a current profile picture",
            "Keep your contact information updated",
            "Change password regularly for security",
          ],
          link: "/settings/profile",
        },
        {
          id: "notifications",
          title: "Managing Notifications",
          description: "Control how you receive updates",
          content: "Stay informed without being overwhelmed.",
          steps: [
            "Go to Settings → Notifications",
            "Choose which notifications to receive:",
            "  - Upcoming class reminders",
            "  - New messages from tutors",
            "  - Payment confirmations",
            "  - Course recommendations",
            "  - Promotional offers",
            "Select delivery method:",
            "  - In-app notifications",
            "  - Email",
            "  - SMS (for important alerts)",
            "Save your preferences",
          ],
          tips: [
            "Enable reminders for upcoming classes",
            "Get notified instantly about messages",
            "Review notification settings periodically",
          ],
          link: "/settings/notifications",
        },
        {
          id: "privacy-settings",
          title: "Privacy Settings",
          description: "Control your privacy on the platform",
          content: "Manage who can see your information and activity.",
          steps: [
            "Go to Settings → Privacy",
            "Choose profile visibility:",
            "  - Public (visible to everyone)",
            "  - Tutors only",
            "  - Private",
            "Control what information is visible",
            "Manage who can contact you",
            "Block users if needed",
            "Review data sharing preferences",
            "Download your data",
            "Delete your account (if desired)",
          ],
          tips: [
            "Start with recommended privacy settings",
            "You can always adjust later",
            "Review settings periodically",
          ],
          link: "/settings/privacy",
        },
      ],
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      icon: AlertTriangle,
      description: "Solutions to common problems",
      articles: [
        {
          id: "technical-issues",
          title: "Technical Issues During Class",
          description: "What to do when technology fails",
          content:
            "Don't panic! Here's how to handle common technical problems.",
          steps: [
            "Can't hear audio:",
            "  - Check volume on your device",
            "  - Ensure headphones are connected properly",
            "  - Test audio in BBB settings",
            "  - Leave and rejoin the class",
            "Video not working:",
            "  - Check camera permissions in browser",
            "  - Ensure no other app is using camera",
            "  - Test camera in BBB settings",
            "Connection issues:",
            "  - Check your internet connection",
            "  - Move closer to WiFi router",
            "  - Switch to mobile data if available",
            "  - Close other bandwidth-heavy apps",
            "Can't join class:",
            "  - Ensure you're using the correct link",
            "  - Check that class time has started",
            "  - Try a different browser",
            "  - Clear browser cache and cookies",
          ],
          tips: [
            "Have a backup device ready",
            "Save tutor's contact info for emergencies",
            "Take screenshots of error messages",
            "Report persistent issues to support",
          ],
          link: "/support/technical",
        },
        {
          id: "contact-support",
          title: "Contacting Student Support",
          description: "How to get help when you need it",
          content: "Our support team is here to help with any issues.",
          steps: [
            "First, check if your issue is covered in help articles",
            "Go to Help Center → Contact Support",
            "Choose your issue category",
            "Provide detailed information:",
            "  - Your account email",
            "  - Description of the issue",
            "  - Screenshots if applicable",
            "  - What you've tried already",
            "Submit your request",
            "You'll receive a confirmation email",
            "Support will respond within 24-48 hours",
          ],
          tips: [
            "Provide as much detail as possible",
            "Include relevant screenshots",
            "Check your spam folder for responses",
            "Be patient - complex issues take time",
          ],
          link: "/contact",
        },
      ],
    },
  ];

  const quickLinks = [
    {
      title: "Find a Tutor",
      icon: SearchIcon,
      link: "/find-tutors",
      color: "blue",
    },
    {
      title: "My Learning",
      icon: BookOpen,
      link: "/student/schedule",
      color: "purple",
    },
    {
      title: "Enroll in Course",
      icon: UserPlusIcon,
      link: "/courses",
      color: "emerald",
    },
    {
      title: "Payment History",
      icon: CreditCardIcon,
      link: "/payment-history",
      color: "amber",
    },
    // {
    //   title: "Get Certificate",
    //   icon: Award,
    //   link: "/my-certificates",
    //   color: "red",
    // },
    {
      title: "Contact Support",
      icon: MessageSquare,
      link: "/contact",
      color: "gray",
    },
  ];

  const faqs = [
    {
      question: "How do I find a tutor for my specific subject?",
      answer:
        "Use the search bar on the Find Tutors page. You can filter by subject, level, price, rating, and availability. Read tutor profiles and reviews to find the best match.",
    },
    {
      question: "How much do tutoring sessions cost?",
      answer:
        "Prices vary by tutor, subject, and session length. Each tutor sets their own rates, which are clearly displayed on their profile and course pages. You pay the full session fee upfront when enrolling.",
    },
    {
      question: "What if I need to cancel my enrollment?",
      answer:
        "You can cancel through your My Learning page. Refunds are based on how far in advance you cancel: 90% refund if more than 7 days before start, 50% if 3-7 days before, and no refund if less than 3 days before or after session starts.",
    },
    {
      question: "How do I join my live classes?",
      answer:
        "Go to My Learning, find your session, and click the 'Join Class' button for the scheduled class. The button becomes active 10-15 minutes before class start time.",
    },
    {
      question: "What technical setup do I need?",
      answer:
        "You need a stable internet connection (5 Mbps+), a modern browser (Chrome, Firefox, Edge), a working microphone, and optionally a webcam. Headphones are recommended for better audio quality.",
    },
    {
      question: "Can I get a certificate after completing a course?",
      answer:
        "Many courses offer certificates of completion. Check the course details for certificate availability. You'll need to meet attendance and completion requirements set by the tutor.",
    },
    {
      question: "What if I have technical issues during class?",
      answer:
        "Try refreshing your browser, checking your internet connection, or switching to a different browser. If issues persist, contact support with details of the problem.",
    },
    {
      question: "How do I leave a review for my tutor?",
      answer:
        "After a session ends, go to My Learning, find the completed session, and click 'Leave a Review'. You can rate the tutor and write about your experience.",
    },
  ];

  const filteredSections = helpSections
    .map((section) => ({
      ...section,
      articles: section.articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((section) => section.articles.length > 0 || searchQuery === "");

  return (
    <div className="max-w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Student Help Center
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Everything you need to know about learning on SomoHub
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-8">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            const colorClasses = {
              blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
              purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
              emerald: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
              amber: "bg-amber-50 text-amber-600 hover:bg-amber-100",
              red: "bg-red-50 text-red-600 hover:bg-red-100",
              gray: "bg-gray-50 text-gray-600 hover:bg-gray-100",
            }[link.color];

            return (
              <Link
                key={index}
                href={link.link}
                className={`${colorClasses} p-4 rounded-xl text-center transition-colors group`}
              >
                <Icon className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium">{link.title}</p>
              </Link>
            );
          })}
        </div>

        {/* Category Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "all"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              All Topics
            </button>
            <button
              onClick={() => setActiveTab("finding")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "finding"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Finding Tutors
            </button>
            <button
              onClick={() => setActiveTab("learning")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "learning"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Attending Classes
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "payments"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Payments & Refunds
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "account"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Account Settings
            </button>
          </nav>
        </div>

        {/* Help Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {filteredSections.map((section) => {
              const Icon = section.icon;
              const isExpanded = expandedSection === section.id;

              return (
                <div
                  key={section.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-6 flex items-start justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {section.title}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Articles */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 divide-y divide-gray-200">
                      {section.articles.map((article) => {
                        const isArticleExpanded = expandedArticles.includes(
                          article.id,
                        );

                        return (
                          <div key={article.id} className="p-6">
                            <button
                              onClick={() => toggleArticle(article.id)}
                              className="w-full flex items-start justify-between text-left"
                            >
                              <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                                  {article.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {article.description}
                                </p>
                              </div>
                              <ChevronDown
                                className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-4 ${
                                  isArticleExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </button>

                            {isArticleExpanded && (
                              <div className="mt-4 space-y-4">
                                <p className="text-gray-700">
                                  {article.content}
                                </p>

                                {article.steps && (
                                  <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      Step-by-Step Guide
                                    </h4>
                                    <ol className="list-decimal list-inside space-y-2">
                                      {article.steps.map((step, idx) => (
                                        <li
                                          key={idx}
                                          className="text-gray-700 text-sm"
                                        >
                                          {step}
                                        </li>
                                      ))}
                                    </ol>
                                  </div>
                                )}

                                {article.tips && (
                                  <div className="bg-blue-50 rounded-lg p-4">
                                    <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                                      <Sparkles className="w-4 h-4 text-blue-600" />
                                      Pro Tips
                                    </h4>
                                    <ul className="space-y-2">
                                      {article.tips.map((tip, idx) => (
                                        <li
                                          key={idx}
                                          className="text-blue-800 text-sm flex items-start gap-2"
                                        >
                                          <span>•</span>
                                          <span>{tip}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {article.warning && (
                                  <div className="bg-amber-50 rounded-lg p-4">
                                    <h4 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
                                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                                      Important
                                    </h4>
                                    <p className="text-amber-800 text-sm">
                                      {article.warning}
                                    </p>
                                  </div>
                                )}

                                {article.note && (
                                  <div className="bg-purple-50 rounded-lg p-4">
                                    <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                                      <Info className="w-4 h-4 text-purple-600" />
                                      Note
                                    </h4>
                                    <p className="text-purple-800 text-sm">
                                      {article.note}
                                    </p>
                                  </div>
                                )}

                                {article.example && (
                                  <div className="bg-emerald-50 rounded-lg p-4">
                                    <h4 className="font-medium text-emerald-900 mb-2 flex items-center gap-2">
                                      <Target className="w-4 h-4 text-emerald-600" />
                                      Example
                                    </h4>
                                    <p className="text-emerald-800 text-sm">
                                      {article.example}
                                    </p>
                                  </div>
                                )}

                                {article.link && (
                                  <Link
                                    href={article.link}
                                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                                  >
                                    Go to {article.title}
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                  </Link>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* FAQ */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <HelpIcon className="w-5 h-5 text-blue-600" />
                  Frequently Asked Questions
                </h3>
              </div>
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Tutorials */}
            {/* <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <PlayCircle className="w-5 h-5" />
              Video Tutorials
            </h3>
            <p className="text-sm text-blue-100 mb-4">
              Watch step-by-step video guides for students
            </p>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <PlayCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">
                  How to Find and Enroll in a Course
                </span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <PlayCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Joining Your First Live Class</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <PlayCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">
                  Understanding Payments and Refunds
                </span>
              </button>
            </div>
          </div> */}

            {/* Contact Support */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Need More Help?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Our student support team is here to assist you.
              </p>
              <div className="space-y-3">
                <Link
                  href="/contact"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">Email Support</span>
                </Link>
                {/* <Link
                href="/chat"
                className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium">Live Chat</span>
              </Link>
              <a
                href="tel:+254700000000"
                className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Phone className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">
                  Call Us: +254 700 000 000
                </span>
              </a> */}
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Available Mon-Fri, 8:00 AM - 6:00 PM EAT
              </p>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-600" />
                Quick Tips for Success
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Join classes 5 minutes early to test your audio and video
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Read tutor reviews before enrolling</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Save your payment receipts for reference</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Ask questions during class - that's what tutors are for!
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Leave reviews to help other students</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Still Need Help */}
        <div className="bg-gradient-to-r from-blue-600 to-main rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-lg mb-6 opacity-90 text-white">
            Can't find what you're looking for? Our student support team is
            ready to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact Support
            </Link>
            {/* <Link
            href="/faq"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition-colors"
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            View All FAQs
          </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
