import React, {  useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Joi from "joi";

export default function Register() {
  const navigation = useNavigate();

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    age: 0,
  });
  const [registeredBefore, setRegisteredBefore] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  let [errorList, setErrorList] = useState({   
});

  const RegisterUser = (e) => {
    let userData = { ...user };
    userData[e.target.name] = e.target.value;
    setUser(userData);
  };

  const validateRegisterData = () => {
    const schema = Joi.object({
      first_name: Joi.string().alphanum().min(3).max(30).required().messages({
        "string.pattern.base": "Invalid First Name",
        "string.min": "minimum 3 character required",
        "string.max": "maximum 30 characters allowed",
        "string.empty": `"First Name" cannot be an empty field`,
        "any.required": `"First Name" is a required.`,
      }),
      last_name: Joi.string().alphanum().min(3).max(30).required().messages({
        "string.pattern.base": "Invalid Last Name",
        "string.min": "minimum 3 character required",
        "string.max": "maximum 30 characters allowed",
        "string.empty": `"Last Name" cannot be an empty field`,
        "any.required": `"Last Name" is a required.`,
      }),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required()
        .messages({
          "string.email":
            'Invalid Email Address && /$w.@/w/.com$/, "Should be a .com or .net domain"',
          "string.empty": `"Email Address" cannot be an empty field`,
          "any.required": `"Email Address" is a required.`,
        }),

      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
        .required()
        .required()
        .messages({
          "string.pattern.base":
            "Password must contain minimum eight characters, with no special characters",
          "string.empty": `"Password" cannot be an empty field`,
          "any.required": `"Password" is a required.`,
        }),

      age: Joi.number().integer().min(18).max(85).required().messages({
        "any.required": `"Age" is a required.`,
        "number.min": "minimum 18 years old",
        "number.max": "maximum 85 years old",
      }),
    });
    return schema.validate(user, { abortEarly: false });
  };

  const sendRegisterData = async () => {
    const { data } = await axios.post(
      "https://route-egypt-api.herokuapp.com/signup",
      user
    );

    if (data.message === "success") {
      setIsLoading(false);
      navigation("/login");
    } else {
      setIsLoading(false);

      let errorMessage = data.message.split(":");
      if (errorMessage.length === 3) {
        errorMessage = errorMessage[errorMessage.length - 1];
      } else {
        errorMessage = `${errorMessage[errorMessage.length - 2]} ${
          errorMessage[errorMessage.length - 1]
        }`;
      }
      setRegisteredBefore(errorMessage);
    }
  };
  const submitForm = (e) => {
    e.preventDefault();

    setIsLoading(true);
    let validation = validateRegisterData();
    const { error } = validation;
    
    const errList ={...errorList};
    if (error) {
      setIsLoading(false);
      error.details.map(err => errList[err.path[0]] =  err.message)
      setErrorList(errList)
    }
     else {
      sendRegisterData();

    }
  };
  return (
    <>
    <div className="container">

      <div className="w-75 mx-auto py-3 btn-space">
        <h1 className="h2 text-center ">Register Now</h1>
        <form onSubmit={submitForm}>
          {registeredBefore && (
            <div className="my-3  alert alert-danger">{registeredBefore}</div>
          )}
          <div className="mb-3">
            <label htmlFor="first_name" className="form-label">
              First Name
            </label>
            <input
              onChange={RegisterUser}
              name="first_name"
              type="text"
              className="form-control"
            />
            {errorList.first_name && <div className="my-2 text-danger">{errorList.first_name}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="last_name" className="form-label">
              Last Name
            </label>
            <input
              onChange={RegisterUser}
              name="last_name"
              type="text"
              className="form-control"
            />
            {errorList.last_name && <div className="my-2 text-danger">{errorList.last_name}</div>}

          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              onChange={RegisterUser}
              name="email"
              type="email"
              className="form-control"
            />
            {errorList.email && <div className="my-2 text-danger">{errorList.email}</div>}

          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              name="password"
              type="password"
              onChange={RegisterUser}
              className="form-control"
              
            />
            {errorList.password && <div className="my-2 text-danger">{errorList.password}</div>}

          </div>
          <div className="mb-3">
            <label htmlFor="age" className="form-label">
              Age
            </label>
            <input
              name="age"
              type="number"
              className="form-control"
              onChange={RegisterUser}
            />
            {errorList.age && <div className="my-2 text-danger">{errorList.age}</div>}

          </div>
          <button
            type="submit"
            className="btn btn-space  btn-outline-info px-5 mt-3"
          >
            {isLoading ? (
              <i className="fa-solid fa-sync fa-spin"></i>
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
