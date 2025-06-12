export const A4_DIMENSIONS = {
  width: 794, // 210mm at 96 DPI
  height: 1123, // 297mm at 96 DPI
  marginX: 35, // Left/Right padding
  marginTop: 28, // Top padding
  marginBottom: 40, // Bottom padding
  contentWidth: 724, // 794 - (2 * 35)
  contentHeight: 1055, // 1123 - 28 - 40
} as const;

export const DEFAULT_RESUME = {
  personalInfo: {
    name: '',
    email: '',
    linkedin: '',
    portfolio: '',
  },
  experience: [],
  education: {
    institution: '',
    degree: '',
    duration: '',
    gpa: '',
  },
  leadership: [],
  awards: [],
  skills: {
    technical: [],
    soft: [],
  },
};