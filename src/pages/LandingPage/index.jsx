import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../../components/auth/login";
import SignUp from "../../components/auth/Signup";

function LandingPage() {
  const nav = useNavigate();
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [signUpModalIsOpen, setSignUpModalIsOpen] = useState(false);
  return (
    <>
      <Login isOpen={loginModalIsOpen} setIsOpen={setLoginModalIsOpen} />
      <SignUp isOpen={signUpModalIsOpen} setIsOpen={setSignUpModalIsOpen} />
      <div className="h-screen bg-[#2D354B] flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-4 w-[320px] pt-16">
          <div className="flex flex-col leading-8">
            <span className="text-white font-bold text-center text-[37px] font-productSansBlack">
              DHVChat
            </span>
            <span className="text-[20px] text-[#989BAE] font-productSansBlack">
              AI Chat Assistant
            </span>
          </div>
          <span className="font-bold rounded-[1.5rem] rounded-bl-none text-[#989BAE] text-sm bg-[#202535] p-5 font-productSansBlack">
            Your Intelligent University Admission Assistant On The Go!
          </span>
        </div>
        <div className="h-[60%] flex flex-col items-center justify-center gap-5 mt-auto rounded-t-[46px] bg-[#202534] w-full p-5 font-productSansBlack">
          <div className="flex-wrap flex justify-center gap-5">
            <button
              onClick={() => nav("/chat/try-now")}
              className="bg-[#353843] text-[#D7D7D9] font-bold rounded-[20px] p-5"
            >
              Try now
            </button>
            <button
              onClick={() => setSignUpModalIsOpen(true)}
              className=" bg-[#353843] text-[#D7D7D9] font-bold rounded-[20px] p-5"
            >
              Sign Up
            </button>
            <button
              onClick={() => {}}
              className=" bg-[#353843] text-[#D7D7D9] text-center font-bold rounded-[20px] flex flex-col p-5"
            >
              <span>About Us!</span>
              <span>Learn about the creators</span>
            </button>
          </div>
          <button
            onClick={() => setLoginModalIsOpen(true)}
            className=" bg-[#353843] text-[#D7D7D9] font-bold rounded-[20px] p-5 w-full"
          >
            Login In
          </button>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
