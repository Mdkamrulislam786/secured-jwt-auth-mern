import axios from "axios";
import React, { useState } from "react";
import "./index.css";
import Cookies from "js-cookie";
function App() {
  const [user, setUser] = useState({});
  const [err, setErr] = useState("");

  // if the refreshToken is valid then it send back a new access token, and we set the access token in the headers->cookies
  const refresh = (refreshToken: any) => {
    console.log("Refreshing token!");

    return new Promise((resolve, reject) => {
      axios
        .post("http://localhost:4000/refresh", { token: refreshToken })
        .then((data) => {
          if (data.data.success === false) {
            setErr("Login again");
            // set message and return.
            resolve(false);
          } else {
            const { accessToken } = data.data;
            Cookies.set("access", accessToken);
            resolve(accessToken);
          }
        });
    });
  };

  //#(7)the access token is valid, so we make a request to the protected route with the valid access token, if Access token expired, the we craete new one, and let them access the protected route
  const requestLogin = async (accessToken: any, refreshToken: any) => {
    console.log(accessToken, refreshToken);
    return new Promise((resolve, reject) => {
      axios
        .post(
          "http://localhost:4000/protected",
          {},
          { headers: { authorization: `Bearer ${accessToken}` } }
        )
        .then(async (data) => {
          if (data.data.success === false) {
            if (data.data.message === "User not authenticated") {
              setErr("Login again");
              // set err message to login again.
            } else if (data.data.message === "Access token expired") {
              //if the Access token expired, we create new one
              const accessToken = await refresh(refreshToken);
              return await requestLogin(accessToken, refreshToken);
            }

            resolve(false);
          } else {
            // protected route has been accessed, response can be used.
            setErr("Protected route accessed!");
            resolve(true);
          }
        });
    });
  };

  //#(1) changing form inputs setting the user state
  const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  //#(2) form submission to login the user
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitied");
    axios.post("http://localhost:4000/login", { user }).then((data) => {
      const { accessToken, refreshToken } = data.data;
      //setting the res token in the headers->cookies
      Cookies.set("access", accessToken);
      Cookies.set("refresh", refreshToken);
    });
  };
  //#(5)checks if the token is valid, then return the access token
  const hasAccess = async (accessToken: any, refreshToken: any) => {
    if (!refreshToken) return null;

    if (accessToken === undefined) {
      //#(6) if accessToken is undefined,then generate/get new accessToken, setit in the cookies and return it
      accessToken = await refresh(refreshToken);
      return accessToken;
    }
    return accessToken;
  };
  //#(3) access protected route
  const protect = async () => {
    //get the tokens from cookies
    let accessToken = Cookies.get("access");
    let refreshToken = Cookies.get("refresh");
    //#(4)checks if the token is valid
    accessToken = await hasAccess(accessToken, refreshToken);

    if (!accessToken) {
      // Set message saying login again.
      setErr("Login again")
    } else {
      //#(7)if the access token is valid, then send req to access the protected route
      await requestLogin(accessToken, refreshToken);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit} onChange={handleChange} action="">
        <input type="text" name="email" placeholder="email" /> <br />
        <input type="password" name="password" placeholder="password" /> <br />
        <button type="submit">login</button>
      </form>
      <p style={{ color: "red" }}>{err}</p>
      <button onClick={protect}>access protected route</button>
    </div>
  );
}

export default App;
// Cookies.set('name', 'value', { expires: 7, path: '' });
