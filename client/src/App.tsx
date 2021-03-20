import axios from 'axios';
import React, { useState } from 'react';
import './index.css'
import Cookies from 'js-cookie';
function App() {

  const [user, setUser] = useState({})

  //(1.)handles uinput changes and sets user state
  const handleChange = (e: any) => {
    setUser({
      ...user,
      [e.target.name]: [e.target.value]
    })
  }

  //(2).logesin the user and sets access+refresh tokens in the headers->cookies
  const handleSubmit = (e: any) => {
    e.preventDefault()
    axios.post("http://localhost:4000/login", { user }).then(data => {
      const { accessToken, refreshToken } = data.data;
      Cookies.set('aid', accessToken)
      Cookies.set('rid', refreshToken)
    })
  }

  const hasAccess = (accessToken, refreshToken) => {
    return "fsaf"
  }

  const protect = async () => {
    let accessToken = Cookies.get('aid')
    let refreshToken = Cookies.get('aid')
    accessToken = await hasAccess(accessToken, refreshToken);
    if (!accessToken) {
      //set error message
    } else {
      return
    }

  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit} onChange={handleChange} action="">
        <input type="text" name="email" placeholder="email" /> <br />
        <input type="password" name="password" placeholder="password" /> <br />
        <button type="submit" >login</button>
      </form>
      <button onClick={protect} >access protected route</button>
    </div>
  );
}

export default App;
// Cookies.set('name', 'value', { expires: 7, path: '' });