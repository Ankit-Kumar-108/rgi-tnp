
// Course to semester mapping
export const COURSE_SEMESTER_MAP: Record<string, number> = {
  "B.Tech": 8,
  "Diploma": 6,
  "MBA": 4,
  // Add more courses as needed
};

// Default for backward compatibility
export const MAX_SEMESTERS = 8;

export const getMaxSemestersForCourse = (course: string): number => {
  return COURSE_SEMESTER_MAP[course] || MAX_SEMESTERS;
};

export const getSemesterOptions = (course?: string): number[] => {
  const maxSems = course ? getMaxSemestersForCourse(course) : MAX_SEMESTERS;
  return Array.from({ length: maxSems }, (_, i) => i + 1);
};

export const BATCH_YEARS_AHEAD = 4;

export const getBatchYears = (): number[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: BATCH_YEARS_AHEAD }, (_, i) => currentYear + i);
};

export const COURSE_DURATION_YEARS = 4;

export const COURSE_DURATION_SEMESTERS = COURSE_DURATION_YEARS * 2;

export const isPassout = (course: string, semester: number): boolean => {
  const maxSems = getMaxSemestersForCourse(course);
  return semester >= maxSems;
};
