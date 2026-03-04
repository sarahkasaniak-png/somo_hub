// src/app/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import tuitionApi from "@/lib/api/tuition";
import HomeClient from "./HomeClient";
import { GraduationCap } from "lucide-react";

// Loading component
function HomeLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-purple-600 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// Server Component
export default async function HomePage() {
  try {
    // Fetch all data in parallel on the server
    const [groupRes, oneOnOneRes, tutorsRes, communitiesRes] =
      await Promise.allSettled([
        tuitionApi.getGroupSessions({ limit: 8 }),
        tuitionApi.getOneOnOneSessions({ limit: 8 }),
        tuitionApi.getFeaturedTutors(8),
        tuitionApi.getCommunities({ limit: 8 }),
      ]);

    // Extract data with proper error handling
    const groupSessions =
      groupRes.status === "fulfilled" && groupRes.value?.success
        ? groupRes.value.data?.sessions || []
        : [];

    const oneOnOneSessions =
      oneOnOneRes.status === "fulfilled" && oneOnOneRes.value?.success
        ? oneOnOneRes.value.data?.sessions || []
        : [];

    const featuredTutors =
      tutorsRes.status === "fulfilled" && tutorsRes.value?.success
        ? tutorsRes.value.data?.tutors || []
        : [];

    const communities =
      communitiesRes.status === "fulfilled" && communitiesRes.value?.success
        ? communitiesRes.value.data?.communities || []
        : [];

    // Pass initial data and pagination state to client component
    return (
      <Suspense fallback={<HomeLoading />}>
        <HomeClient
          initialGroupSessions={groupSessions}
          initialOneOnOneSessions={oneOnOneSessions}
          initialFeaturedTutors={featuredTutors}
          initialCommunities={communities}
          initialPaginationState={{
            hasMoreGroup: groupSessions.length === 8,
            hasMoreOneOnOne: oneOnOneSessions.length === 8,
            hasMoreTutors: featuredTutors.length === 8,
            hasMoreCommunities: communities.length === 8,
          }}
        />
      </Suspense>
    );
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    // Return a fallback UI with just the client component that will show error
    return (
      <HomeClient
        initialGroupSessions={[]}
        initialOneOnOneSessions={[]}
        initialFeaturedTutors={[]}
        initialCommunities={[]}
        initialPaginationState={{
          hasMoreGroup: false,
          hasMoreOneOnOne: false,
          hasMoreTutors: false,
          hasMoreCommunities: false,
        }}
        error="Failed to load content"
      />
    );
  }
}
