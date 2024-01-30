import { FC } from "react";
import {
  $email,
  emailChanged,
  formSubmitted,
  $pending,
  $error,
  SignInError,
} from "./model";
import { useUnit } from "effector-react";

export const LoginForm: FC = () => {
  const [email, pending, error] = useUnit([$email, $pending, $error]);
  const [handleEmail, handleSubmit] = useUnit([emailChanged, formSubmitted]);

  return (
    <div>
      <input
        type="text"
        name="email"
        value={email}
        placeholder="Enter your email"
        onChange={(event) => handleEmail(event.target.value)}
      />
      <button onSubmit={() => handleSubmit()} disabled={pending}>
        {pending ? <div>loading...</div> : <div>submit</div>}
      </button>
      <div>{error ? errorText[error] : null}</div>
    </div>
  );
};

const errorText: { [key in SignInError]: React.ReactNode } = {
  InvalidEmail: "Must be a valid email address",
  UnknownError: "Something wrong happened. Please, try again",
};
