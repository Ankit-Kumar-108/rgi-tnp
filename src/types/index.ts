export interface Student {
  id: string;
  name: string;
  enrollmentNumber: string;
  email: string;
  branch: string;
  semester: number;
  cgpa: number;
  course: string;
  batch: string;
  phoneNumber: string;
  profileImageUrl?: string;
  resumeUrl?: string;
  memoriesImageUrl?: string;
  feedback?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  tenthPercentage?: number;
  twelfthPercentage?: number;
  activeBacklog?: number;
  isEmailVerified: boolean;
  isVerified: boolean;
  isProfileComplete?: boolean;
  role?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface PlacementDrive {
  id: string;
  companyName: string;
  roleName: string;
  jobDescription: string;
  ctc: string;
  minCGPA: number;
  jobType: string;
  minBatch: string;
  maxBatch: string;
  course: string;
  eligibleBranches: string;
  driveDate: string | Date;
  driveType: string;
  status: string;
  googleSheetUrl?: string;
  recruiterId?: string | null;
  recruiter?: Recruiter;
  isRegistered?: boolean;
}

export interface DriveRegistration {
  id: string;
  driveId: string;
  drive: PlacementDrive;
  studentId?: string;
  externalStudentId?: string;
  attended: boolean;
  status: string;
  createdAt?: string | Date;
}

export interface Memory {
  id: string;
  imageUrl: string;
  status: string;
  title: string;
  uploaderName: string;
  studentId: string;
  createdAt?: string | Date;
}

export interface Alumni {
  id: string;
  name: string;
  enrollmentNumber: string;
  personalEmail: string;
  isVerified: boolean;
  isProfileComplete: boolean;
  currentCompany?: string;
  profileImageUrl: string;
  jobTitle?: string;
  city?: string;
  country?: string;
  linkedInUrl?: string;
  phoneNumber?: string;
  branch: string;
  about?: string;
  batch: string;
  course: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ExternalStudent {
  id: string;
  name: string;
  collegeName: string;
  enrollmentNumber: string;
  email: string;
  branch: string;
  semester: number;
  cgpa: number;
  course: string;
  batch: string;
  phoneNumber: string;
  profileImageUrl: string;
  resumeUrl: string;
  feedback?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  tenthPercentage?: number;
  twelfthPercentage?: number;
  activeBacklog?: number;
  isVerified: boolean;
  role?: string;
}

export interface Recruiter {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  designation: string;
  company: string;
  role?: string;
}
