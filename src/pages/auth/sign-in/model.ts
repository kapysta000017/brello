import { createEvent, createStore, sample } from "effector";

export type SignInError = "InvalidEmail" | "UnknownError";

export const formSubmitted = createEvent();
export const emailChanged = createEvent<string>();
export const backToLoginPressed = createEvent();

export const $email = createStore("");
export const $error = createStore<SignInError | null>("InvalidEmail"); // описание ошибки через литерал
export const $pending = createStore(false);
export const $finished = createStore(false);

const $isEmailValid = $email.map(
  (email) => email.length > 5 && email.includes("@") && email.includes("."),
);

$email.on(emailChanged, (_, email) => email);

// 1. enters email
// 2. validate email
// 3. send email (request to server)
// 4. finish screen

// 2.1 email invalid -> 1

// 3.1 email sent -> 1
// 3.2 failed to send email -> 1
