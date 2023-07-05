import { useEffect } from "react";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { useForgotPasswordMutation } from "../slices/userApiSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Commen/Loader";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
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
  }, [navigate, userInfo]);

  const onSubmit = async ({ email }) => {
    try {
      await forgotPassword({ email }).unwrap();
      navigate("/message");
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

export default ForgotPassword;
