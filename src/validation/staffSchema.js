import * as Yup from "yup";

export default Yup.object().shape({
  password: Yup.string()
    .min(5, "Password is too short")
    .required("Password is required"),
  first_name: Yup.string()
    .min(2, "First name is too short")
    .required("First name is required"),
  last_name: Yup.string()
    .min(2, "Last name is required")
    .required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});
