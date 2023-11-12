import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import staffSchema from "../../../../validation/staffSchema";
import useUserService from "../../../../services/useUserService";
import useAuthService from "../../../../services/useAuthService";
import { isEmpty } from "lodash";

const AccountSettings = () => {
  const [initialValues, setInitialValues] = useState({
    first_name: "",
    last_name: "",
    role: "STAFF",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMesage] = useState(null);
  const [staffs, setStaffs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userService = useUserService();
  const authService = useAuthService();

  useEffect(() => {
    (async () => {
      const getStaffs = await userService.getUsers();
      setStaffs([...getStaffs.filter(staff => staff.role === "STAFF")]);
    })();
  }, []);

  const handleDelete = async id => {
    await userService.deleteUser(id);
    setStaffs([...staffs.filter(staff => staff._id !== id)]);
  };
  console.log(staffs);
  const handleSubmit = async data => {
    try {
      setIsLoading(true);
      let newStaff = {};

      if (!isEmpty(newStaff?.error)) {
        setIsLoading(false);
        setErrorMesage(newStaff.error);
        return;
      }

      if (data?._id) {
        newStaff = await userService.updateUser(data?._id, data);

        setStaffs([
          ...staffs.map(staff => {
            return staff._id === data._id ? newStaff : staff;
          }),
        ]);
      } else {
        newStaff = await authService.singUp(data);
        setStaffs([newStaff.data, ...staffs]);
      }

      setInitialValues({
        first_name: "",
        last_name: "",
        role: "STAFF",
        email: "",
        password: "",
      });

      setErrorMesage(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!staffs)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="flex h-full w-full flex-col gap-5">
      <h1
        className="font-productSansBlack w-full rounded-b-md rounded-t-lg bg-black/50 p-5 
        text-center text-xl text-white "
      >
        Account Settings
      </h1>

      <div className="flex h-full w-full gap-5">
        <div className="flex h-full w-full flex-col gap-5 rounded-md bg-black/50 p-5">
          <h1 className="font-productSans rounded-md bg-black/30 p-2 text-center text-white ">
            Staffs
          </h1>

          <div className="relative flex h-full w-full overflow-y-auto">
            <table className="absolute left-0 top-0 flex h-full w-full flex-col gap-4  text-white">
              <thead className="sticky top-0">
                <tr className=" font-productSansBlack flex w-full items-center justify-between gap-5 rounded-b-md rounded-t-lg bg-[#3D4250] p-5 text-left">
                  <th className="flex-1">Name</th>
                  <th className="flex-1">Email</th>
                  <th className="">Action</th>
                </tr>
              </thead>
              <tbody className="flex flex-col gap-5">
                {staffs?.map((staff, key) => (
                  <tr
                    key={key}
                    className="flex w-full items-center justify-between gap-5 rounded-b-md rounded-t-lg bg-[#3D4250] p-5 text-left"
                  >
                    <td className="flex-1">
                      {staff.first_name + " " + staff.last_name}
                    </td>
                    <td className="flex-1">{staff.email}</td>
                    <td className="flex w-[100px] flex-col gap-1 text-sm">
                      <button
                        onClick={() => {
                          setInitialValues({
                            ...staff,
                          });
                        }}
                        className=" rounded border border-white/30 bg-black/30 duration-200 hover:bg-blue-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(staff._id)}
                        className=" rounded border border-white/30 bg-black/30 duration-200 hover:bg-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex h-full w-full flex-col gap-5 rounded-md bg-black/50 p-5">
          <h1 className="font-productSans rounded-md bg-black/30 p-2 text-center text-white ">
            Add Staffs
          </h1>
          {errorMessage ? (
            <h1 className="rounded-md bg-red-300 p-5 text-center text-sm text-red-800">
              {errorMessage}
            </h1>
          ) : null}
          <div className="">
            <Formik
              enableReinitialize
              onSubmit={handleSubmit}
              initialValues={initialValues}
              validationSchema={staffSchema}
            >
              {({ errors, touched }) => (
                <Form className="flex flex-col gap-5 text-white">
                  <div className="flex gap-5">
                    <div className="flex w-full flex-col gap-1">
                      <label htmlFor="first_name">First Name</label>
                      <Field
                        className="rounded-md border-2 border-white/20 bg-[#4A5168] p-2 duration-200 focus:outline-[#323745]"
                        id="first_name"
                        name="first_name"
                        autoComplete="off"
                        disabled={isLoading}
                      />
                      {errors.first_name && touched.first_name ? (
                        <div className="text-xs text-red-400">
                          {errors.first_name}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex w-full flex-col gap-1">
                      <label htmlFor="last_name">Last Name</label>
                      <Field
                        className="rounded-md border-2 border-white/20 bg-[#4A5168] p-2 duration-200 focus:outline-[#323745]"
                        id="last_name"
                        name="last_name"
                        autoComplete="off"
                        disabled={isLoading}
                      />
                      {errors.last_name && touched.last_name ? (
                        <div className="text-xs text-red-400">
                          {errors.last_name}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="email">Email</label>
                    <Field
                      className="rounded-md border-2 border-white/20 bg-[#4A5168] p-2 duration-200 focus:outline-[#323745]"
                      id="email"
                      name="email"
                      autoComplete="off"
                      disabled={isLoading}
                    />
                    {errors.email && touched.email ? (
                      <div className="text-xs text-red-400">{errors.email}</div>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="password">Password</label>
                    <Field
                      type="password"
                      className="rounded-md border-2 border-white/20 bg-[#4A5168] p-2 duration-200 focus:outline-[#323745]"
                      id="password"
                      name="password"
                      autoComplete="off"
                      disabled={isLoading}
                    />
                    {errors.password && touched.password ? (
                      <div className="text-xs text-red-400">
                        {errors.password}
                      </div>
                    ) : null}
                  </div>
                  {initialValues?._id ? (
                    <button
                      disabled={isLoading}
                      type="submit"
                      className=" bg-[#4A5168]/ flex items-center justify-center rounded-md bg-white/30 p-3 font-bold text-white duration-200 hover:opacity-50"
                    >
                      {isLoading ? <LoadingSpinner /> : "Update Info"}
                    </button>
                  ) : (
                    <button
                      disabled={isLoading}
                      type="submit"
                      className=" bg-[#4A5168]/ flex items-center justify-center rounded-md bg-white/30 p-3 font-bold text-white duration-200 hover:opacity-50"
                    >
                      {isLoading ? <LoadingSpinner /> : "Create Staff"}
                    </button>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
