/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../../components/auth/Login";
import SignUp from "../../components/auth/SignUp";
import DHSVU_LOGO from "../../assets/images/dabchatlogo.png";
import TRY_CHAT from "../../assets/images/convo.png";
import FORM from "../../assets/images/form.png";
import AVATAR from "../../assets/images/Avatar.png";
import useSession from "../../hooks/useSession";
import LoadingSpinner from "../../components/LoadingSpinner";
import AboutUsModal from "../../components/AboutUsModal";
import useDarkMode from "../../hooks/useDarkMode";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { ToastContainer, toast } from "react-toastify";
import ForgotPassword from "../../components/auth/ForgotPassword";

const Button = ({ img, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative flex max-h-[20rem] min-h-[7rem] w-full max-w-[20rem] items-end justify-center rounded-[2rem] bg-white/30 px-5 pb-5
       shadow-md transition hover:scale-110 dark:bg-gray-600/20 lg:h-[8rem]"
    >
      <img
        src={img}
        alt="icon"
        className="absolute -top-8 h-[7rem] w-[7rem] object-contain lg:-top-16 lg:h-[10rem] lg:w-[10rem]"
      />
      <span className="relative top-2 font-productSansBlack text-black/60 dark:text-white lg:text-2xl">
        {label}
      </span>
    </button>
  );
};

const FirstSection = () => {
  return (
    <div className="flex max-w-[40rem] flex-col items-center justify-center gap-5 p-10 md:mb-auto md:h-full md:py-0">
      <div className="flex items-center gap-5 font-productSansBlack">
        <img
          src={DHSVU_LOGO}
          alt="logo"
          className="h-[7rem] w-[7rem] rounded-r-full rounded-bl-[3000px] rounded-tl-full object-contain shadow lg:h-[10rem] lg:w-[10rem]"
        />
        <div className="flex flex-col gap-1 ">
          <h1 className="text-3xl font-bold text-black/60 dark:text-white lg:text-6xl">
            DHVCHAT
          </h1>
          <h2 className="text-black/50 dark:text-white/70 lg:text-2xl">
            AI Chat Assistant
          </h2>
        </div>
      </div>
      <p className="w-fit rounded-t-[1.875rem] rounded-br-[1.875rem] bg-white/60 p-5 pr-2 font-bold text-black/50 dark:bg-black/30 dark:text-white/70 lg:w-full lg:text-2xl">
        Your Intelligent University Admission Assistant On The Go!
      </p>
    </div>
  );
};

const SecondSection = () => {
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [signUpModalIsOpen, setSignUpModalIsOpen] = useState(false);
  const [aboutUsModal, setAboutUsModal] = useState(false);
  const [forgotPasswordModal, setforgotPassword] = useState(false);
  const nav = useNavigate();

  return (
    <>
      <ToastContainer />
      <Login
        isOpen={loginModalIsOpen}
        setIsOpen={setLoginModalIsOpen}
        setPasswordModal={setforgotPassword}
      />
      <SignUp isOpen={signUpModalIsOpen} setIsOpen={setSignUpModalIsOpen} />
      <AboutUsModal isOpen={aboutUsModal} setIsOpen={setAboutUsModal} />
      <ForgotPassword
        toast={toast}
        isOpen={forgotPasswordModal}
        setIsOpen={setforgotPassword}
        setIsOpenLogin={setLoginModalIsOpen}
      />
      <div
        className="flex h-full w-full flex-col items-center justify-center rounded-t-[3rem]
bg-[#F8F8F875] shadow-2xl dark:bg-black/30 md:h-fit md:max-w-[25rem] md:rounded-b-[3rem] md:py-10 lg:h-[40rem] lg:max-w-[35rem]"
      >
        <div className="max-w-[20rem]. flex w-full flex-col gap-5 p-5 lg:gap-14 lg:p-10">
          <div className="flex w-full items-center justify-center gap-10">
            <Button
              img={TRY_CHAT}
              label={"Try Now!"}
              onClick={() => nav("/try")}
            />
            <Button
              img={FORM}
              label={"Sign up"}
              onClick={() => setSignUpModalIsOpen(true)}
            />
          </div>
          <button
            className=" flex min-h-[7rem] w-full items-center justify-center  rounded-[2rem]
 bg-white/30 font-productSansBlack shadow-md transition hover:scale-110 dark:bg-gray-600/20"
          >
            <div
              onClick={() => setAboutUsModal(true)}
              className="relative right-10 w-[50%]"
            >
              <div className="relative left-3 flex flex-col gap-1">
                <h1 className="text-2xl text-black/60 dark:text-white">
                  About Us!
                </h1>
                <span className="text-black/50 dark:text-white/70">
                  Learn about the creators
                </span>
              </div>
              <img
                src={AVATAR}
                alt="icon"
                className="absolute -right-28 -top-14 h-[10rem] w-[10rem] object-contain lg:-right-36 lg:-top-20 lg:h-[12rem] lg:w-[12rem]"
              />
            </div>
          </button>
          <button
            onClick={() => setLoginModalIsOpen(true)}
            className="w-full rounded-[2rem] bg-white/30 py-5 font-productSansBlack text-[#9A94D9] shadow-md transition hover:scale-110 dark:bg-gray-600/20 dark:text-[#BEBAE5CC] lg:text-3xl"
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
};

function LandingPage() {
  const { isLoading } = useSession();
  const { handleToggle, isDark } = useDarkMode();

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#2D354B] duration-200 dark:bg-white">
        <LoadingSpinner />
      </div>
    );

  return (
    <>
      <div className="h-screen">
        <div className="relative h-full w-full overflow-hidden">
          <div className="absolute -right-28 bottom-0 -z-10 h-[20rem] w-[20rem] rounded-full bg-pink-300 lg:-bottom-[10rem] lg:h-[50rem] lg:w-[50rem]" />
          <div className="absolute -left-28 -top-48 h-[20rem] w-[20rem] rounded-full bg-gray-400  dark:bg-[#37243E] lg:-top-[30rem] lg:h-[50rem] lg:w-[50rem]" />
          <div className="absolute -bottom-[30rem] -z-10 h-[50rem] w-[60rem] rounded-full bg-pink-300 dark:bg-[#37243E]" />
          <div className="h-full bg-blue-800/50 backdrop-blur-3xl backdrop-filter duration-200 dark:bg-primary/90 md:flex md:items-center md:justify-center ">
            <div className="flex h-full w-full flex-col items-center md:h-fit md:flex-row md:justify-center md:p-5 lg:gap-24">
              <button onClick={() => handleToggle()}>
                <Icon
                  icon={isDark ? "entypo:light-up" : "ic:round-dark-mode"}
                  className={clsx(
                    isDark ? "text-white" : "text-black/60",
                    "absolute right-0 top-0 m-5 cursor-pointer text-2xl"
                  )}
                />
              </button>
              <FirstSection />
              <SecondSection />
            </div>
          </div>
          <div
            className="absolute bottom-0 left-20 hidden h-[20rem] w-[50rem] rounded-tl-[10rem] rounded-tr-[20rem] bg-[#F8F8F875] shadow-2xl
         shadow-black dark:bg-gray-600/20 2xl:block"
          />
        </div>
      </div>
    </>
  );
}

export default LandingPage;
