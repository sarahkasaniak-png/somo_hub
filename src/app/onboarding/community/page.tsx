// src/app/onboarding/community/page.tsx
import CommunityOnboarding from "./components/CommunityOnboarding";
import ProtectedRoute from "@/components/ProtectedRoute";
export default function CommunityOnboardingPage() {
  return (
    <ProtectedRoute requiredRoles={["student", "tutor", "community"]}>
      <CommunityOnboarding />
    </ProtectedRoute>
  );
}
