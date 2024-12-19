import { CORPORATE_STORAGE_STATE, SAGE_STORAGE_STATE, PROF_STORAGE_STATE } from '../../playwright.config';

export type Credentials = {
  email: string;
  password: string;
  storageState?: string;
};

export const credentials = {
  corporate: {
    email: process.env.CORPORATE_EMAIL!,
    password: process.env.CORPORATE_PASSWORD!,
    storageState: CORPORATE_STORAGE_STATE
  },
  sage: {
    email: process.env.SAGE_EMAIL!,
    password: process.env.SAGE_PASSWORD!,
    storageState: SAGE_STORAGE_STATE
  },
  professor: {
    email: process.env.PROFESSOR_EMAIL!,
    password: process.env.PROFESSOR_PASSWORD!,
    storageState: PROF_STORAGE_STATE
  },
  student: {
    email: process.env.STUDENT_EMAIL!,
    password: process.env.STUDENT_PASSWORD!
  },
  member: {
    email: process.env.MEMBER_EMAIL!,
    password: process.env.MEMBER_PASSWORD!
  }
} as const;

export type UserType = keyof typeof credentials;