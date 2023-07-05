import React from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <>
      <h2 className="text-center text-3xl py-5">
        Welcome {userInfo?.user?.name}!
      </h2>
    </>
  );
};

export default Home;
