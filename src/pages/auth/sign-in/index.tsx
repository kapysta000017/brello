import { FC } from "react";
import {
  $email,
  emailChanged,
  formSubmitted,
  $pending,
  $error,
  SignInError,
  $finished,
  backToLoginClicked,
} from "./model";
import { useUnit } from "effector-react";

const LoginForm: FC = () => {
  const [email, pending, error] = useUnit([$email, $pending, $error]);
  const [handleEmail, handleSubmit] = useUnit([emailChanged, formSubmitted]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <input
        type="text"
        name="email"
        value={email}
        placeholder="Enter your email"
        onChange={(event) => handleEmail(event.target.value)}
      />
      <button disabled={pending}>{pending ? "loading..." : "submit"}</button>
      <div>{error ? errorText[error] : null}</div>
    </form>
  );
};

const errorText: { [key in SignInError]: React.ReactNode } = {
  InvalidEmail: "Must be a valid email address",
  UnknownError: "Something wrong happened. Please, try again",
  RateLimit: "To much request. Please, try again",
};

export const SignInPage = () => {
  const finished = useUnit($finished);

  return (
    <main>
      стартовый компонент SignInPage
      <section style={{ marginTop: "20px" }}>
        {finished ? <LoginSucceded /> : <LoginForm />}
      </section>
    </main>
  );
};

const LoginSucceded: FC = () => {
  const [email, handleBack] = useUnit([$email, backToLoginClicked]);

  return (
    <>
      <h1>Check your email</h1>
      <p>
        We sent a login link to <span>{email}</span>
      </p>
      <button onClick={() => handleBack()}>Back to login</button>
    </>
  );
};
