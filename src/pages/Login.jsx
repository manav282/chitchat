import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info
      const user = result.user;

      console.log("User signed in:", user);
      // Redirect or perform further actions here
    } catch (error) {
      // Handle Errors here
      console.error("Error during Google sign-in", error.message);
      alert("Failed to sign in with Google. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/")
    } catch (err) {
      setErr(true);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chat App</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button>Sign in</button>
          {err && <span style={{ color: "#f8ae0f" }}>Invalid username/password</span>}
        </form>
        <p>
          You don't have an account?{" "}
          <Link to="/register" className="link">Register</Link>
        </p>
        <div className="orSection">
          <span>OR</span>
          <button className="googleSignInButton" onClick={handleGoogleSignIn}>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
