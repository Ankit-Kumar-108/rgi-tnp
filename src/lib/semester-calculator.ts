import { MAX_SEMESTERS, COURSE_DURATION_YEARS, getMaxSemestersForCourse } from "./constants";

/**
 * @param passingYear - The year student will pass out
 * @param course - The course (B.Tech, Diploma, MBA, etc.)
 * @returns Current semester (based on course duration)
 */
export function calculateCurrentSemester(passingYear: number, course?: string): number {
    const admissionYear = passingYear - COURSE_DURATION_YEARS;
    const currentYear = new Date().getFullYear();
    const monthElapsed = new Date().getMonth() + 1; // getMonth is 0-indexed
    const semester = Math.ceil(monthElapsed / 6); // 1-6 months = sem 1, 7-12 months = sem 2
    const yearsElapsed = currentYear - admissionYear;
    const currentSemester = yearsElapsed * 2 + semester;
    const maxSemesters = course ? getMaxSemestersForCourse(course) : MAX_SEMESTERS;
    const maxSemester = currentSemester > maxSemesters ? maxSemesters : currentSemester;
    return maxSemester;
}