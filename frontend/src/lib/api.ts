const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('pitchforge_token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }

  // Auth endpoints
  async signIn(email: string, password: string) {
    return this.request<{ user: any; token: string }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signUp(name: string, email: string, password: string, role: string) {
    return this.request<{ user: any; token: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  }

  async signOut() {
    return this.request('/auth/signout', {
      method: 'POST',
    });
  }

  // Project Briefs
  async getProjectBriefs() {
    return this.request<{ data: any[]; count: number }>('/project-briefs');
  }

  async getProjectBrief(id: string) {
    return this.request<{ data: any }>(`/project-briefs/${id}`);
  }

  async createProjectBrief(briefData: any) {
    return this.request<{ data: any; message: string }>('/project-briefs', {
      method: 'POST',
      body: JSON.stringify(briefData),
    });
  }

  async updateProjectBrief(id: string, briefData: any) {
    return this.request<{ data: any; message: string }>(`/project-briefs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(briefData),
    });
  }

  async deleteProjectBrief(id: string) {
    return this.request<{ message: string }>(`/project-briefs/${id}`, {
      method: 'DELETE',
    });
  }

  async getBriefStats() {
    return this.request<{ data: any }>('/project-briefs/stats/overview');
  }

  // Case Studies
  async getCaseStudies() {
    return this.request<{ data: any[] }>('/case-studies');
  }

  async getCaseStudy(id: string) {
    return this.request<{ data: any }>(`/case-studies/${id}`);
  }

  async createCaseStudy(caseStudyData: any) {
    return this.request<{ data: any; message: string }>('/case-studies', {
      method: 'POST',
      body: JSON.stringify(caseStudyData),
    });
  }

  async updateCaseStudy(id: string, caseStudyData: any) {
    return this.request<{ data: any; message: string }>(`/case-studies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(caseStudyData),
    });
  }

  async deleteCaseStudy(id: string) {
    return this.request<{ message: string }>(`/case-studies/${id}`, {
      method: 'DELETE',
    });
  }

  // Solution Pitches
  async getSolutionPitches() {
    return this.request<{ data: any[] }>('/solution-pitches');
  }

  async getSolutionPitch(id: string) {
    return this.request<{ data: any }>(`/solution-pitches/${id}`);
  }

  async createSolutionPitch(pitchData: any) {
    return this.request<{ data: any; message: string }>('/solution-pitches', {
      method: 'POST',
      body: JSON.stringify(pitchData),
    });
  }

  async updateSolutionPitch(id: string, pitchData: any) {
    return this.request<{ data: any; message: string }>(`/solution-pitches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pitchData),
    });
  }

  async deleteSolutionPitch(id: string) {
    return this.request<{ message: string }>(`/solution-pitches/${id}`, {
      method: 'DELETE',
    });
  }

  // Users
  async getUsers() {
    return this.request<{ data: any[] }>('/users');
  }

  async getUser(id: string) {
    return this.request<{ data: any }>(`/users/${id}`);
  }

  async updateUser(id: string, userData: any) {
    return this.request<{ data: any; message: string }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // File upload
  async uploadFile(file: File, type: 'brief' | 'case-study' | 'pitch') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const token = localStorage.getItem('pitchforge_token');
    
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Parse brief content
  async parseBriefContent(content: string) {
    return this.request<{ data: any }>('/parse-brief', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Generate solution pitch
  async generateSolutionPitch(briefId: string, caseStudyIds?: string[]) {
    return this.request<{ data: any }>('/generate-pitch', {
      method: 'POST',
      body: JSON.stringify({ briefId, caseStudyIds }),
    });
  }

  // Get recommendations
  async getCaseStudyRecommendations(briefId: string) {
    return this.request<{ data: any[] }>(`/case-studies/recommendations/${briefId}`);
  }
}

export const apiService = new ApiService();
export default apiService; 