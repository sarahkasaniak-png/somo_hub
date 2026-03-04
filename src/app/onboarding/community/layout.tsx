// src/app/onboarding/community/layout.tsx
export default function CommunityOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-white">{children}</div>;
}
