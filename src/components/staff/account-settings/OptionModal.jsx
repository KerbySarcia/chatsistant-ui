import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

const OptionModal = ({
  closeModal,
  isOpen,
  userPayload,
  deleteKnowledge,
  openEditModal,
  setUserPayload,
}) => {
  const handleDelete = () => {
    deleteKnowledge(userPayload._id);
    closeModal();
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle text-white shadow-xl transition-all dark:bg-[#272A3A]">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-black dark:text-white">
                    <span>Name: </span>
                    <span>
                      {userPayload?.first_name + " " + userPayload?.last_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-black dark:text-white">
                    <span>Email: </span>
                    <span>{userPayload?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-black dark:text-white">
                    <span>Role: </span>
                    <span>{userPayload?.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        setUserPayload({
                          first_name: "",
                          last_name: "",
                          role: "STAFF",
                          email: "",
                          password: "",
                        });
                        closeModal();
                      }}
                      className="rounded-md bg-[#514d64] px-2 py-1 font-productSansBlack"
                    >
                      Close
                    </button>
                    <div className="flex gap-5">
                      {/* <button
                        onClick={openEditModal}
                        className="rounded-md bg-[#423C63] px-2 py-1 font-productSansBlack"
                      >
                        Edit
                      </button> */}
                      <button
                        onClick={handleDelete}
                        className="rounded-md bg-[#543858] px-2 py-1 font-productSansBlack"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OptionModal;
