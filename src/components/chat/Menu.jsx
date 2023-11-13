import { Dialog, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";
import React, { Fragment } from "react";
import LOGO from "../../assets/images/dhvsu-logo.png";

const Menu = ({
  isOpen,
  setIsOpen,
  id,
  setMessageLoading,
  updateConversationHistory,
  setConversations,
  signOut,
  conversations,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        className=" absolute top-0 z-50 flex h-full w-full items-center justify-center"
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0  bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className="m-5 flex w-full max-w-[400px] flex-col gap-4 rounded-md bg-[#2D354B] p-4">
            <Dialog.Title className="font-productSansBlack text-center font-bold text-white">
              Menu
            </Dialog.Title>
            <div className="flex w-full flex-col gap-3">
              <a
                href="https://www.facebook.com/dhvsuofficeofadmissions"
                target="_blank"
                rel="noreferrer"
              >
                <button className="flex w-full items-center justify-center rounded-md bg-blue-500 p-4 text-white">
                  <Icon icon={"bi:facebook"} className="text-xl" />
                </button>
              </a>
              <a href="https://dhvsu.edu.ph/" target="_blank" rel="noreferrer">
                <button className="flex w-full items-center justify-center rounded-md bg-[#a6304d] p-4">
                  <img
                    src={LOGO}
                    alt="logo"
                    className="h-5 w-5 object-cover object-center"
                  />
                </button>
              </a>
              {conversations?.length > 0 ? (
                <button
                  onClick={async () => {
                    setMessageLoading(true);
                    await updateConversationHistory(id, {
                      conversation_history: [],
                    });
                    setConversations([]);
                    setMessageLoading(false);
                  }}
                  className="w-full rounded-md bg-[#475374] p-4 text-sm text-white duration-200 hover:bg-red-700/50"
                >
                  Clear Conversation
                </button>
              ) : null}
              <button
                onClick={() => signOut()}
                className="w-full rounded-md bg-[#475374] p-4 text-sm text-white duration-200 hover:opacity-50"
              >
                Sign out
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default Menu;
