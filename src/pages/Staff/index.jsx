import { Icon } from "@iconify/react";
import React, { useState } from "react";
import SideBar from "../../components/staff/SideBar";
import Home from "./pages/home";
import KnowledgeFeeder from "./pages/KnowledgeFeeder";
import RedirectedInquiries from "./pages/RedirectedInquiries";
import Analytics from "./pages/Analytics";
import AccountSettings from "./pages/AccountSettings";
import MenuModal from "../../components/staff/MenuModal";
import useDarkMode from "../../hooks/useDarkMode";

function Staff() {
  const [value, setValue] = useState("home");
  const [isOpenModalMenu, setIsOpenModalMenu] = useState(false);
  const { handleToggle, isDark } = useDarkMode();

  let renderComponent = <Home />;

  const handleNav = name => setValue(name);
  const openModalMenu = () => setIsOpenModalMenu(true);
  const closeModalMenu = () => setIsOpenModalMenu(false);

  switch (value) {
    case "home":
      renderComponent = <Home handleNav={handleNav} />;
      break;
    case "knowledge-feeder":
      renderComponent = <KnowledgeFeeder />;
      break;
    case "redirected-inquiries":
      renderComponent = <RedirectedInquiries />;
      break;
    case "analytics":
      renderComponent = <Analytics />;
      break;
    case "account-settings":
      renderComponent = <AccountSettings />;
      break;
    default:
      renderComponent = <Home />;
  }

  return (
    <>
      {/* <div className="flex h-screen w-full flex-col items-center justify-center gap-5 bg-[#3F4B69]  text-white lg:hidden">
        <span>Mobile View is not available 🫠</span>
        <button
          className="w-[100px] rounded-md bg-white p-2 text-[#3F4B69]"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </div> */}
      <MenuModal
        closeModal={closeModalMenu}
        isOpen={isOpenModalMenu}
        navigateTo={handleNav}
      />
      <div className="h-fit bg-blue-500 duration-200 dark:bg-gradient-to-t dark:from-[#37243E] dark:to-[#3F4B69]  lg:h-screen ">
        <div className="h-full items-center gap-5 bg-white/50 p-5 dark:bg-transparent lg:flex">
          <SideBar value={value} setValue={setValue} />
          <div className="flex w-full items-center justify-between p-5 lg:hidden">
            <Icon
              icon={"ci:hamburger-md"}
              onClick={openModalMenu}
              className="rounded-full bg-white/80 p-1 text-3xl"
            />
            <div className="">
              <h1 className="font-productSansBlack text-2xl text-white/80">
                Dashboard
              </h1>
            </div>
            <Icon
              onClick={handleToggle}
              icon={isDark ? "entypo:light-up" : "ic:round-dark-mode"}
              className="rounded-full bg-white/80 p-1 text-2xl"
            />
          </div>
          <div className="flex h-full w-full rounded-xl bg-white/40  p-5 backdrop-blur-sm dark:bg-white/10">
            {renderComponent}
          </div>
        </div>
      </div>
    </>
  );
}

export default Staff;
