# Full-Stack project

-setup backend
-user management api
//GET: /api/users -> all users

-blog api

-Frond end



import React, { useState } from "react";
import SucessInfo from "../components/SucessInfo";
import { registerUser } from "../services/UserService";

export const Register = () => {
  const [user, setuser] = useState({
    name: " ",
    email: " ",
    phone: " ",
    password: "",
  });

  //response that we are getting from api while sending data which is saved on response.data.message variable
  const [sucessInfo, setSucessInfo] = useState("");
  const [isSucessInfoOpen, SetisSucessInfoOpen] = useState("false");
  const [responseStatus, setResponseStatus] = useState(false);

  //on submit handler
  const onsubmitHandler = async (event) => {
    //prevent from refreshing page
    event.preventDefault();
    //printing the value from imput field which we have set using use state hook
    // console.log(user)
    try {
      //making a post request and sending data to api from user state, user here is user state
      const response = await registerUser(user)
      //seting response saved on response variable as setSucessInfo state
      setSucessInfo(response.message);
      SetisSucessInfoOpen(true);
      setResponseStatus(true);
    } catch (error) {
      //seting response saved on error response variable as setSucessInfo state
            setSucessInfo(error.response.data.message);

      SetisSucessInfoOpen(true);
      setResponseStatus(false);
    }

    //seting field empty after submiting form as an object
    setuser({ name: "", email: "", phone: "", password: "" });
  };

  //handle change for all field using one handler
  const handleChange = (event) => {
    //name is from name input field name ="email",
    const fieldName = event.target.name;

    setuser((prevState) => {
      //storing previous state and adding new field
      return { ...prevState, [fieldName]: event.target.value };
    });
  };

  const closeSucessInfo = () => {
    SetisSucessInfoOpen(false);
  };

  return (
    <>
      <div className="container">
        <h1>User Registration</h1>
        <div className="card">
          <form className="registration-form" onSubmit={onsubmitHandler}>
            <div className="form control">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                name="name"
                id="name"
                value={user.name}
                onChange={handleChange}
              />
            </div>
            <div className="form control">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                id="email"
                value={user.email}
                onChange={handleChange}
              />
            </div>
            <div className="form control">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                name="password"
                id="password"
                value={user.password}
                onChange={handleChange}
              />
            </div>
            <div className="form control">
              <label htmlFor="phone">Phone:</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={user.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-control">
              <button type="submit">Register</button>
            </div>
          </form>
          {/* if there is someting on sucessInfo call SucessInfo companent where we pass sucessInfo and closeSucessInfo */}
          {isSucessInfoOpen && (
            <SucessInfo
              sucessInfo={sucessInfo}
              closeSucessInfo={closeSucessInfo}
              responseStatus={responseStatus}
            />
          )}
        </div>
      </div>
    </>
  );
};
