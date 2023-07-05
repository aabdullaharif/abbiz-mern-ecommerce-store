import { useEffect } from "react";
import {
  faEnvelope,
  faLock,
  faSignature,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setCredentials } from "../slices/authSlice";
import { useRegisterUserMutation } from "../slices/userApiSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "../components/Commen/Loader";

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [registerUser, { isLoading }] = useRegisterUserMutation();

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

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const onSubmit = async ({ name, email, password }) => {
    try {
      const res = await registerUser({ name, email, password }).unwrap();
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
          Register Now!
        </h2>

        <form className="max-w-lg m-auto" onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group mb-4">
            <label className="mb-3 inline-block">
              <FontAwesomeIcon
                icon={faSignature}
                bounce
                size="lg"
                className="mr-3"
              />
              Name
            </label>
            <input
              className="border outline-none w-full py-2 px-3 rounded"
              placeholder="Enter your name"
              type="text"
              {...register("name", { required: true, minLength: 5 })}
            />
            {errors.name && <p role="alert">Name is required</p>}
          </div>
          <div className="input-group mb-4">
            <label className="mb-3 inline-block">
              <FontAwesomeIcon
                icon={faEnvelope}
                bounce
                size="lg"
                className="mr-3"
              />
              Email
            </label>
            <input
              className="border outline-none w-full py-2 px-3 rounded"
              placeholder="Enter your email"
              type="email"
              {...register("email", { required: "Email Address is required" })}
            />
            {errors.email && <p role="alert">{errors.email?.message}</p>}
          </div>
          {/* <div className="input-group mb-4">
            <label className="mb-3 inline-block">
              <FontAwesomeIcon
                bounce
                size="lg"
                className="mr-3"
                icon={faUser}
              />
              Avatar
            </label>
            <input
              className="border outline-none w-full py-2 px-3 rounded"
              type="file"
              {...register("file")}
              name="avatar"
              accept="image/*"
            />
            {errors.file && <p role="alert">{errors.file.message}</p>}
          </div> */}
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
              placeholder="Enter your password"
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
              placeholder="Enter your confirm password"
              type="password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p role="alert">{errors.confirmPassword.message}</p>
            )}
          </div>
          <input
            type="submit"
            value="Register"
            className="w-full uppercase text-center bg-teal-950 hover:bg-teal-600 py-2 text-white rounded"
          />
          <div className="pt-4 text-sm">
            <FontAwesomeIcon
              icon={faRightToBracket}
              size="lg"
              className="mr-3"
            />
            Already have a Account?{" "}
            <Link to="/auth" className="underline">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegisterPage;
