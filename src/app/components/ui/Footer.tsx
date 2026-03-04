// src/app/components/ui/Footer.tsx
import Link from "next/link";
import {
  Heart,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  BookOpen,
  Users,
  HelpCircle,
  Shield,
  FileText,
  Globe,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Award,
  Briefcase,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-100 border-t border-zinc-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 sm:py-20  lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-main rounded-lg flex items-center justify-center">
                <img
                  src="/images/somohub_logo_purplebg.png"
                  alt="SomoHub Logo"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <span className="text-xl font-semibold text-zinc-800">
                SomoHub
              </span>
            </div>
            <p className="text-sm text-zinc-600 mb-4">
              Empowering learners through quality education and expert tutors.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com/somohub"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-zinc-300 rounded-lg flex items-center justify-center hover:bg-zinc-400 transition-colors"
              >
                <Twitter className="w-4 h-4 text-zinc-700" />
              </a>
              <a
                href="https://facebook.com/somohub"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-zinc-300 rounded-lg flex items-center justify-center hover:bg-zinc-400 transition-colors"
              >
                <Facebook className="w-4 h-4 text-zinc-700" />
              </a>
              <a
                href="https://linkedin.com/company/somohub"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-zinc-300 rounded-lg flex items-center justify-center hover:bg-zinc-400 transition-colors"
              >
                <Linkedin className="w-4 h-4 text-zinc-700" />
              </a>
              <a
                href="https://instagram.com/somohub"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-zinc-300 rounded-lg flex items-center justify-center hover:bg-zinc-400 transition-colors"
              >
                <Instagram className="w-4 h-4 text-zinc-700" />
              </a>
            </div>
          </div>

          {/* For Students */}
          <div>
            <h3 className="font-semibold text-zinc-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              For Students
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/sessions"
                  className="text-sm text-zinc-600 hover:text-zinc-900 flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  Browse Sessions
                </Link>
              </li>
              <li>
                <Link
                  href="/tutors"
                  className="text-sm text-zinc-600 hover:text-zinc-900 flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  Find a Tutor
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/communities"
                  className="text-sm text-zinc-600 hover:text-zinc-900 flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  Join Communities
                </Link>
              </li> */}
              <li>
                <Link
                  href="/student"
                  className="text-sm text-zinc-600 hover:text-zinc-900 flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  My Learning
                </Link>
              </li>
            </ul>
          </div>

          {/* For Tutors */}
          <div>
            <h3 className="font-semibold text-zinc-800 mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              For Tutors
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/onboarding/tutor"
                  className="text-sm text-zinc-600 hover:text-zinc-900 flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  Become a Tutor
                </Link>
              </li>
              <li>
                <Link
                  href="/tutor/dashboard"
                  className="text-sm text-zinc-600 hover:text-zinc-900 flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  Tutor Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/tutor/earnings"
                  className="text-sm text-zinc-600 hover:text-zinc-900 flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  Earnings
                </Link>
              </li>
              <li>
                <Link
                  href="/help/tutor"
                  className="text-sm text-zinc-600 hover:text-zinc-900 flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  Tutor Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Communities */}
          {/* <div>
            <h3 className="font-semibold text-zinc-800 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Communities
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/onboarding/community"
                  className="text-sm text-zinc-600 hover:text-zinc-900 flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  Start a Community
                </Link>
              </li>
              <li>
                <Link
                  href="/communities"
                  className="text-sm text-zinc-600 hover:text-zinc-900 flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  Explore Communities
                </Link>
              </li>
              <li>
                <Link
                  href="/community/guidelines"
                  className="text-sm text-zinc-600 hover:text-zinc-900 flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/community/success-stories"
                  className="text-sm text-zinc-600 hover:text-zinc-900 flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  Success Stories
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Support */}
          <div>
            <h3 className="font-semibold text-zinc-800 mb-4 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help/student"
                  className="text-sm text-zinc-600 hover:text-zinc-900 flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  Student Help
                </Link>
              </li>
              <li>
                <Link
                  href="/help/tutor"
                  className="text-sm text-zinc-600 hover:text-zinc-900 flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  Tutor Help
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/faq"
                  className="text-sm text-zinc-600 hover:text-zinc-900 flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  FAQ
                </Link>
              </li> */}
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-zinc-600 hover:text-zinc-900 flex items-center gap-1 group"
                >
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-t border-zinc-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-300 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-zinc-700" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Email</p>
              <a
                href="mailto:support@somohub.com"
                className="text-sm text-zinc-700 hover:text-zinc-900"
              >
                support@somohub.com
              </a>
            </div>
          </div>
          {/* <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-300 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-zinc-700" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Phone</p>
              <a
                href="tel:+254700000000"
                className="text-sm text-zinc-700 hover:text-zinc-900"
              >
                +254 700 000 000
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-300 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-zinc-700" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Location</p>
              <p className="text-sm text-zinc-700">Nairobi, Kenya</p>
            </div>
          </div> */}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-zinc-300">
          <p className="text-xs text-zinc-600">
            © {currentYear} SomoHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-xs text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
            >
              <FileText className="w-3 h-3" />
              Terms
            </Link>
            {/* <Link
              href="/cookies"
              className="text-xs text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
            >
              <Globe className="w-3 h-3" />
              Cookies
            </Link>
            <span className="flex items-center gap-1 text-xs text-zinc-600">
              <Heart className="w-3 h-3 text-red-500" />
              Made with love in Kenya
            </span> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
