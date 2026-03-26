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
}

export interface PlacementDrive {
  id: string;
  companyName: string;
  roleName: string;
  jobDescription: string;
  ctc: string;
  minCGPA: number;
  eligibleBranches: string;
  driveDate: string;
  driveType: string;
  status: string;
  isRegistered?: boolean;
}

export interface DriveRegistration {
  id: string;
  drive: PlacementDrive;
  attended: boolean;
}

export interface Memory {
  id: string;
  imageUrl: string;
  status: string;
}
