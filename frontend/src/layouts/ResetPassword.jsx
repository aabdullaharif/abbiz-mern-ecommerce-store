import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { setCredentials } from "../slices/authSlice";
import { useDispatch } from "react-redux";
import {
  useResetPasswordMutation,
  useGetResetPasswordMutation,
} from "../slices/userApiSlice";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "../components/Commen/Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  // const [getResetPassword] = useGetResetPasswordMutation();

  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  useEffect(() => {});

  const onSubmit = async ({ password, confirmPassword }) => {
    try {
      const res = await resetPassword({ password, confirmPassword }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="px-4 pt-8 container">
        <h2 className="text-3xl uppercase mb-12 text-center font-bold">
          Forgot Your Password?
        </h2>

        <form className="max-w-lg m-auto" onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group mb-4">
            <label className="mb-3 inline-block">
              <FontAwesomeIcon
                icon={faLock}
                bounce
                size="lg"
                className="mr-3"
              />
              Password
            </label>
            <input
              className="border outline-none w-full py-2 px-3 rounded"
              placeholder="Enter New Password"
              type="password"
              {...register("password")}
            />
            {errors.password && <p role="alert">{errors.password.message}</p>}
          </div>
          <div className="input-group mb-10">
            <label className="mb-3 inline-block">
              <FontAwesomeIcon
                icon={faLock}
                bounce
                size="lg"
                className="mr-3"
              />
              Confirm Password
            </label>
            <input
              className="border outline-none w-full py-2 px-3 rounded"
              placeholder="Enter New Confirm Password"
              type="password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p role="alert">{errors.confirmPassword.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full uppercase text-center bg-teal-950 hover:bg-teal-600 py-2 text-white rounded"
          >
            Forgot
          </button>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
