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

const Button = ({ img, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative flex max-h-[20rem] min-h-[7rem] w-full max-w-[20rem] items-end justify-center rounded-[2rem] bg-gray-600/20
       px-5 pb-5 transition hover:scale-110 lg:h-[8rem]"
    >
      <img
        src={img}
        alt="icon"
        className="absolute -top-8 h-[7rem] w-[7rem] object-contain lg:-top-16 lg:h-[10rem] lg:w-[10rem]"
      />
      <span className="font-productSansBlack relative top-2 text-white lg:text-2xl">
        {label}
      </span>
    </button>
  );
};

const FirstSection = () => {
  return (
    <div className="flex max-w-[40rem] flex-col items-center justify-center gap-5 p-10 md:mb-auto md:h-full md:py-0">
      <div className="font-productSansBlack flex items-center gap-5">
        <img
          src={DHSVU_LOGO}
          alt="logo"
          className="h-[7rem] w-[7rem] rounded-l-[0.625rem] rounded-r-[1.563rem] object-contain lg:h-[10rem] lg:w-[10rem]"
        />
        <div className="flex flex-col gap-1 ">
          <h1 className="text-3xl font-bold  text-white lg:text-6xl">
            DHVCHAT
          </h1>
          <h2 className="text-white/70 lg:text-2xl">AI Chat Assistant</h2>
        </div>
      </div>
      <p className="w-fit rounded-t-[1.875rem] rounded-br-[1.875rem] bg-black/30 p-5 font-bold text-white/70 lg:w-full lg:text-2xl">
        Your Intelligent University Admission Assistant On The Go!
      </p>
    </div>
  );
};

const SecondSection = () => {
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [signUpModalIsOpen, setSignUpModalIsOpen] = useState(false);

  return (
    <>
      <Login isOpen={loginModalIsOpen} setIsOpen={setLoginModalIsOpen} />
      <SignUp isOpen={signUpModalIsOpen} setIsOpen={setSignUpModalIsOpen} />

      <div
        className="flex h-full w-full flex-col items-center justify-center rounded-t-[3rem]
bg-black/30 shadow-2xl shadow-black md:h-fit md:max-w-[25rem] md:rounded-b-[3rem] md:py-10 lg:h-[40rem] lg:max-w-[35rem]"
      >
        <div className="max-w-[20rem]. flex w-full flex-col gap-5 p-5 lg:gap-14 lg:p-10">
          <div className="flex w-full items-center justify-center gap-10">
            <a
              href="https://www.facebook.com/dhvsuofficeofadmissions"
              target="_blank"
              rel="noreferrer"
              className="w-full"
            >
              <Button img={TRY_CHAT} label={"Facebook"} onClick={() => {}} />
            </a>
            <Button
              img={FORM}
              label={"Sign up"}
              onClick={() => setSignUpModalIsOpen(true)}
            />
          </div>
          <button
            className=" font-productSansBlack flex min-h-[7rem] w-full items-center  justify-center
 rounded-[2rem] bg-gray-600/20 transition hover:scale-110"
          >
            <div className="relative right-10 w-[50%]">
              <div className="relative left-3 flex flex-col gap-1">
                <h1 className="text-2xl text-white">About Us!</h1>
                <span className="text-white/70">Learn about the creators</span>
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
            className="font-productSansBlack w-full rounded-[2rem] bg-gray-600/20 py-5 text-[#BEBAE5CC] transition hover:scale-110 lg:text-3xl"
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
};

function LandingPage() {
  const nav = useNavigate();
  const { isLoading } = useSession();
  const [signUpModalIsOpen, setSignUpModalIsOpen] = useState(false);

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#2D354B]">
        <LoadingSpinner />
      </div>
    );

  return (
    <>
      <div className="h-screen">
        <div className="relative h-full w-full overflow-hidden">
          <div className="h-full bg-primary/90 backdrop-blur-2xl backdrop-filter  md:flex md:items-center md:justify-center ">
            <div className="flex h-full w-full flex-col items-center md:h-fit md:flex-row md:justify-center md:p-5 lg:gap-24">
              <FirstSection />
              <SecondSection />
            </div>
          </div>
          <div className="absolute -right-28 bottom-0 -z-10 h-[20rem] w-[20rem] rounded-full bg-[#37243E] lg:-bottom-[10rem] lg:h-[50rem] lg:w-[50rem]" />
          <div className="absolute -left-28 -top-48 -z-10 h-[20rem] w-[20rem] rounded-full bg-[#37243E] lg:-top-[30rem] lg:h-[50rem] lg:w-[50rem]" />
          <div className="absolute -bottom-[30rem] -z-10 h-[50rem] w-[60rem] rounded-full bg-[#37243E]" />
          <div
            className="absolute bottom-0 left-20 hidden h-[20rem] w-[50rem] rounded-tl-[10rem] rounded-tr-[20rem] bg-gray-600/20
         shadow-2xl shadow-black 2xl:block"
          />
        </div>
      </div>
    </>
  );
}

export default LandingPage;
