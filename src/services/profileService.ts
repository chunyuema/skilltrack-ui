/// <reference types="vite/client" />
import { UserProfile, Experience, Track, SkillTheme } from "../types";

// Type for the raw API response
interface ApiUserProfile {
  first_name: string;
  last_name: string;
  country: string;
  email: string;
  phone: string;
  location: string;
  education: string;
  visa_status: string;
  years_of_experience: number;
  github_url: string;
  linkedin_url: string;
  bio: string;
  selected_tracks: string[];
}

interface ApiExperience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  description: string;
  technologies: string[];
}

const API_URL = import.meta.env.VITE_API_URL;

const handleResponse = async (response: Response) => {
  // 1. Check for Auth Errors First
  if (response.status === 401) {
    throw new Error("Unauthorized");
  }

  // 2. Extract Body as Text (Always consumes the stream)
  const text = await response.text();
  let data = null;

  // 3. Attempt JSON Parse safely
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      // If success code but invalid JSON, return raw text or null
      if (response.ok) return text || null;
      // If error code and invalid JSON, use raw text as error message
      throw new Error(`Server Error (${response.status}): ${text.substring(0, 100)}`);
    }
  }

  // 4. Handle HTTP Error Statuses
  if (!response.ok) {
    const errorMessage = data?.detail || data?.message || `API request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  // 5. Return parsed data or null for empty success
  return data;
};

export const profileService = {
  fetchProfile: async (token: string): Promise<UserProfile> => {
    const response = await fetch(`${API_URL}/profiles/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data: ApiUserProfile = await handleResponse(response);

    // Map API response to the frontend UserProfile type
    return {
      firstName: data.first_name || "",
      lastName: data.last_name || "",
      country: data.country || "",
      email: data.email || "",
      phone: data.phone || "",
      location: data.location || "",
      education: data.education || "",
      visaStatus: data.visa_status || "",
      yearsOfExperience: data.years_of_experience || 0,
      githubUrl: data.github_url || "",
      linkedinUrl: data.linkedin_url || "",
      bio: data.bio || "",
      selectedTrackIds: data.selected_tracks || [],
    };
  },

  updateProfile: async (profile: UserProfile, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/profiles/me/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        first_name: profile.firstName,
        last_name: profile.lastName,
        country: profile.country,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        education: profile.education,
        visa_status: profile.visaStatus,
        years_of_experience: profile.yearsOfExperience,
        github_url: profile.githubUrl,
        linkedin_url: profile.linkedinUrl,
        bio: profile.bio,
      }),
    });

    await handleResponse(response);
  },

  fetchExperiences: async (token: string): Promise<Experience[]> => {
    const response = await fetch(`${API_URL}/profiles/experiences/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data: ApiExperience[] = await handleResponse(response);

    return (data || []).map((exp) => ({
      id: exp.id,
      company: exp.company,
      role: exp.role,
      startDate: exp.start_date,
      endDate: exp.end_date || "Present",
      description: exp.description,
      technologies: exp.technologies,
    }));
  },

  addExperience: async (
    experience: Omit<Experience, "id">,
    token: string
  ): Promise<Experience> => {
    const response = await fetch(`${API_URL}/profiles/experiences/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        company: experience.company,
        role: experience.role,
        start_date: experience.startDate,
        end_date:
          experience.endDate === "Present" ? null : experience.endDate,
        description: experience.description,
        technologies: experience.technologies,
      }),
    });

    const data: ApiExperience = await handleResponse(response);

    return {
      id: data.id,
      company: data.company,
      role: data.role,
      startDate: data.start_date,
      endDate: data.end_date || "Present",
      description: data.description,
      technologies: data.technologies,
    };
  },

  updateExperience: async (
    id: string,
    experience: Partial<Experience>,
    token: string
  ): Promise<Experience> => {
    const response = await fetch(`${API_URL}/profiles/experiences/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        company: experience.company,
        role: experience.role,
        start_date: experience.startDate,
        end_date:
          experience.endDate === "Present" ? null : experience.endDate,
        description: experience.description,
        technologies: experience.technologies,
      }),
    });

    const data: ApiExperience = await handleResponse(response);

    return {
      id: data.id,
      company: data.company,
      role: data.role,
      startDate: data.start_date,
      endDate: data.end_date || "Present",
      description: data.description,
      technologies: data.technologies,
    };
  },

  deleteExperience: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/profiles/experiences/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await handleResponse(response);
  },

  fetchSkills: async (token: string): Promise<SkillTheme[]> => {
    const response = await fetch(`${API_URL}/skills/skill-list/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  fetchTracks: async (token: string): Promise<Track[]> => {
    const response = await fetch(`${API_URL}/skills/tracks/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  updateUserTracks: async (trackIds: string[], token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/skills/tracks/update/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        track_ids: trackIds,
      }),
    });

    await handleResponse(response);
  },

  updateSkillLevel: async (
    subCategoryId: string,
    level: number,
    token: string
  ): Promise<void> => {
    const response = await fetch(`${API_URL}/skills/update/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sub_category_id: subCategoryId,
        level,
      }),
    });

    await handleResponse(response);
  },
};
