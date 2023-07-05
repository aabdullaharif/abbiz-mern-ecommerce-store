import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  faBars,
  faCartShopping,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { menuItems } from "../../utils/constants";
import logo from "../../assets/logo.png";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../slices/userApiSlice";
import Loader from "./Loader";
import { clearCredentials } from "../../slices/authSlice";
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout, { isLoading }] = useLogoutMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const handleHumburger = () => {
    setIsOpen(!isOpen);
  };
  const showHideClass = `lg:flex justify-between lg:w-2/3 menu-wrapper fixed top-0 inset-0 bg-slate-200 px-4 py-8 h-full w-2/3 lg:static lg:h-fit lg:block lg:bg-inherit lg:p-0 ${
    isOpen ? "" : "hidden"
  }`;

  const handleLogOut = async (e) => {
    e.preventDefault();
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <header className="px-8 py-4 flex justify-between items-center bg-cyan-200">
        <div className="lg:w-1/3">
          <Link to="/" className="logo w-40 inline-block">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <button type="button" className="lg:hidden" onClick={handleHumburger}>
          <FontAwesomeIcon size="xl" icon={faBars} />
        </button>
        <div className={showHideClass}>
          <nav className="nav">
            <ul className="navigation mb-8 lg:mb-0 lg:flex gap-20">
              {menuItems &&
                menuItems.map((item) => (
                  <li className="mb-2 lg:mb-0" key={item.id}>
                    <Link to={item.path}>{item.label}</Link>
                  </li>
                ))}
            </ul>
          </nav>

          <ul className="auth-btn flex gap-6 items-center">
            {userInfo?.user?.role === "admin" && (
              <li>
                <Link
                  to="/admin/dashboard"
                  className="w-full px-4 uppercase text-center bg-teal-950 hover:bg-teal-600 py-3 text-white rounded"
                >
                  Dashboard
                </Link>
              </li>
            )}
            {userInfo && (
              <li>
                <button
                  onClick={handleLogOut}
                  type="button"
                  className="w-full px-4 uppercase text-center bg-teal-950 hover:bg-teal-600 py-2 text-white rounded"
                >
                  Logout
                </button>
              </li>
            )}
            <li>
              <Link to="/cart">
                <FontAwesomeIcon size="lg" icon={faCartShopping} />
              </Link>
            </li>
            <li>
              <Link to="/register">
                <FontAwesomeIcon size="lg" icon={faUser} />
              </Link>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
};

export default Header;
