// src/app/onboarding/tutor/page.tsx
import TutorOnboarding from "./components/TutorOnboarding";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function TutorOnboardingPage() {
  return (
    <ProtectedRoute
      requiredRoles={["student", "tutor", "community", "affiliate"]}
    >
      <div className="min-h-screen ">
        <div className="container mx-auto px-4 w-full py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-zinc-700">
              Become a Tutor
            </h1>
            <p className="text-gray-600 mt-2">
              Join our team of educators and share your knowledge with students
              worldwide.
            </p>
          </div>

          <TutorOnboarding />
        </div>
      </div>
    </ProtectedRoute>
  );
}
