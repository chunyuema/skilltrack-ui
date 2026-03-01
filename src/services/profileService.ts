import { UserProfile } from "../types";

// Type for the raw API response
interface ApiUserProfile {
  full_name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  education: string;
  visa_status: string;
  years_of_experience: number;
  github_url: string;
  linkedin_url: string;
  bio: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export const profileService = {
  fetchProfile: async (token: string): Promise<UserProfile> => {
    const response = await fetch(`${API_URL}/profiles/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    const data: ApiUserProfile = await response.json();

    // Map API response to the frontend UserProfile type
    const mappedProfile: UserProfile = {
      fullName: data.full_name || "",
      title: data.title || "",
      email: data.email || "",
      phone: data.phone || "",
      location: data.location || "",
      education: data.education || "",
      visaStatus: data.visa_status || "",
      yearsOfExperience: data.years_of_experience || 0,
      githubUrl: data.github_url || "",
      linkedinUrl: data.linkedin_url || "",
      bio: data.bio || "",
    };

    return mappedProfile;
  },
};
