import {useEffect} from "react";
import {Link, useNavigate, useSearchParams} from "react-router";
import { ChevronLeftIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import {UseResetPassword} from "../../hooks/useResetPassword.ts";

export default function ResetPasswordForm() {
  const navigate = useNavigate()
  const { handleSubmit, password, setPassword, setToken, loading } = UseResetPassword(navigate)
  const [searchParams] = useSearchParams();
  useEffect(() => {
    setToken(searchParams.get("token") || "");
  }, [searchParams.get("token")]);
  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Reset Password
            </h1>
          </div>
          <div>
            <form onSubmit={(event) => {
              handleSubmit(event)
            }}>
              <div className="space-y-5">
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <Input
                      type="password"
                      id="password"
                      name="passowrd"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                  />
                </div>
                <div>
                  <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                    Reset Password
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account? {""}
                <Link
                    to="/signin"
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
