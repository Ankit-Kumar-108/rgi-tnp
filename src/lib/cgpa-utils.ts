export function normalizeAcademicScoreToCgpa(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return null;
  }

  return numericValue > 10 ? numericValue / 10 : numericValue;
}

export function meetsCgpaCriteria(
  candidateScore: number | string | null | undefined,
  minimumCgpa: number | string | null | undefined,
) {
  const candidateCgpa = normalizeAcademicScoreToCgpa(candidateScore);
  const requiredCgpa = normalizeAcademicScoreToCgpa(minimumCgpa);

  if (requiredCgpa === null || requiredCgpa <= 0) {
    return true;
  }

  if (candidateCgpa === null) {
    return false;
  }

  return candidateCgpa >= requiredCgpa;
}

export function formatCgpaCriteria(value: number | string | null | undefined) {
  const cgpa = normalizeAcademicScoreToCgpa(value);
  return cgpa === null ? "0" : cgpa.toFixed(2).replace(/\.?0+$/, "");
}
