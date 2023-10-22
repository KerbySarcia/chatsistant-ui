import * as Yup from "yup";

export default Yup.object().shape({
  password: Yup.string().required("Password is required"),
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});
