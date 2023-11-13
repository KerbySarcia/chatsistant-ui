import * as Yup from "yup";

export default Yup.object().shape({
  password: Yup.string()
    .min(8, "minimum of 8 characters")
    .max(20, "maxmimum of 25 characters")
    .required("Password is required"),
  first_name: Yup.string()
    .min(2, "First name is too short")
    .required("First name is required"),
  last_name: Yup.string()
    .min(2, "Last name is required")
    .required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});
