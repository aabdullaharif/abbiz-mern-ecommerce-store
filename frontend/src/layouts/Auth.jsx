import {
  faEnvelope,
  faLock,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../components/Commen/Loader";

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const onSubmit = async ({ email, password }) => {
    try {
      const res = await login({ email, password }).unwrap();
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
          Login Now!
        </h2>

        <form className="max-w-lg m-auto" onSubmit={handleSubmit(onSubmit)}>
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
          <div className="input-group mb-10">
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
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <p role="alert">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full uppercase text-center bg-teal-950 hover:bg-teal-600 py-2 text-white rounded"
          >
            Sign in
          </button>

          <div className="pt-4 text-sm">
            <FontAwesomeIcon
              icon={faRightToBracket}
              size="lg"
              className="mr-3"
            />
            Don't Remember your Password?{" "}
            <Link to="/password/forgot" className="underline">
              Forgot Password
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Auth;
