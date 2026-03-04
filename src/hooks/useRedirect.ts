// src/hooks/useRedirect.ts
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { User, UserStatus } from '../types/user.types';

export const useRedirect = (user: User | null, userStatus: UserStatus | null, isLoading: boolean) => {
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    if (isLoading) return;
    
    // Don't redirect on auth pages or public pages
    const publicPages = [
      '/login', '/register', '/verify-otp', '/forgot-password', '/auth/',
      '/', '/about', '/pricing', '/contact', '/faq', 
      '/tutors', '/communities', // Public browsing
      '/onboarding/tutors', '/onboarding/community' // Onboarding entry points
    ];
    
    const isPublicPage = publicPages.some(page => pathname.startsWith(page));
    
    if (isPublicPage) return;
    
    // Redirect to login if no user
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    
    // Smart redirection for logged-in users
    if (user && userStatus) {
      const redirectPath = determineRedirectPath(user, userStatus, pathname);
      
      if (redirectPath && redirectPath !== pathname) {
        // Prevent redirect loops
        const lastRedirect = sessionStorage.getItem('last_redirect');
        const now = Date.now();
        
        if (!lastRedirect || (now - parseInt(lastRedirect)) > 1000) {
          console.log('Redirecting from', pathname, 'to', redirectPath);
          router.push(redirectPath);
          sessionStorage.setItem('last_redirect', now.toString());
        }
      }
    }
  }, [user, userStatus, isLoading, pathname, router]);
  
  const determineRedirectPath = (user: User, status: UserStatus, currentPath: string): string | null => {
    // Never redirect from these pages
    const safePages = [
      '/settings',
      '/profile',
      '/messages',
      '/notifications',
      '/browse/tutors',
      '/browse/communities',
      '/student/',
      '/tutor/',
      '/community/',
      '/onboarding/tutors',
      '/onboarding/community',
      '/application-pending',
      '/application-rejected'
    ];
    
    const isSafePage = safePages.some(page => currentPath.startsWith(page));
    if (isSafePage) {
      return null;
    }
    
    // 1. Check profile completion
    if (status.profileCompletion < 70 && !currentPath.includes('/profile/complete')) {
      return '/profile/complete';
    }
    
    // 2. Determine user's active role(s)
    const hasTutorRole = status.hasTutorRole;
    const hasCommunityRole = status.hasCommunityRole;
    const hasStudentRole = status.hasStudentRole !== false; // Default true
    
    // Count active roles (excluding student if they have other roles)
    const activeRoles = [];
    if (hasTutorRole) activeRoles.push('tutor');
    if (hasCommunityRole) activeRoles.push('community');
    if (hasStudentRole && !hasTutorRole && !hasCommunityRole) activeRoles.push('student');
    
    console.log('Active roles:', activeRoles);
    
    // 3. Handle role-specific redirection
    // Dashboard redirection logic
    if (currentPath === '/dashboard' || currentPath === '/') {
      if (activeRoles.length === 1) {
        // Single role - redirect to specific dashboard
        const role = activeRoles[0];
        switch(role) {
          case 'tutor':
            return handleTutorDashboardRedirect(status);
          case 'community':
            return handleCommunityDashboardRedirect(status);
          case 'student':
            return handleStudentDashboardRedirect(status);
        }
      } else if (activeRoles.length > 1) {
        // Multiple roles - stay on main dashboard (role selector)
        return null;
      } else {
        // No roles (shouldn't happen) - default to student
        return '/student/dashboard';
      }
    }
    
    // 4. Handle application status redirects
    if (hasTutorRole) {
      const tutorRedirect = handleTutorApplicationRedirect(status, currentPath);
      if (tutorRedirect) return tutorRedirect;
    }
    
    if (hasCommunityRole) {
      const communityRedirect = handleCommunityApplicationRedirect(status, currentPath);
      if (communityRedirect) return communityRedirect;
    }
    
    return null;
  };
  
  // Dashboard redirection helpers
  const handleStudentDashboardRedirect = (status: UserStatus): string => {
    if (!status.hasActiveSessions) {
      return '/student/browse-tutors';
    }
    return '/student/dashboard';
  };
  
  const handleTutorDashboardRedirect = (status: UserStatus): string => {
    const tutorApp = status.tutorApplication;
    
    if (tutorApp?.application_status === 'draft') {
      return `/onboarding/tutors?step=${tutorApp.current_step}`;
    }
    
    if (tutorApp?.application_status === 'pending' || tutorApp?.application_status === 'under_review') {
      return '/tutor/application-pending';
    }
    
    if (tutorApp?.application_status === 'rejected') {
      return '/tutor/application-rejected';
    }
    
    if (status.isApprovedTutor) {
      if (status.pendingTutorRequests > 0) {
        return '/tutor/requests';
      }
      return '/tutor/dashboard';
    }
    
    return '/onboarding/tutors';
  };
  
  const handleCommunityDashboardRedirect = (status: UserStatus): string => {
    const communityApp = status.communityApplication;
    
    if (communityApp?.application_status === 'draft') {
      return `/onboarding/community?step=${communityApp.current_step}`;
    }
    
    if (communityApp?.application_status === 'pending' || communityApp?.application_status === 'under_review') {
      return '/community/application-pending';
    }
    
    if (communityApp?.application_status === 'rejected') {
      return '/community/application-rejected';
    }
    
    if (status.isApprovedCommunityMember) {
      if (status.pendingCommunityRequests > 0) {
        return '/community/requests';
      }
      return '/community/dashboard';
    }
    
    return '/onboarding/community';
  };
  
  // Application status redirect helpers
  const handleTutorApplicationRedirect = (status: UserStatus, currentPath: string): string | null => {
    const tutorApp = status.tutorApplication;
    
    if (!tutorApp) return null;
    
    switch (tutorApp.application_status) {
      case 'draft':
        if (!currentPath.includes('/onboarding/tutors')) {
          return `/onboarding/tutors?step=${tutorApp.current_step}`;
        }
        break;
        
      case 'pending':
      case 'under_review':
        if (!currentPath.includes('/tutor/application-pending')) {
          return '/tutor/application-pending';
        }
        break;
        
      case 'rejected':
        if (!currentPath.includes('/tutor/application-rejected')) {
          return '/tutor/application-rejected';
        }
        break;
    }
    
    return null;
  };
  
  const handleCommunityApplicationRedirect = (status: UserStatus, currentPath: string): string | null => {
    const communityApp = status.communityApplication;
    
    if (!communityApp) return null;
    
    switch (communityApp.application_status) {
      case 'draft':
        if (!currentPath.includes('/onboarding/community')) {
          return `/onboarding/community?step=${communityApp.current_step}`;
        }
        break;
        
      case 'pending':
      case 'under_review':
        if (!currentPath.includes('/community/application-pending')) {
          return '/community/application-pending';
        }
        break;
        
      case 'rejected':
        if (!currentPath.includes('/community/application-rejected')) {
          return '/community/application-rejected';
        }
        break;
    }
    
    return null;
  };
  
  return { determineRedirectPath };
};