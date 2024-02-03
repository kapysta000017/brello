import { api } from "@/shared/api";
import { attach, createEvent, createStore, sample } from "effector";
import { not } from "patronum";

export type SignInError = "InvalidEmail" | "UnknownError" | "RateLimit";

const singInFx = attach({ effect: api.auth.signInWithEmailFx });

export const formSubmitted = createEvent();
export const emailChanged = createEvent<string>();
export const backToLoginClicked = createEvent();

export const $email = createStore("");
export const $error = createStore<SignInError | null>(null); // описание ошибки через литерал
export const $pending = singInFx.pending;
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

sample({
  clock: formSubmitted,
  source: { email: $email },
  filter: $isEmailValid,
  target: [singInFx],
});

$finished.on(singInFx.done, () => true);
// $error.reset(singInFx); сбрасывать ошибку лучше на submit

sample({
  clock: formSubmitted,
  filter: not($isEmailValid),
  fn: (): SignInError => "InvalidEmail",
  target: $error,
});

// 3.2 failed to send email -> 1
$error.on(singInFx.failData, (_, error) => {
  if (error?.status === 429) {
    return "RateLimit";
  }
  return "UnknownError";
});

// login finished
sample({
  clock: backToLoginClicked,
  target: [$finished.reinit, $email.reinit, $error.reinit],
});
