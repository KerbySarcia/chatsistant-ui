import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import DropdownSearch from "../DropdownSearch";
import TextArea from "../../forms/TextArea";
import clsx from "clsx";

const AddModal = ({
  closeModal,
  isOpen,
  subjects,
  knowledgePayload,
  setknowledgePayload,
  handleChange,
  handleSubmit,
  isLoading,
  isFeedButtonDisabled,
  targets,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-[#272A3A]">
                <div className="flex h-full w-full flex-col gap-5 rounded-md bg-white p-5 dark:bg-[#272A3A]">
                  <DropdownSearch
                    options={subjects}
                    selectedValue={knowledgePayload.subject}
                    setSelectedValue={v =>
                      setknowledgePayload(prev => ({ ...prev, subject: v }))
                    }
                    label="Subject"
                  />
                  <DropdownSearch
                    options={targets}
                    selectedValue={knowledgePayload.target}
                    setSelectedValue={v =>
                      setknowledgePayload(prev => ({ ...prev, target: v }))
                    }
                    label="Target"
                  />

                  <TextArea
                    value={knowledgePayload.value}
                    onChange={handleChange}
                    label={"Value"}
                    name={"value"}
                    isDisabled={isLoading}
                  />
                  <div className="flex w-full items-center gap-2">
                    <button
                      disabled={isFeedButtonDisabled || isLoading}
                      onClick={() => {
                        handleSubmit();
                        closeModal();
                        setknowledgePayload({
                          subject: "",
                          target: "",
                          value: "",
                        });
                      }}
                      className={clsx(
                        "w-full rounded-md bg-[#8EABF2] p-3 text-white dark:bg-[#4A5168]",
                        isFeedButtonDisabled || isLoading
                          ? "opacity-50"
                          : "opacity-100"
                      )}
                    >
                      Add
                    </button>

                    <button
                      disabled={isLoading}
                      onClick={() => {
                        closeModal();
                        setknowledgePayload({
                          subject: "",
                          target: "",
                          value: "",
                        });
                      }}
                      className={clsx(
                        "w-full rounded-md bg-[#4A5168] p-3 text-white",
                        isLoading ? "opacity-50" : "opacity-100"
                      )}
                    >
                      Cancel
                    </button>
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

export default AddModal;
