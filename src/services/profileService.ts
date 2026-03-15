import { UserProfile, Experience } from "../types";

// Type for the raw API response
interface ApiUserProfile {
  first_name: string;
  last_name: string;
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
    return {
      firstName: data.first_name || "",
      lastName: data.last_name || "",
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
        title: profile.title,
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

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }
  },

  fetchExperiences: async (token: string): Promise<Experience[]> => {
    const response = await fetch(`${API_URL}/profiles/experiences/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch experiences");
    }

    const data: ApiExperience[] = await response.json();

    return data.map((exp) => ({
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

    if (!response.ok) {
      throw new Error("Failed to add experience");
    }

    const data: ApiExperience = await response.json();

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

    if (!response.ok) {
      throw new Error("Failed to update experience");
    }

    const data: ApiExperience = await response.json();

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

    if (!response.ok) {
      throw new Error("Failed to delete experience");
    }
  },
};
