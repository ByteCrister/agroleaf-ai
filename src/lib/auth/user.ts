// lib/auth/user.ts
import bcrypt from "bcryptjs";
import { db } from "@/config/firebase-admin";

export interface UserData {
  email: string;
  passwordHash: string;
  name?: string | null;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Creates a new user with a hashed password
 * @param email - User's email (used as document ID)
 * @param password - Plain text password (will be hashed)
 * @param name - Optional display name
 * @param image - Optional avatar URL
 */
export async function createUser(
  email: string,
  password: string,
  name?: string | null,
  image?: string | null,
): Promise<void> {
  const userRef = db.collection("users").doc(email.toLowerCase());
  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();

  await userRef.set({
    email: email.toLowerCase(),
    passwordHash,
    name: name || null,
    image: image || null,
    createdAt: now,
    updatedAt: now,
  });
}

/**
 * Checks if a user exists by email
 * @returns User document ID (email) if exists, null otherwise
 */
export async function findUserByEmail(email: string): Promise<string | null> {
  const userRef = db.collection("users").doc(email.toLowerCase());
  const snap = await userRef.get();
  return snap.exists ? snap.id : null;
}

/**
 * Retrieves full user data by email
 */
export async function getUserData(email: string): Promise<UserData | null> {
  const userRef = db.collection("users").doc(email.toLowerCase());
  const snap = await userRef.get();
  return snap.exists ? (snap.data() as UserData) : null;
}

/**
 * Verifies a user's password
 * @returns true if credentials match
 */
export async function verifyPassword(
  email: string,
  password: string,
): Promise<boolean> {
  const userRef = db.collection("users").doc(email.toLowerCase());
  const snap = await userRef.get();
  if (!snap.exists) return false;
  const data = snap.data() as UserData;
  return bcrypt.compare(password, data.passwordHash);
}

/**
 * Updates a user's password
 */
export async function updatePassword(
  email: string,
  newPassword: string,
): Promise<void> {
  const userRef = db.collection("users").doc(email.toLowerCase());
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await userRef.update({
    passwordHash,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Creates a user with a random password (for "Sign up with email" flow)
 * @returns The generated random password (you may email it or require reset)
 */
export async function createUserWithRandomPassword(
  email: string,
  name?: string | null,
  image?: string | null,
): Promise<string> {
  const randomPassword =
    Math.random().toString(36).slice(-12) +
    Math.random().toString(36).slice(-12);
  await createUser(email.toLowerCase(), randomPassword, name, image);
  return randomPassword;
}