// src/app/tutor/help/page.tsx
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
}

export default function TutorHelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "getting-started",
  );
  const [expandedArticles, setExpandedArticles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<
    "all" | "tutor" | "community" | "student"
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
      title: "Getting Started as a Tutor",
      icon: Rocket,
      description: "Everything you need to know to begin your tutoring journey",
      articles: [
        {
          id: "tutor-application",
          title: "Tutor Application Process",
          description: "How to apply and become an approved tutor",
          content:
            "The tutor application process involves 4 steps to verify your qualifications and identity.",
          steps: [
            "Navigate to the 'Become a Tutor' section from your dashboard",
            "Step 1: Select your tutor level (College Student, Junior High Teacher, Senior High Teacher, Skilled Professional, University Lecturer, Private Tutor)",
            "Step 2: Provide your personal information and upload National ID photos (front and back)",
            "Step 3: Add your education details (highest education level: high school, diploma, bachelor's, master's, PhD) and upload relevant certificates",
            "Step 4: Document your teaching experience (years of experience, previous institutions)",
            "Pay the application fee (KES 1,160) to complete your submission",
            "Wait for admin approval (usually within 24-48 hours)",
          ],
          tips: [
            "Ensure all documents are clear and legible (accepted formats: JPG, PNG, PDF)",
            "Have your TSC number ready if you're a certified teacher",
            "Prepare your portfolio URL if you're a skilled professional or university lecturer",
            "Your admission letter is required for higher education levels (diploma, bachelor's, master's, PhD)",
            "National ID photos are mandatory for identity verification",
          ],
          warning:
            "Make sure all information matches your official documents exactly as they appear.",
          link: "/onboarding/tutors",
        },
        {
          id: "profile-setup",
          title: "Completing Your Tutor Profile",
          description: "Set up your profile to attract more students",
          content:
            "A complete profile helps students trust your expertise and choose your courses.",
          steps: [
            "Add a professional profile picture",
            "Write a compelling bio highlighting your teaching style",
            "Set your headline (e.g., 'Experienced Mathematics Teacher')",
            "Add your languages and proficiency levels",
            "List your subjects and teaching levels (primary, junior high, senior high, university, adult)",
            "Upload your certificates and qualifications",
            "Set your hourly rate (e.g., KES 1,500 per hour)",
            "Configure your availability schedule",
          ],
          tips: [
            "Use a clear, professional photo",
            "Highlight your teaching experience and successes",
            "Be specific about what students will learn",
            "Update your availability regularly",
            "Higher completion rates lead to better visibility in search results",
          ],
          link: "/tutor/profile",
        },
      ],
    },
    {
      id: "courses",
      title: "Creating & Managing Courses",
      icon: BookOpen,
      description: "Learn how to create engaging courses that students love",
      articles: [
        {
          id: "create-course",
          title: "How to Create a New Course",
          description: "Step-by-step guide to creating your first course",
          content:
            "Courses are the foundation of your tutoring business. Here's how to create one.",
          steps: [
            "Go to Tutor Dashboard → Courses → Create New Course",
            "Enter course title (e.g., 'Mathematics for High School')",
            "Write a detailed description of what students will learn",
            "Select subject (e.g., Mathematics, Physics, Computer Studies) and level (primary, junior high, senior high, university, adult)",
            "Set course duration: total weeks and classes per week",
            "Choose class duration (60, 90, or 120 minutes)",
            "Select teaching mode: virtual, in-person, or hybrid",
            "Set maximum students per session",
            "Define total price and currency (KES, USD)",
            "Add prerequisites and learning outcomes",
            "Create curriculum with weekly topics",
            "Upload thumbnail and syllabus (optional)",
            "Save as draft or publish immediately (You can only add tuition/sessions for courses you have published)",
          ],
          tips: [
            "Use descriptive titles that include the subject and level",
            "Break down curriculum into manageable weekly topics",
            "Include specific learning outcomes to attract students",
            "Set competitive prices based on market rates (KES 2,000 - 8,000 for 4-8 week courses)",
          ],
          warning:
            "Courses may require admin approval before they can be published, especially for new tutors.",
          example:
            "August Grade 4 Mathematics - 4 weeks, 2 class/week, 90 min classes, KES 8,000",
          link: "/tutor/courses/create",
        },
        {
          id: "manage-courses",
          title: "Managing Your Courses",
          description: "Edit, update, and organize your course offerings",
          content:
            "Keep your courses up-to-date and organized. Course status can be: draft, published, enrolling, ongoing, completed, cancelled.",
          steps: [
            "View all courses from the Courses dashboard",
            "Filter by status: Draft, Published, Enrolling, Ongoing, Completed",
            "Click on any course to edit details",
            "Update curriculum, pricing, or description",
            "Publish draft courses when ready",
            "Archive completed or outdated courses",
          ],
          tips: [
            "Regularly update course content based on student feedback",
            "Monitor enrollment numbers to adjust pricing",
            "Use analytics to see which courses perform best",
            "Published courses appear in student search results",
          ],
          link: "/tutor/courses",
        },
      ],
    },
    {
      id: "sessions",
      title: "Sessions & Scheduling",
      icon: Calendar,
      description:
        "Master the art of scheduling and managing teaching sessions",
      articles: [
        {
          id: "create-session",
          title: "Creating a New Session",
          description: "How to schedule sessions for your courses",
          content:
            "Sessions are specific instances of your courses with fixed dates and times.",
          steps: [
            "Go to a course and click 'Create Session'",
            "Name your session (e.g., 'April Grade 4 Maths')",
            "Add description and batch name (optional)",
            "Choose session type: one-on-one or group",
            "Set maximum number of students (group sessions) or 1 for one-on-one",
            "Define start date and end date",
            "Set session fee (can be different from course price)",
            "Add schedule configurations:",
            "  - Select days of the week",
            "  - Set start and end times (e.g., 09:00 - 10:30)",
            "  - Duration is auto-calculated",
            "System generates unique session code automatically",
            "Review and create the session",
          ],
          tips: [
            "Create sessions in batches for different terms (Jan-April, May-August, Sept-Dec)",
            "Consider time zones when scheduling",
            "Leave buffer time between sessions",
            "Use batch names to organize different intakes",
          ],
          note: "Sessions automatically generate individual classes based on your schedule configuration",
          example:
            "A 4-week session with Monday and Wednesday at 9 AM creates 8 individual classes (2 per week × 4 weeks)",
          link: "/tutor/sessions/create",
        },
        {
          id: "session-schedules",
          title: "Understanding Session Schedules",
          description:
            "How the scheduling system automatically generates classes",
          content:
            "The scheduling system automatically generates individual classes based on your configuration. Each class gets its own meeting link.",
          steps: [
            "When creating a session, add schedule configurations",
            "For each configuration, select:",
            "  - Day of week (Sunday, Monday, Tuesday, etc.)",
            "  - Start time (e.g., 09:00 AM)",
            "  - End time (e.g., 10:30 AM)",
            "System calculates duration automatically",
            "All classes for the entire session are generated",
            "Each class gets:",
            "  - Week number and class number",
            "  - Specific date calculated from start date",
            "  - Meeting link for you (moderator)",
            "  - Student meeting link for learners",
            "  - Meeting ID and passcode",
            "Classes appear in your upcoming sessions list",
            "Students can join each class at its scheduled time",
          ],
          tips: [
            "You can add multiple schedule configurations (e.g., Monday 9 AM and Wednesday 2 PM)",
            "Ensure end time is after start time",
            "Consider class duration when planning content",
            "Check the generated classes to verify correct dates",
          ],
          example:
            "Session with 5 weeks, schedule: Monday 9-10:30 AM → generates 5 classes (one per week)",
          link: "/tutor/sessions",
        },
        {
          id: "join-session",
          title: "Joining a Live Session",
          description: "How to start and conduct your online classes",
          content:
            "All virtual sessions use BigBlueButton (BBB) for reliable video conferencing.",
          steps: [
            "From dashboard, view your upcoming sessions",
            "For sessions marked 'Today', click 'Join Now'",
            "You'll be taken to the BBB meeting room via your moderator link",
            "As moderator, you'll have controls to:",
            "  - Mute/unmute participants",
            "  - Share your screen",
            "  - Use the whiteboard",
            "  - Create breakout rooms",
            "  - Record the session",
            "Share the student meeting link with enrolled students",
            "Start recording for students who can't attend",
            "After session, recordings may be available for sharing",
          ],
          tips: [
            "Join 5-10 minutes early to test your audio/video",
            "Have your materials ready before starting",
            "Encourage students to use their cameras",
            "Use the chat for questions and engagement",
          ],
          warning:
            "Only enrolled students can join sessions. Never share moderator passwords or moderator links.",
          example:
            "BBB Meeting with ID, moderator password, and attendee password",
          video: "https://example.com/bbb-tutorial",
        },
        {
          id: "session-status",
          title: "Session Status and Management",
          description: "Understanding different session statuses",
          content:
            "Sessions and individual classes can have different statuses to track their progress.",
          steps: [
            "Session status can be: scheduled, ongoing, completed, cancelled",
            "Class status can be: scheduled, ongoing, completed, cancelled, rescheduled",
            "Enrollment status can be: open, waiting list, closed, completed",
            "Monitor current enrollment against maximum students",
            "Mark attendance for each class",
            "Update session status as it progresses",
            "Cancel or reschedule if needed",
          ],
          tips: [
            "Regularly check upcoming sessions",
            "Update status promptly after classes",
            "Track attendance to identify issues",
          ],
          link: "/tutor/sessions",
        },
      ],
    },
    {
      id: "enrollments",
      title: "Managing Enrollments",
      icon: Users,
      description: "Handle student enrollments, payments, and attendance",
      articles: [
        {
          id: "view-enrollments",
          title: "Viewing and Managing Enrollments",
          description: "Track all students enrolled in your sessions",
          content:
            "The enrollments page gives you complete visibility of all students.",
          steps: [
            "Go to Tutor Dashboard → Enrollments",
            "View all enrollments across your sessions",
            "Filter by enrollment status: pending, active, completed, dropped, suspended",
            "Filter by payment status: pending, paid, partial, refunded",
            "Click on any enrollment for detailed view",
            "See student information and contact details",
            "View payment history and attendance records",
            "Track progress percentage and classes attended",
          ],
          tips: [
            "Regularly check pending enrollments",
            "Contact students with incomplete payments",
            "Track attendance to identify at-risk students",
            "Update enrollment status as students progress",
          ],
          example:
            "Student enrolled with status: active, payment: paid, progress: 25%",
          link: "/tutor/enrollments",
        },
        {
          id: "manage-payments",
          title: "Managing Student Payments",
          description: "Record and track payments from students",
          content:
            "Students pay the full session fee upfront at enrollment. Keep accurate records of all payments received.",
          steps: [
            "From enrollment detail page, view payment status",
            "Record new payments with:",
            "  - Amount received (full session fee)",
            "  - Payment reference number",
            "  - Notes (optional)",
            "System updates payment status automatically",
            "View complete payment history",
            "Send payment reminders for pending payments",
            "Payment types: tutor onboarding, session enrollment, community membership, course purchase",
          ],
          tips: [
            "Always record payment references for tracking",
            "Issue receipts for all payments",
            "Follow up on partial payments promptly",
            "Payment status can be: pending, paid, partial, refunded",
          ],
          note: "Remember: Students pay the full session fee upfront, but you'll receive weekly payments after teaching each week's classes.",
          link: "/tutor/enrollments",
        },
        {
          id: "attendance",
          title: "Taking Attendance",
          description: "Mark attendance for your classes",
          content:
            "Track which students attend each class. Attendance is important for tracking progress and ensuring you get paid for completed weeks.",
          steps: [
            "After each class, go to the session page",
            "Find the class in the schedule",
            "Click 'Take Attendance'",
            "Mark each student as present or absent",
            "Classes attended count updates automatically",
            "Add notes if needed (e.g., 'Joined late')",
            "Save attendance records",
            "View attendance history in student profiles",
            "Progress percentage is calculated based on attendance",
          ],
          tips: [
            "Take attendance during or immediately after class",
            "Note students who consistently miss class",
            "Use attendance data to identify engagement issues",
            "Track total classes vs classes attended",
            "Attendance helps verify you've completed your weekly classes for payment",
          ],
          link: "/tutor/sessions",
        },
      ],
    },
    {
      id: "community",
      title: "Community Features",
      icon: Users,
      description: "Engage with communities and create community courses",
      articles: [
        {
          id: "join-community",
          title: "Joining Communities",
          description: "How to find and join relevant communities",
          content:
            "Communities are groups of educators, alumni, or professionals sharing resources.",
          steps: [
            "Browse available communities from the Communities page",
            "Filter by category: Primary School, High School, College/University, NGO/Non-Profit, Private Tutor Group, Study Group, Professional Association, Other",
            "Click on a community to view details",
            "Check member count and description",
            "Request to join (if approval required)",
            "Wait for admin approval",
            "Once approved, you become a member with a role (member, moderator, admin, or tutor)",
            "Participate in discussions and share materials",
          ],
          tips: [
            "Join communities relevant to your subjects",
            "Engage actively to build your network",
            "Share resources and learn from peers",
          ],
          example: "Starehe High School Alumni community with 125 members",
          link: "/communities",
        },
        {
          id: "create-community-course",
          title: "Creating Community Courses",
          description: "Offer courses within communities",
          content:
            "Approved community members can create courses for community members.",
          steps: [
            "Go to your community page",
            "Navigate to Courses section",
            "Click 'Create Community Course'",
            "Fill in course details similar to tutor courses",
            "Set subject category and level (beginner, intermediate, advanced, all)",
            "Define total hours, total weeks, classes per week",
            "Set maximum students",
            "Create curriculum with weekly topics",
            "Publish for community members only",
            "Create sessions for your community course",
            "Manage enrollments within the community",
          ],
          tips: [
            "Tailor content to community needs",
            "Offer discounts for community members",
            "Collaborate with other community tutors",
          ],
          example:
            "KCSE Mathematics Revision Course with 12 weeks, 2 classes per week",
          link: "/communities/my",
        },
      ],
    },
    {
      id: "earnings",
      title: "Earnings & Payouts",
      icon: DollarSign,
      description: "Track your earnings and understand how tutor payments work",
      articles: [
        {
          id: "how-payments-work",
          title: "How Tutor Payments Work",
          description: "Understanding the payment schedule and calculation",
          content:
            "Students pay the full session fee upfront, but tutor payments are released weekly after classes are completed. This ensures quality delivery and protects both parties.",
          steps: [
            "Student pays full session fee at enrollment",
            "Funds are held securely by SomoHub",
            "Each week after you complete your classes, your earnings for that week are calculated",
            "Weekly earnings are added to your available balance",
            "You can withdraw accumulated earnings anytime after they're available",
          ],
          tips: [
            "Weekly payments are calculated based on the proportion of the total session cost",
            "Example: For a 4-week session costing KES 8,000, you earn KES 2,000 per week after completing that week's classes",
            "Track your weekly earnings to forecast your income",
            "Complete all scheduled classes to ensure full payment",
          ],
          example:
            "4-week session at KES 8,000 total → KES 2,000 released after each completed week",
          note: "Payments are only released for weeks where you've completed all scheduled classes. Partial weeks are pro-rated.",
          link: "/tutor/earnings",
        },
        {
          id: "view-earnings",
          title: "Understanding Your Earnings Dashboard",
          description: "Track all your income from teaching",
          content:
            "The earnings dashboard shows your complete financial picture, including pending and available funds.",
          steps: [
            "Go to Tutor Dashboard → Earnings",
            "View total lifetime earnings from all paid enrollments",
            "See pending balance (earnings from current in-progress sessions)",
            "Check available balance (funds ready for withdrawal)",
            "View weekly breakdown of earnings per session",
            "Filter earnings by date range or specific course",
            "See payment history and transaction details",
            "Download earnings reports for your records",
          ],
          tips: [
            "Review earnings weekly to track your income",
            "Save reports for tax purposes",
            "Monitor which courses generate the most revenue",
            "Check pending balance to see what's coming",
          ],
          link: "/tutor/earnings",
        },
        {
          id: "payment-calculation",
          title: "How Weekly Payments Are Calculated",
          description: "Detailed breakdown of payment calculations",
          content:
            "Your weekly payment is calculated based on the proportion of the total session fee relative to the session duration.",
          steps: [
            "Total session fee is divided by number of weeks in the session",
            "After completing all classes in a week, that week's amount is released",
            "If a session has multiple classes per week, all must be completed for full weekly payment",
            "Partial weeks (start or end of session) are pro-rated based on number of classes",
          ],
          examples: [
            "4-week session at KES 8,000 = KES 2,000 per week",
            "8-week session at KES 12,000 = KES 1,500 per week",
            "6-week session at KES 9,000 = KES 1,500 per week",
            "12-week session at KES 18,000 = KES 1,500 per week",
          ],
          note: "You don't need to wait until the session ends to get paid. Funds are released weekly as you teach, providing steady cash flow throughout the session.",
          link: "/tutor/earnings",
        },
        {
          id: "withdraw-funds",
          title: "Withdrawing Your Earnings",
          description: "How to request payouts",
          content:
            "Transfer your available earnings to your bank account or mobile money whenever you want.",
          steps: [
            "Ensure you have sufficient available balance (minimum KES 500)",
            "Go to Earnings → Withdraw Funds",
            "Select withdrawal method (set up in advance):",
            "  - Bank transfer (1-3 business days)",
            "  - Mobile money (M-Pesa, within 24 hours)",
            "  - PayPal (for international tutors)",
            "Enter amount to withdraw (must be at least minimum)",
            "Confirm withdrawal details",
            "Track withdrawal status:",
            "  - Pending: Request received",
            "  - Processing: Being processed",
            "  - Completed: Funds sent",
            "  - Failed: Issue with transfer",
            "  - Cancelled: Request cancelled",
            "Receive notification when processed",
          ],
          tips: [
            "Set up withdrawal methods in advance in your payment settings",
            "Minimum withdrawal amount: KES 500",
            "Withdraw regularly to manage cash flow",
            "Bank transfers typically take 1-3 business days",
            "Mobile money (M-Pesa) usually arrives within 24 hours",
            "Keep your contact information updated for payment notifications",
          ],
          warning:
            "Ensure your bank details or mobile money number are 100% correct to avoid delays or failed transfers. Double-check before confirming.",
          link: "/tutor/earnings/withdraw",
        },
      ],
    },
    {
      id: "materials",
      title: "Teaching Materials",
      icon: FileText,
      description: "Upload and manage your teaching resources",
      articles: [
        {
          id: "upload-materials",
          title: "Uploading Course Materials",
          description: "Share resources with your students",
          content:
            "Provide additional learning materials to enhance your courses.",
          steps: [
            "Go to Materials section",
            "Click 'Upload New Material'",
            "Select file (PDF, video, presentation, etc.)",
            "File is uploaded to the server",
            "Add title and description",
            "Set document type: national ID, certificate, admission letter, TSC certificate, experience letter, community verification",
            "Link to specific course or session",
            "Set visibility (all students or specific session)",
            "Upload and organize in folders",
            "Share with enrolled students",
            "Track verification status: pending, verified, rejected",
          ],
          tips: [
            "Organize materials by course and week",
            "Include practice exercises and solutions",
            "Add video recordings of past sessions",
            "Use descriptive file names",
            "Keep file sizes reasonable for students to download",
          ],
          link: "/tutor/materials",
        },
      ],
    },
    {
      id: "profile",
      title: "Profile & Settings",
      icon: Settings,
      description: "Manage your tutor profile and account settings",
      articles: [
        {
          id: "edit-profile",
          title: "Editing Your Tutor Profile",
          description: "Keep your profile information up to date",
          content:
            "Your profile is the first thing students see. Keep it professional.",
          steps: [
            "Go to Profile Settings",
            "Update personal information (first name, last name, phone, date of birth, country, city)",
            "Change profile picture",
            "Edit bio and headline",
            "Add or remove subjects",
            "Update hourly rate and currency",
            "Add languages and proficiency levels",
            "Update education and certifications",
            "Set timezone",
            "Save changes",
          ],
          tips: [
            "Update your bio regularly with recent successes",
            "Add new certifications as you earn them",
            "Keep your availability schedule current",
            "Profile completion affects visibility in searches",
          ],
          link: "/tutor/profile",
        },
        {
          id: "notifications",
          title: "Managing Notifications",
          description: "Control how you receive alerts",
          content: "Stay informed without being overwhelmed.",
          steps: [
            "Go to Settings → Notifications",
            "Choose which events trigger notifications:",
            "  - Application updates (tutor/community applications)",
            "  - Payments received",
            "  - Upcoming sessions",
            "  - New enrollments",
            "  - Community activities",
            "  - Tutor-specific updates",
            "  - System announcements",
            "  - Promotional messages",
            "Select delivery method per notification type:",
            "  - In-app notifications",
            "  - Email alerts",
            "  - Push notifications",
            "Set priority levels",
            "Save your preferences",
          ],
          tips: [
            "Enable reminders for upcoming sessions",
            "Get notified immediately for new payments",
            "Review notification settings periodically",
          ],
          link: "/settings/notifications",
        },
        {
          id: "audit-logs",
          title: "Activity and Audit Logs",
          description: "Track your account activity",
          content:
            "All important actions are logged for security and record-keeping.",
          steps: [
            "View your activity history",
            "See login events and timestamps",
            "Track application submissions and status changes",
            "Monitor session activity and attendance",
            "Review enrollment actions",
            "Each log includes: action type, IP address, timestamp, and additional context",
          ],
          tips: [
            "Regularly review your login history",
            "Report any suspicious activity",
            "Audit logs help with troubleshooting",
          ],
          example:
            "Tutor application approved notification with application details",
          link: "/tutor/activity",
        },
      ],
    },
  ];

  const quickLinks = [
    {
      title: "Create a Course",
      icon: BookOpen,
      link: "/tutor/courses/create",
      color: "blue",
    },
    {
      title: "Schedule a Session",
      icon: Calendar,
      link: "/tutor/sessions/create",
      color: "purple",
    },
    {
      title: "View Enrollments",
      icon: Users,
      link: "/tutor/enrollments",
      color: "emerald",
    },
    {
      title: "Check Earnings",
      icon: DollarSign,
      link: "/tutor/earnings",
      color: "amber",
    },
    // {
    //   title: "Upload Materials",
    //   icon: FileText,
    //   link: "/tutor/materials",
    //   color: "red",
    // },
    {
      title: "Edit Profile",
      icon: User,
      link: "/tutor/profile",
      color: "gray",
    },
  ];

  const faqs = [
    {
      question: "How long does tutor application approval take?",
      answer:
        "Applications are typically reviewed within 24-48 hours. You'll receive a notification once your application is approved.",
    },
    {
      question: "What tutor levels are available?",
      answer:
        "Available levels: College Student, Junior High Teacher, Senior High Teacher, Skilled Professional, University Lecturer, Private Tutor. Each level has different document requirements.",
    },
    {
      question: "How do students join my sessions?",
      answer:
        "Enrolled students receive a unique student meeting link for each class. They can access it from their learning dashboard.",
    },
    {
      question: "How and when do I get paid?",
      answer:
        "Students pay the full session fee upfront, but you receive payments weekly. After you complete each week's classes, your earnings for that week are released to your available balance. You can then withdraw funds via bank transfer or M-Pesa anytime (minimum KES 500).",
    },
    {
      question: "How is my weekly payment calculated?",
      answer:
        "Your weekly payment is the total session fee divided by the number of weeks. For example, a 4-week session at KES 8,000 pays KES 2,000 per week after you complete that week's classes. Partial weeks at the start or end of a session are pro-rated based on the number of classes.",
    },
    {
      question: "Do I have to wait until the session ends to get paid?",
      answer:
        "No! Unlike students who pay upfront, you get paid weekly as you teach. After completing each week's classes, that week's portion of the fee is released to your available balance. This gives you steady cash flow throughout the session.",
    },
    {
      question: "What happens if a student misses a class?",
      answer:
        "As long as you conducted the class as scheduled, you still get paid for that week. The payment is for delivering the class, regardless of individual student attendance. Make sure to mark attendance to track participation.",
    },
    {
      question: "What if I need to cancel a class?",
      answer:
        "If you cancel a class, that week's payment may be adjusted. It's best to reschedule rather than cancel to ensure you receive full weekly payment. Communicate with your students and admin if issues arise.",
    },
    // {
    //   question: "Can I teach in multiple communities?",
    //   answer:
    //     "Yes, you can join multiple communities and create courses for each one if you're an approved member. Your memberships are tracked with appropriate roles.",
    // },
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 ">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
            Tutor Help Center
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Everything you need to know about tutoring on SomoHub
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

        {/* Role Tabs */}
        <div className="border-b border-gray-200">
          {/* <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("all")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "all"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              All Topics
            </button>
            <button
              onClick={() => setActiveTab("tutor")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "tutor"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Tutor Guides
            </button>
            <button
              onClick={() => setActiveTab("community")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "community"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Community
            </button>
            <button
              onClick={() => setActiveTab("student")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "student"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              For Students
            </button>
          </nav> */}
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

                                {article.examples &&
                                  article.examples.length > 0 && (
                                    <div className="bg-emerald-50 rounded-lg p-4">
                                      <h4 className="font-medium text-emerald-900 mb-3 flex items-center gap-2">
                                        <Target className="w-4 h-4 text-emerald-600" />
                                        Examples
                                      </h4>
                                      <ul className="space-y-2">
                                        {article.examples.map((ex, idx) => (
                                          <li
                                            key={idx}
                                            className="text-emerald-800 text-sm"
                                          >
                                            • {ex}
                                          </li>
                                        ))}
                                      </ul>
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
              <div className="divide-y divide-gray-200">
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
            {/* <div className="bg-gradient-to-br from-blue-300 to-indigo-00 rounded-xl p-6 text-zinc-700">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <PlayCircle className="w-5 h-5" />
                Video Tutorials
              </h3>
              <p className="text-sm text-zinc-600 mb-4">
                Watch step-by-step video guides for common tasks
              </p>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-blue-700/10 rounded-lg hover:bg-blue-500/10 transition-colors cursor-pointer">
                  <PlayCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">
                    How to Create Your First Course
                  </span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-blue-700/10 rounded-lg hover:bg-blue-500/10 transition-colors cursor-pointer">
                  <PlayCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Scheduling Sessions with BBB</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-blue-700/10 rounded-lg hover:bg-blue-500/10 transition-colors cursor-pointer">
                  <PlayCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Understanding Your Earnings</span>
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
                Our support team is here to assist you with any questions.
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

            {/* Resources */}
            {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Useful Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/tutor/handbook.pdf"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                  >
                    <Download className="w-4 h-4" />
                    Tutor Handbook (PDF)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tutor/templates"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                  >
                    <FileText className="w-4 h-4" />
                    Lesson Plan Templates
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community/forum"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                  >
                    <Users className="w-4 h-4" />
                    Tutor Forum
                  </Link>
                </li>
                <li>
                  <Link
                    href="/webinars"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                  >
                    <Video className="w-4 h-4" />
                    Upcoming Webinars
                  </Link>
                </li>
              </ul>
            </div> */}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="bg-gradient-to-r from-blue-700/10 to-blue-500/10 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-semibold text-zinc-700 mb-4">
            Still Need Help?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Can't find what you're looking for? Our support team is ready to
            assist you.
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
              href="/community/forum"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition-colors"
            >
              <Users className="w-5 h-5 mr-2" />
              Ask the Community
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
