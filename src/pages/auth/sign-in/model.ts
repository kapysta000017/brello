import { api } from "@/shared/api";
import { attach, createEvent, createStore, sample } from "effector";
import { not } from "patronum";

export type SignInError = "InvalidEmail" | "UnknownError" | "RateLimit";

const signInFx = attach({ effect: api.auth.signInWithEmailFx });

export const formSubmitted = createEvent();
export const emailChanged = createEvent<string>();
export const backToLoginClicked = createEvent();

export const $email = createStore("");
export const $error = createStore<SignInError | null>(null); // описание ошибки через литерал
export const $pending = signInFx.pending;
export const $finished = createStore(false);

$email.on(emailChanged, (_, email) => email);

const $isEmailValid = $email.map(
  (email) => email.length > 5 && email.includes("@") && email.includes("."), // filter валидации
);

sample({
  clock: formSubmitted,
  source: { email: $email },
  filter: $isEmailValid,
  target: [signInFx], // {email: any} аргумент singInFx
});

sample({
  clock: formSubmitted,
  filter: not($isEmailValid),
  fn: (): SignInError => "InvalidEmail",
  target: $error,
});

$finished.on(signInFx.done, () => true); // флаг {finished ? <LoginSucceded /> : <LoginForm />}

$error.on(signInFx.failData, (_, error) => {
  if (error?.status === 429) {
    return "RateLimit";
  }
  return "UnknownError";
});

sample({
  clock: backToLoginClicked,
  target: [$email.reinit, $error.reinit, $finished.reinit], // $finished.reinit вызовет LoginForm
});
