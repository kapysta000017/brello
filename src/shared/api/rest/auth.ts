import { client } from "@/shared/api/client";
import { SITE_URL } from "@/shared/config";
import { AuthError } from "@supabase/supabase-js";
import { createEffect } from "effector";

export type Email = string;
export type UserId = Uuid;

export interface User {
  id: UserId;
  email: Email;
}

const checkError = (error: AuthError | null) => {
  throw error;
};

export const signInWithEmail = createEffect<{ email: Email }, void, AuthError>(
  async ({ email }) => {
    const { error } = await client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: SITE_URL }, // редирект после singIn
    });

    checkError(error);
  },
);

export const getMe = createEffect<void, User | null, AuthError>(async () => {
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  checkError(error);

  if (user) {
    return {
      id: user.id as string,
      email: user.email as string,
    };
  }

  return null;
});

export const singOut = createEffect<void, void, AuthError>(async () => {
  const { error } = await client.auth.signOut();

  checkError(error);
});
