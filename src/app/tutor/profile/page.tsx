// src/app/tutor/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Globe,
  BookOpen,
  GraduationCap,
  Briefcase,
  DollarSign,
  Star,
  Users,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  Camera,
  Upload,
  Download,
  Edit,
  Save,
  X,
  ChevronRight,
  Plus,
  Trash2,
  Loader2,
  Languages,
  Flag,
  UserCircle,
  FileText,
  Image as ImageIcon,
  Shield,
  Lock,
  Bell,
  Settings,
  LogOut,
  HelpCircle,
  Info,
  Verified,
  Sparkles,
  TrendingUp,
  CalendarDays,
  Activity,
  Target,
  Zap,
  Crown,
  Medal,
  Trophy,
  BadgeCheck,
  Building,
  School,
  University,
  Heart,
  Share2,
  MoreHorizontal,
  ArrowLeft,
} from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";
import tutorApi from "@/lib/api/tutor";
import userApi from "@/lib/api/user";
import { tutorProfileApi, useTutorProfile } from "@/lib/api/tutor-profile";
import { uploadAvatar } from "@/lib/api/tutor";
import {
  ProfileData as ApiProfileData,
  Document as ApiDocument,
} from "@/types/tutor-profile.types";
import ProtectedRoute from "@/components/ProtectedRoute";

interface ProfileData {
  // Basic Info
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  avatar_url: string | null;

  // Location & Language
  country: string;
  city: string;
  languages: string[];

  // Professional Info
  bio: string;
  headline: string;
  subjects: string[];

  // Education & Experience
  education: Array<{
    id?: number;
    institution: string;
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date: string;
    current: boolean;
    description?: string;
  }>;

  experience: Array<{
    id?: number;
    company: string;
    position: string;
    start_date: string;
    end_date: string;
    current: boolean;
    description?: string;
  }>;

  certifications: Array<{
    id?: number;
    name: string;
    issuing_organization: string;
    issue_date: string;
    expiration_date?: string;
    credential_id?: string;
    credential_url?: string;
  }>;

  // Verification Status
  verification: {
    email_verified: boolean;
    phone_verified: boolean;
    identity_verified: boolean;
    documents_verified: boolean;
  };
}

interface Document {
  id: number;
  name: string;
  type: string;
  url: string;
  verified: boolean;
  uploaded_at: string;
}

export default function TutorProfile() {
  const router = useRouter();
  const { user, userStatus, refreshUserData } = useAuth();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const [formData, setFormData] = useState<ProfileData | null>(null);

  // New state for tag inputs
  const [newLanguage, setNewLanguage] = useState("");
  const [newSubject, setNewSubject] = useState("");

  // New state for certification editing
  const [newCertification, setNewCertification] = useState({
    name: "",
    issuing_organization: "",
    issue_date: "",
    expiration_date: "",
    credential_id: "",
    credential_url: "",
  });

  // New state for document upload
  const [uploadingDoc, setUploadingDoc] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      // Fetch tutor profile from API
      const profileResponse = await tutorApi.getTutorProfile();
      const userStatusResponse = await userApi.getUserStatus();

      if (profileResponse.success) {
        const data = profileResponse.data;

        // Transform API data to match our interface
        const profileData: ProfileData = {
          first_name: data.first_name || user?.first_name || "",
          last_name: data.last_name || user?.last_name || "",
          email: user?.email || "",
          phone: data.phone || user?.phone || "",
          date_of_birth: data.date_of_birth || "",
          avatar_url: data.avatar_url || user?.avatar_url || null,

          country: data.country || "",
          city: data.city || "",
          languages: Array.isArray(data.languages)
            ? data.languages
            : data.languages
              ? [data.languages]
              : ["English"],

          bio: data.bio || "",
          headline: data.headline || "",
          subjects: Array.isArray(data.subjects)
            ? data.subjects
            : data.subjects
              ? [data.subjects]
              : [],

          education: data.education || [],
          experience: data.experience || [],
          certifications: data.certifications || [],

          verification: data.verification || {
            email_verified: user?.is_verified || false,
            phone_verified: false,
            identity_verified: false,
            documents_verified: false,
          },
        };

        setProfile(profileData);
        setFormData(profileData);

        // Fetch documents from the database
        await fetchDocuments();

        // Calculate profile completion
        calculateCompletion(profileData);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      // Fetch documents from the API
      const response = await tutorProfileApi.getDocuments();
      if (response.success) {
        setDocuments(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      // Don't show error toast as this is secondary data
    }
  };

  const calculateCompletion = (data: ProfileData) => {
    const requiredFields = [
      { field: "first_name", weight: 15 },
      { field: "last_name", weight: 15 },
      { field: "phone", weight: 15 },
      { field: "country", weight: 10 },
      { field: "city", weight: 5 },
      { field: "languages", weight: 10 },
      { field: "bio", weight: 15 },
      { field: "headline", weight: 5 },
      { field: "subjects", weight: 15 },
      { field: "education", weight: 15 },
      { field: "experience", weight: 15 },
      { field: "avatar_url", weight: 10 },
    ];

    let completion = 0;
    const missing: string[] = [];

    requiredFields.forEach(({ field, weight }) => {
      const value = data[field as keyof ProfileData];

      if (
        field === "languages" ||
        field === "subjects" ||
        field === "education" ||
        field === "experience"
      ) {
        if (Array.isArray(value) && value.length > 0) {
          completion += weight;
        } else {
          missing.push(field.replace("_", " "));
        }
      } else if (field === "avatar_url") {
        if (value) {
          completion += weight;
        } else {
          missing.push("profile picture");
        }
      } else if (value && String(value).trim() !== "") {
        completion += weight;
      } else {
        missing.push(field.replace("_", " "));
      }
    });

    // Add verification bonuses
    if (data.verification?.phone_verified) {
      completion += 5;
    } else {
      missing.push("phone verification");
    }

    if (data.verification?.email_verified) {
      completion += 5;
    }

    // Add documents verification bonus
    if (documents.some((doc) => doc.verified)) {
      completion += 5;
    } else {
      missing.push("verified documents");
    }

    setProfileCompletion(Math.min(completion, 100));
    setMissingFields(missing);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // Language handlers
  const handleAddLanguage = () => {
    if (newLanguage.trim()) {
      setFormData((prev) => {
        if (!prev) return null;
        const currentLanguages = prev.languages || [];
        if (!currentLanguages.includes(newLanguage.trim())) {
          return {
            ...prev,
            languages: [...currentLanguages, newLanguage.trim()],
          };
        }
        return prev;
      });
      setNewLanguage("");
    }
  };

  const handleRemoveLanguage = (index: number) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updated = prev.languages.filter((_, i) => i !== index);
      return { ...prev, languages: updated };
    });
  };

  // Subject handlers
  const handleAddSubject = () => {
    if (newSubject.trim()) {
      setFormData((prev) => {
        if (!prev) return null;
        const currentSubjects = prev.subjects || [];
        if (!currentSubjects.includes(newSubject.trim())) {
          return {
            ...prev,
            subjects: [...currentSubjects, newSubject.trim()],
          };
        }
        return prev;
      });
      setNewSubject("");
    }
  };

  const handleRemoveSubject = (index: number) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updated = prev.subjects.filter((_, i) => i !== index);
      return { ...prev, subjects: updated };
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: "language" | "subject",
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (type === "language") {
        handleAddLanguage();
      } else {
        handleAddSubject();
      }
    }
  };

  // Education handlers
  const handleAddEducation = () => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            education: [
              ...prev.education,
              {
                institution: "",
                degree: "",
                field_of_study: "",
                start_date: "",
                end_date: "",
                current: false,
              },
            ],
          }
        : null,
    );
  };

  const handleUpdateEducation = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const handleRemoveEducation = (index: number) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updated = prev.education.filter((_, i) => i !== index);
      return { ...prev, education: updated };
    });
  };

  // Experience handlers
  const handleAddExperience = () => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            experience: [
              ...prev.experience,
              {
                company: "",
                position: "",
                start_date: "",
                end_date: "",
                current: false,
              },
            ],
          }
        : null,
    );
  };

  const handleUpdateExperience = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  const handleRemoveExperience = (index: number) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updated = prev.experience.filter((_, i) => i !== index);
      return { ...prev, experience: updated };
    });
  };

  // Certification handlers
  const handleAddCertification = () => {
    if (newCertification.name.trim()) {
      setFormData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          certifications: [
            ...(prev.certifications || []),
            {
              ...newCertification,
              id: Date.now(), // Temporary ID for UI
            },
          ],
        };
      });
      // Reset form
      setNewCertification({
        name: "",
        issuing_organization: "",
        issue_date: "",
        expiration_date: "",
        credential_id: "",
        credential_url: "",
      });
    }
  };

  const handleRemoveCertification = (index: number) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updated = (prev.certifications || []).filter((_, i) => i !== index);
      return { ...prev, certifications: updated };
    });
  };

  // Document handlers
  const handleDocumentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File type validation
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png"];

    // Check MIME type
    if (!allowedTypes.includes(file.type) && file.type !== "") {
      toast.error("Please select a PDF or image file", {
        id: "doc-upload",
      });
      e.target.value = "";
      return;
    }

    // Check file extension
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some((ext) =>
      fileName.endsWith(ext),
    );
    if (!hasValidExtension) {
      toast.error("Invalid file extension. Please use .pdf, .jpg, or .png", {
        id: "doc-upload",
      });
      e.target.value = "";
      return;
    }

    // File size validation - 10MB max
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB", { id: "doc-upload" });
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("fileType", "certificate");

    try {
      setUploadingDoc(true);
      toast.loading("Uploading document...", { id: "doc-upload" });

      const response = await tutorProfileApi.uploadDocument(
        file,
        "certificate",
      );

      if (response.success && response.data) {
        // Add to documents list
        const newDoc = {
          id: response.data.id,
          name: file.name,
          type: "certificate",
          url: response.data.url,
          verified: false,
          uploaded_at: new Date().toISOString(),
        };
        setDocuments((prev) => [...prev, newDoc]);
        toast.success("Document uploaded successfully", { id: "doc-upload" });
      }
    } catch (error) {
      console.error("Failed to upload document:", error);
      toast.error("Failed to upload document", { id: "doc-upload" });
    } finally {
      setUploadingDoc(false);
      e.target.value = "";
    }
  };

  // const handleDeleteDocument = async (documentId: number) => {
  //   if (!confirm("Are you sure you want to delete this document?")) return;

  //   try {
  //     toast.loading("Deleting document...", { id: "doc-delete" });
  //     const response = await tutorProfileApi.deleteDocument(documentId);

  //     if (response.success) {
  //       setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
  //       toast.success("Document deleted successfully", { id: "doc-delete" });
  //     }
  //   } catch (error) {
  //     console.error("Failed to delete document:", error);
  //     toast.error("Failed to delete document", { id: "doc-delete" });
  //   }
  // };

  const handleDeleteDocument = async (documentId: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      toast.loading("Deleting document...", { id: "doc-delete" });

      const response = await tutorProfileApi.deleteDocument(documentId);
      console.log("Delete response:", response);
      if (response.success) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
        toast.success("Document deleted successfully", { id: "doc-delete" });
      } else {
        console.log("Failed to delete document:", response.message);
      }
    } catch (error) {
      // Enhanced error logging
      console.log("🔴 CATCH BLOCK - Full error object:", error);

      // Check all possible error properties
      if (error instanceof Error) {
        console.log("🔴 Error name:", error.name);
        console.log("🔴 Error message:", error.message);
        console.log("🔴 Error stack:", error.stack);

        // Check for attached properties
        const enhancedError = error as any;
        if (enhancedError.response) {
          console.log("🔴 Error response data:", enhancedError.response);
        }
        if (enhancedError.status) {
          console.log("🔴 Error status:", enhancedError.status);
        }

        // Show the actual error message from the server
        toast.error(error.message, { id: "doc-delete" });
      } else {
        // Try to stringify for debugging
        try {
          console.log("🔴 Stringified error:", JSON.stringify(error));
        } catch (e) {
          console.log("🔴 Error cannot be stringified");
        }

        toast.error("Failed to delete document", { id: "doc-delete" });
      }
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File type validation - only allow image files
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

    // Check MIME type
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select an image file (JPEG, PNG, GIF, or WEBP)", {
        id: "avatar-upload",
      });
      e.target.value = "";
      return;
    }

    // Check file extension as additional validation
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some((ext) =>
      fileName.endsWith(ext),
    );
    if (!hasValidExtension) {
      toast.error(
        "Invalid file extension. Please use .jpg, .png, .gif, or .webp",
        { id: "avatar-upload" },
      );
      e.target.value = "";
      return;
    }

    // File size validation - limit to 5MB
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB", { id: "avatar-upload" });
      e.target.value = "";
      return;
    }

    // Optional: Minimum size validation (optional, but can prevent empty/corrupt files)
    const minSize = 1 * 1024; // 1KB minimum
    if (file.size < minSize) {
      toast.error("File is too small or corrupt", { id: "avatar-upload" });
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("fileType", "avatar");

    try {
      toast.loading("Uploading...", { id: "avatar-upload" });

      // Upload avatar
      const response = await uploadAvatar(formData);

      if (response.success) {
        const newAvatarUrl = response.data.url;

        setFormData((prev) =>
          prev ? { ...prev, avatar_url: response.data.url } : null,
        );

        setProfile((prev) =>
          prev ? { ...prev, avatar_url: newAvatarUrl } : null,
        );

        // Also refresh user data from auth context to keep everything in sync
        await refreshUserData();

        toast.success("Avatar uploaded successfully", { id: "avatar-upload" });
      }
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      toast.error("Failed to upload avatar", { id: "avatar-upload" });
    } finally {
      // Clear the input value to allow uploading the same file again if needed
      e.target.value = "";
    }
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File type validation - only allow image files
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const allowedExtensions = [
      ".pdf",
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
    ];

    // Check MIME type
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Please select an image or pdf file (PDF,JPEG, PNG, GIF, or WEBP)",
        {
          id: "avatar-upload",
        },
      );
      e.target.value = "";
      return;
    }

    // Check file extension as additional validation
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some((ext) =>
      fileName.endsWith(ext),
    );
    if (!hasValidExtension) {
      toast.error(
        "Invalid file extension. Please use .pdf, .jpg, .png, .gif, or .webp",
        { id: "avatar-upload" },
      );
      e.target.value = "";
      return;
    }

    // File size validation - 10MB max
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB", { id: "doc-upload" });
      e.target.value = "";
      return;
    }

    //  // Optional: Minimum size validation (optional, but can prevent empty/corrupt files)
    //  const minSize = 1 * 1024; // 1KB minimum
    //  if (file.size < minSize) {
    //    toast.error("File is too small or corrupt", { id: "avatar-upload" });
    //    e.target.value = "";
    //    return;
    //  }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("fileType", "certificate");

    try {
      toast.loading("Uploading...", { id: "doc-upload" });

      // Upload certificate

      // Upload avatar
      const response = await uploadAvatar(formData);

      if (response.success) {
        // Add to documents list
        const newDoc = {
          id: response.data.id,
          name: file.name,
          type: "certificate",
          url: response.data.url,
          verified: false,
          uploaded_at: new Date().toISOString(),
        };
        setDocuments((prev) => [...prev, newDoc]);
        toast.success("Document uploaded successfully", { id: "doc-upload" });
      }
    } catch (error) {
      console.error("Failed to upload document:", error);
      toast.error("Failed to upload document", { id: "doc-upload" });
    } finally {
      setUploadingDoc(false);
      e.target.value = "";
    }
  };

  // Validation functions
  const validateEducationData = () => {
    if (!formData?.education || formData.education.length === 0) {
      return { isValid: true, errors: [] }; // Empty education is allowed
    }

    const errors: string[] = [];

    formData.education.forEach((edu, index) => {
      if (!edu.institution?.trim()) {
        errors.push(`Education #${index + 1}: Institution is required`);
      }
      if (!edu.degree?.trim()) {
        errors.push(`Education #${index + 1}: Degree is required`);
      }
      if (!edu.field_of_study?.trim()) {
        errors.push(`Education #${index + 1}: Field of study is required`);
      }
      if (!edu.start_date) {
        errors.push(`Education #${index + 1}: Start date is required`);
      }
      if (!edu.current && !edu.end_date) {
        errors.push(
          `Education #${index + 1}: End date is required (or check "Currently studying")`,
        );
      }
    });

    return { isValid: errors.length === 0, errors };
  };

  const validateExperienceData = () => {
    if (!formData?.experience || formData.experience.length === 0) {
      return { isValid: true, errors: [] }; // Empty experience is allowed
    }

    const errors: string[] = [];

    formData.experience.forEach((exp, index) => {
      if (!exp.company?.trim()) {
        errors.push(
          `Experience #${index + 1}: Company/Institution is required`,
        );
      }
      if (!exp.position?.trim()) {
        errors.push(`Experience #${index + 1}: Position is required`);
      }
      if (!exp.start_date) {
        errors.push(`Experience #${index + 1}: Start date is required`);
      }
      if (!exp.current && !exp.end_date) {
        errors.push(
          `Experience #${index + 1}: End date is required (or check "I currently work here")`,
        );
      }
    });

    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData) return;

    // Validate based on active tab
    if (activeTab === "education") {
      const educationValidation = validateEducationData();
      if (!educationValidation.isValid) {
        educationValidation.errors.forEach((error) => toast.error(error));
        return;
      }
    }

    if (activeTab === "experience") {
      const experienceValidation = validateExperienceData();
      if (!experienceValidation.isValid) {
        experienceValidation.errors.forEach((error) => toast.error(error));
        return;
      }
    }

    setSaving(true);

    try {
      // Only send the fields that have been edited
      const changedFields: any = {};

      // These are the fields we want to track
      const updatableFields = [
        "first_name",
        "last_name",
        "phone",
        "date_of_birth",
        "avatar_url",
        "country",
        "city",
        "timezone",
        "languages",
        "bio",
        "headline",
        "subjects",
        "education",
        "experience",
        "certifications",
        "highest_education_level",
        "university_name",
        "graduation_certificate_url",
        "teaching_experience_years",
        "professional_experience",
        "tsc_number",
        "portfolio_url",
        "previous_institutions",
        "certificates",
      ];

      // For education, experience, and certifications, we need to ensure they're in the right format
      if (
        formData.education &&
        JSON.stringify(formData.education) !==
          JSON.stringify(profile?.education || [])
      ) {
        // Validate each education entry has required fields
        const validEducation = formData.education.every(
          (edu) =>
            edu.institution?.trim() &&
            edu.degree?.trim() &&
            edu.field_of_study?.trim() &&
            edu.start_date &&
            (edu.current || edu.end_date),
        );

        if (!validEducation) {
          toast.error("Please fill in all required fields for education");
          setSaving(false);
          return;
        }

        changedFields.education = formData.education.map((edu) => ({
          id: edu.id,
          institution: edu.institution || "",
          degree: edu.degree || "",
          field_of_study: edu.field_of_study || "",
          start_date: edu.start_date || "",
          end_date: edu.current ? "" : edu.end_date || "",
          current: edu.current || false,
          description: edu.description || "",
        }));
      }

      if (
        formData.experience &&
        JSON.stringify(formData.experience) !==
          JSON.stringify(profile?.experience || [])
      ) {
        // Validate each experience entry has required fields
        const validExperience = formData.experience.every(
          (exp) =>
            exp.company?.trim() &&
            exp.position?.trim() &&
            exp.start_date &&
            (exp.current || exp.end_date),
        );

        if (!validExperience) {
          toast.error("Please fill in all required fields for experience");
          setSaving(false);
          return;
        }

        changedFields.experience = formData.experience.map((exp) => ({
          id: exp.id,
          company: exp.company || "",
          position: exp.position || "",
          start_date: exp.start_date || "",
          end_date: exp.current ? "" : exp.end_date || "",
          current: exp.current || false,
          description: exp.description || "",
        }));
      }

      if (
        formData.certifications &&
        JSON.stringify(formData.certifications) !==
          JSON.stringify(profile?.certifications || [])
      ) {
        changedFields.certifications = formData.certifications;
      }

      // For other fields, check if they've changed
      updatableFields.forEach((field) => {
        // Skip fields we've already handled
        if (["education", "experience", "certifications"].includes(field))
          return;

        const formValue = formData[field as keyof typeof formData];
        const originalValue = profile?.[field as keyof typeof profile];

        // Check if value has changed
        if (JSON.stringify(formValue) !== JSON.stringify(originalValue)) {
          changedFields[field] = formValue;
        }
      });

      // Only make API call if there are changes
      if (Object.keys(changedFields).length === 0) {
        toast.success("No changes to save");
        setIsEditing(false);
        return;
      }

      const response = await tutorProfileApi.updateProfile(changedFields);

      if (response.success && response.data) {
        setProfile(response.data);
        if (typeof calculateCompletion === "function") {
          calculateCompletion(response.data);
        }
        setIsEditing(false);
        toast.success("Profile updated successfully");
        await refreshUserData();
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);

      // Handle validation errors
      if (error?.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err: any) => toast.error(err.message));
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Present";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "experience", label: "Experience", icon: Briefcase },
    {
      id: "certifications-documents",
      label: "Certifications & Documents",
      icon: Award,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-1">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
            <Link
              href="/tutor/dashboard"
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Profile</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-2xl font-semibold text-gray-900">
                My Profile
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Manage your tutor profile and professional information
              </p>
            </div>
            <div className="flex gap-3">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Profile Completion Bar */}
          {profileCompletion < 100 && !isEditing && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-800 mb-1">
                    Complete Your Profile
                  </h3>
                  <p className="text-sm text-amber-700 mb-3">
                    Your profile is {profileCompletion}% complete. Complete the
                    following to become more visible to students:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {missingFields.map((field) => (
                      <span
                        key={field}
                        className="inline-flex items-center px-2.5 py-1 bg-white rounded-lg text-xs font-medium text-amber-700 border border-amber-200"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 w-full bg-amber-200 rounded-full h-2">
                    <div
                      className="bg-amber-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-white text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-50 transition-colors border border-amber-200"
                >
                  Complete Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-4">
              {/* Profile Summary */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col items-center text-center">
                  <div className="relative group mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={`${profile.first_name} ${profile.last_name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-blue-600">
                          {getInitials(
                            profile?.first_name || "",
                            profile?.last_name || "",
                          ) || "T"}
                        </span>
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                        <Camera className="w-4 h-4 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarUpload}
                        />
                      </label>
                    )}
                  </div>

                  <h2 className="text-lg font-semibold text-gray-900">
                    {profile?.first_name} {profile?.last_name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {profile?.headline || "Tutor"}
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{profile?.email}</span>
                    {profile?.verification.email_verified && (
                      <BadgeCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{profile.phone}</span>
                      {profile.verification.phone_verified && (
                        <BadgeCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                  )}
                  {profile?.country && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>
                        {profile.city ? `${profile.city}, ` : ""}
                        {profile.country}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Verification Status */}
              <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Verification
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email</span>
                    {profile?.verification.email_verified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                        <AlertCircle className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Phone</span>
                    {profile?.verification.phone_verified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                        <AlertCircle className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Identity</span>
                    {profile?.verification.identity_verified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                        <AlertCircle className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Documents</span>
                    {documents.some((doc) => doc.verified) ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                        <AlertCircle className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="border-b border-gray-200 overflow-x-auto">
                <div className="flex">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    {/* Profile Tab - Edit Mode */}
                    {activeTab === "profile" && (
                      <div className="space-y-6">
                        {/* Basic Information */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Basic Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="first_name"
                                value={formData?.first_name || ""}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="last_name"
                                value={formData?.last_name || ""}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                value={formData?.phone || ""}
                                onChange={handleInputChange}
                                placeholder="+254 700 000 000"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date of Birth
                              </label>
                              <input
                                type="date"
                                name="date_of_birth"
                                value={formData?.date_of_birth || ""}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Location & Language */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Location & Language
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Country <span className="text-red-500">*</span>
                              </label>
                              <select
                                name="country"
                                value={formData?.country || ""}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                required
                              >
                                <option value="">Select country</option>
                                <option value="Kenya">Kenya</option>
                                <option value="Uganda">Uganda</option>
                                <option value="Tanzania">Tanzania</option>
                                <option value="Rwanda">Rwanda</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                City
                              </label>
                              <input
                                type="text"
                                name="city"
                                value={formData?.city || ""}
                                onChange={handleInputChange}
                                placeholder="e.g., Nairobi"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                              />
                            </div>

                            {/* Languages - Tag Input */}
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Languages{" "}
                                <span className="text-red-500">*</span>
                              </label>

                              {/* Language Tags */}
                              {formData?.languages &&
                                formData.languages.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {formData.languages.map((lang, index) => (
                                      <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 text-sm rounded-full"
                                      >
                                        {lang}
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveLanguage(index)
                                          }
                                          className="ml-1.5 hover:text-blue-900 focus:outline-none"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </span>
                                    ))}
                                  </div>
                                )}

                              {/* Add Language Input */}
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={newLanguage}
                                  onChange={(e) =>
                                    setNewLanguage(e.target.value)
                                  }
                                  onKeyDown={(e) =>
                                    handleKeyDown(e, "language")
                                  }
                                  placeholder="Type a language and press Enter or comma"
                                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={handleAddLanguage}
                                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  <Plus className="w-5 h-5" />
                                </button>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                Type a language and press Enter or comma to add
                                it. Click the × to remove.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Professional Information */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Professional Information
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Professional Headline{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="headline"
                                value={formData?.headline || ""}
                                onChange={handleInputChange}
                                placeholder="e.g., Experienced Mathematics Tutor Specializing in KCSE"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bio <span className="text-red-500">*</span>
                              </label>
                              <textarea
                                name="bio"
                                value={formData?.bio || ""}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Tell students about yourself, your teaching style, and experience..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                required
                              />
                            </div>

                            {/* Subjects - Tag Input */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subjects <span className="text-red-500">*</span>
                              </label>

                              {/* Subject Tags */}
                              {formData?.subjects &&
                                formData.subjects.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {formData.subjects.map((subject, index) => (
                                      <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 text-sm rounded-full"
                                      >
                                        {subject}
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveSubject(index)
                                          }
                                          className="ml-1.5 hover:text-green-900 focus:outline-none"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </span>
                                    ))}
                                  </div>
                                )}

                              {/* Add Subject Input */}
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={newSubject}
                                  onChange={(e) =>
                                    setNewSubject(e.target.value)
                                  }
                                  onKeyDown={(e) => handleKeyDown(e, "subject")}
                                  placeholder="Type a subject and press Enter or comma"
                                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={handleAddSubject}
                                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  <Plus className="w-5 h-5" />
                                </button>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                Type a subject and press Enter or comma to add
                                it. Click the × to remove.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Education Tab - Edit Mode */}
                    {activeTab === "education" && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Education History
                          </h3>
                          <button
                            type="button"
                            onClick={handleAddEducation}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Education
                          </button>
                        </div>

                        <div className="space-y-4">
                          {formData?.education?.map((edu, index) => (
                            <div
                              key={index}
                              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <h4 className="font-medium text-gray-900">
                                  Education #{index + 1}
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveEducation(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Institution{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={edu.institution}
                                    onChange={(e) =>
                                      handleUpdateEducation(
                                        index,
                                        "institution",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="University of Nairobi"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Degree{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={edu.degree}
                                    onChange={(e) =>
                                      handleUpdateEducation(
                                        index,
                                        "degree",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="Bachelor of Education"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Field of Study{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={edu.field_of_study}
                                    onChange={(e) =>
                                      handleUpdateEducation(
                                        index,
                                        "field_of_study",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="Mathematics"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="date"
                                    value={edu.start_date}
                                    onChange={(e) =>
                                      handleUpdateEducation(
                                        index,
                                        "start_date",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date{" "}
                                    {!edu.current && (
                                      <span className="text-red-500">*</span>
                                    )}
                                  </label>
                                  <input
                                    type="date"
                                    value={edu.end_date}
                                    onChange={(e) =>
                                      handleUpdateEducation(
                                        index,
                                        "end_date",
                                        e.target.value,
                                      )
                                    }
                                    disabled={edu.current}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
                                    required={!edu.current}
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={edu.current}
                                      onChange={(e) =>
                                        handleUpdateEducation(
                                          index,
                                          "current",
                                          e.target.checked,
                                        )
                                      }
                                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                      I am currently studying here
                                    </span>
                                  </label>
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description (Optional)
                                  </label>
                                  <textarea
                                    value={edu.description || ""}
                                    onChange={(e) =>
                                      handleUpdateEducation(
                                        index,
                                        "description",
                                        e.target.value,
                                      )
                                    }
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="Additional details about your studies..."
                                  />
                                </div>
                              </div>
                            </div>
                          ))}

                          {formData?.education?.length === 0 && (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                              <GraduationCap className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                              <p className="text-gray-600 mb-4">
                                No education history added yet
                              </p>
                              <button
                                type="button"
                                onClick={handleAddEducation}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Your First Education
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Experience Tab - Edit Mode */}
                    {activeTab === "experience" && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Work Experience
                          </h3>
                          <button
                            type="button"
                            onClick={handleAddExperience}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Experience
                          </button>
                        </div>

                        <div className="space-y-4">
                          {formData?.experience?.map((exp, index) => (
                            <div
                              key={index}
                              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <h4 className="font-medium text-gray-900">
                                  Experience #{index + 1}
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveExperience(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company / Institution{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={exp.company}
                                    onChange={(e) =>
                                      handleUpdateExperience(
                                        index,
                                        "company",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="Nairobi School"
                                    required
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Position{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={exp.position}
                                    onChange={(e) =>
                                      handleUpdateExperience(
                                        index,
                                        "position",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="Mathematics Teacher"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="date"
                                    value={exp.start_date}
                                    onChange={(e) =>
                                      handleUpdateExperience(
                                        index,
                                        "start_date",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date{" "}
                                    {!exp.current && (
                                      <span className="text-red-500">*</span>
                                    )}
                                  </label>
                                  <input
                                    type="date"
                                    value={exp.end_date}
                                    onChange={(e) =>
                                      handleUpdateExperience(
                                        index,
                                        "end_date",
                                        e.target.value,
                                      )
                                    }
                                    disabled={exp.current}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
                                    required={!exp.current}
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={exp.current}
                                      onChange={(e) =>
                                        handleUpdateExperience(
                                          index,
                                          "current",
                                          e.target.checked,
                                        )
                                      }
                                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                      I currently work here
                                    </span>
                                  </label>
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description (Optional)
                                  </label>
                                  <textarea
                                    value={exp.description || ""}
                                    onChange={(e) =>
                                      handleUpdateExperience(
                                        index,
                                        "description",
                                        e.target.value,
                                      )
                                    }
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="Describe your responsibilities and achievements..."
                                  />
                                </div>
                              </div>
                            </div>
                          ))}

                          {formData?.experience?.length === 0 && (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                              <Briefcase className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                              <p className="text-gray-600 mb-4">
                                No work experience added yet
                              </p>
                              <button
                                type="button"
                                onClick={handleAddExperience}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Your First Experience
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Certifications & Documents Tab - Edit Mode */}
                    {activeTab === "certifications-documents" && (
                      <div className="space-y-8">
                        {/* Certifications Section */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Certifications
                            </h3>
                          </div>

                          {/* Add Certification Form */}
                          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-4">
                              Add New Certification
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Certification Name
                                </label>
                                <input
                                  type="text"
                                  value={newCertification.name}
                                  onChange={(e) =>
                                    setNewCertification({
                                      ...newCertification,
                                      name: e.target.value,
                                    })
                                  }
                                  placeholder="e.g., Certified Mathematics Teacher"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Issuing Organization
                                </label>
                                <input
                                  type="text"
                                  value={newCertification.issuing_organization}
                                  onChange={(e) =>
                                    setNewCertification({
                                      ...newCertification,
                                      issuing_organization: e.target.value,
                                    })
                                  }
                                  placeholder="e.g., Teachers Service Commission"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Issue Date
                                </label>
                                <input
                                  type="date"
                                  value={newCertification.issue_date}
                                  onChange={(e) =>
                                    setNewCertification({
                                      ...newCertification,
                                      issue_date: e.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Expiration Date (Optional)
                                </label>
                                <input
                                  type="date"
                                  value={newCertification.expiration_date}
                                  onChange={(e) =>
                                    setNewCertification({
                                      ...newCertification,
                                      expiration_date: e.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Credential ID
                                </label>
                                <input
                                  type="text"
                                  value={newCertification.credential_id}
                                  onChange={(e) =>
                                    setNewCertification({
                                      ...newCertification,
                                      credential_id: e.target.value,
                                    })
                                  }
                                  placeholder="e.g., TSC-2023-12345"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Credential URL (Optional)
                                </label>
                                <input
                                  type="url"
                                  value={newCertification.credential_url}
                                  onChange={(e) =>
                                    setNewCertification({
                                      ...newCertification,
                                      credential_url: e.target.value,
                                    })
                                  }
                                  placeholder="https://example.com/certificate"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                />
                              </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                              <button
                                type="button"
                                onClick={handleAddCertification}
                                disabled={!newCertification.name.trim()}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Certification
                              </button>
                            </div>
                          </div>

                          {/* Certifications List */}
                          {formData?.certifications &&
                          formData.certifications.length > 0 ? (
                            <div className="space-y-4">
                              {formData.certifications.map((cert, index) => (
                                <div
                                  key={index}
                                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-gray-900">
                                        {cert.name}
                                      </h4>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {cert.issuing_organization}
                                      </p>
                                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                                        <span>
                                          Issued: {formatDate(cert.issue_date)}
                                        </span>
                                        {cert.expiration_date && (
                                          <span>
                                            Expires:{" "}
                                            {formatDate(cert.expiration_date)}
                                          </span>
                                        )}
                                        {cert.credential_id && (
                                          <span>ID: {cert.credential_id}</span>
                                        )}
                                      </div>
                                      {cert.credential_url && (
                                        <a
                                          href={cert.credential_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 mt-2 text-xs text-blue-600 hover:text-blue-700"
                                        >
                                          <FileText className="w-3 h-3" />
                                          View Certificate
                                        </a>
                                      )}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveCertification(index)
                                      }
                                      className="text-red-600 hover:text-red-700 ml-4"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                              <Award className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                              <p className="text-gray-600">
                                No certifications added yet
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Documents Section */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Uploaded Documents
                          </h3>

                          <div className="space-y-4 mb-4">
                            {documents.map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    {doc.url.match(
                                      /\.(jpg|jpeg|png|gif|webp)$/i,
                                    ) ? (
                                      <ImageIcon className="w-5 h-5 text-blue-600" />
                                    ) : (
                                      <FileText className="w-5 h-5 text-blue-600" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">
                                      {doc.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Uploaded{" "}
                                      {new Date(
                                        doc.uploaded_at,
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 ml-4">
                                  {doc.verified ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                      <CheckCircle className="w-3 h-3" />
                                      Verified
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                                      <AlertCircle className="w-3 h-3" />
                                      Pending
                                    </span>
                                  )}
                                  <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    <Download className="w-4 h-4" />
                                  </a>
                                  {isEditing && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteDocument(doc.id)
                                      }
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}

                            {/* Upload New Document Button */}
                            <label className="block w-full">
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={handleDocUpload}
                                disabled={uploadingDoc}
                              />
                              <div className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                                <div className="flex flex-col items-center">
                                  {uploadingDoc ? (
                                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin mb-2" />
                                  ) : (
                                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                                  )}
                                  <p className="font-medium text-gray-900">
                                    {uploadingDoc
                                      ? "Uploading..."
                                      : "Upload New Document"}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    PDF, PNG, JPG up to 10MB
                                  </p>
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Save/Cancel Buttons */}
                    <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData(profile);
                        }}
                        className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* View Mode */
                  <>
                    {/* Profile Tab - View Mode */}
                    {activeTab === "profile" && (
                      <div className="space-y-6">
                        {/* Basic Information */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Basic Information
                          </h3>
                          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <dt className="text-sm text-gray-500">
                                Full Name
                              </dt>
                              <dd className="mt-1 font-medium text-gray-900">
                                {profile?.first_name} {profile?.last_name}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm text-gray-500">Email</dt>
                              <dd className="mt-1 font-medium text-gray-900">
                                {profile?.email}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm text-gray-500">Phone</dt>
                              <dd className="mt-1 font-medium text-gray-900">
                                {profile?.phone || "Not provided"}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm text-gray-500">
                                Date of Birth
                              </dt>
                              <dd className="mt-1 font-medium text-gray-900">
                                {profile?.date_of_birth
                                  ? new Date(
                                      profile.date_of_birth,
                                    ).toLocaleDateString()
                                  : "Not provided"}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        {/* Location & Language */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Location & Language
                          </h3>
                          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <dt className="text-sm text-gray-500">Country</dt>
                              <dd className="mt-1 font-medium text-gray-900">
                                {profile?.country || "Not provided"}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm text-gray-500">City</dt>
                              <dd className="mt-1 font-medium text-gray-900">
                                {profile?.city || "Not provided"}
                              </dd>
                            </div>
                            <div className="md:col-span-2">
                              <dt className="text-sm text-gray-500">
                                Languages
                              </dt>
                              <dd className="mt-1">
                                <div className="flex flex-wrap gap-2">
                                  {profile?.languages?.map((lang, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                                    >
                                      {lang}
                                    </span>
                                  ))}
                                </div>
                              </dd>
                            </div>
                          </dl>
                        </div>

                        {/* Professional Information */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Professional Information
                          </h3>
                          <dl className="space-y-4">
                            <div>
                              <dt className="text-sm text-gray-500">
                                Headline
                              </dt>
                              <dd className="mt-1 font-medium text-gray-900">
                                {profile?.headline || "Not provided"}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm text-gray-500">Bio</dt>
                              <dd className="mt-1 text-gray-700 whitespace-pre-line">
                                {profile?.bio || "No bio provided"}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm text-gray-500">
                                Subjects
                              </dt>
                              <dd className="mt-1">
                                <div className="flex flex-wrap gap-2">
                                  {profile?.subjects?.map((subject, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                    >
                                      {subject}
                                    </span>
                                  ))}
                                </div>
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    )}

                    {/* Education Tab - View Mode */}
                    {activeTab === "education" && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Education History
                        </h3>
                        {profile?.education &&
                        profile?.education?.length > 0 ? (
                          <div className="space-y-4">
                            {profile.education.map((edu, index) => (
                              <div
                                key={index}
                                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold text-gray-900">
                                      {edu.institution}
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {edu.degree} in {edu.field_of_study}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {formatDate(edu.start_date)} -{" "}
                                      {edu.current
                                        ? "Present"
                                        : formatDate(edu.end_date)}
                                    </p>
                                    {edu.description && (
                                      <p className="text-sm text-gray-700 mt-2">
                                        {edu.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                            <GraduationCap className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-600">
                              No education history added yet
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Experience Tab - View Mode */}
                    {activeTab === "experience" && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Work Experience
                        </h3>
                        {profile?.experience &&
                        profile?.experience?.length > 0 ? (
                          <div className="space-y-4">
                            {profile.experience.map((exp, index) => (
                              <div
                                key={index}
                                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold text-gray-900">
                                      {exp.company}
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {exp.position}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {formatDate(exp.start_date)} -{" "}
                                      {exp.current
                                        ? "Present"
                                        : formatDate(exp.end_date)}
                                    </p>
                                    {exp.description && (
                                      <p className="text-sm text-gray-700 mt-2">
                                        {exp.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                            <Briefcase className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-600">
                              No work experience added yet
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Certifications & Documents Tab - View Mode */}
                    {activeTab === "certifications-documents" && (
                      <div className="space-y-8">
                        {/* Certifications Section */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Certifications
                          </h3>
                          {profile?.certifications &&
                          profile.certifications.length > 0 ? (
                            <div className="space-y-4">
                              {profile.certifications.map((cert, index) => (
                                <div
                                  key={index}
                                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                  <div>
                                    <h4 className="font-semibold text-gray-900">
                                      {cert.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {cert.issuing_organization}
                                    </p>
                                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                                      <span>
                                        Issued: {formatDate(cert.issue_date)}
                                      </span>
                                      {cert.expiration_date && (
                                        <span>
                                          Expires:{" "}
                                          {formatDate(cert.expiration_date)}
                                        </span>
                                      )}
                                      {cert.credential_id && (
                                        <span>ID: {cert.credential_id}</span>
                                      )}
                                    </div>
                                    {cert.credential_url && (
                                      <a
                                        href={cert.credential_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 mt-2 text-xs text-blue-600 hover:text-blue-700"
                                      >
                                        <FileText className="w-3 h-3" />
                                        View Certificate
                                      </a>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                              <Award className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                              <p className="text-gray-600">
                                No certifications added yet
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Documents Section */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Uploaded Documents
                          </h3>
                          {documents.length > 0 ? (
                            <div className="space-y-4">
                              {documents.map((doc) => (
                                <div
                                  key={doc.id}
                                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                      {doc.url.match(
                                        /\.(jpg|jpeg|png|gif|webp)$/i,
                                      ) ? (
                                        <ImageIcon className="w-5 h-5 text-blue-600" />
                                      ) : (
                                        <FileText className="w-5 h-5 text-blue-600" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-gray-900 truncate">
                                        {doc.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Uploaded{" "}
                                        {new Date(
                                          doc.uploaded_at,
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 ml-4">
                                    {doc.verified ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                        <CheckCircle className="w-3 h-3" />
                                        Verified
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                                        <AlertCircle className="w-3 h-3" />
                                        Pending
                                      </span>
                                    )}
                                    <a
                                      href={doc.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-700"
                                    >
                                      <Download className="w-4 h-4" />
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                              <p className="text-gray-600">
                                No documents uploaded yet
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
