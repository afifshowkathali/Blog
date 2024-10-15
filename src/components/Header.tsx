import React, { useState } from "react";
import "./Header.css";
import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Button,
  TextInput,
  FileInput,
  Notification,
} from "@mantine/core";
import { pb } from "../App";
import "@mantine/core/styles.css";
import { BrowserRouter, Link } from "react-router-dom";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

const Header: React.FC = () => {
  const [openedAddArticle, { open: openAddArticle, close: closeAddArticle }] =
    useDisclosure(false);
  const [openedRegister, { open: openRegister, close: closeRegister }] =
    useDisclosure(false);
  const [openedLogin, { open: openLogin, close: closeLogin }] =
    useDisclosure(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [emailValError, setEmailValError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const resetRegisterForm = () => {
    setPassword("");
    setConfirmPassword("");
    setEmail("");
    setName("");
    setProfilePicture(null);
    setEmailError("");
  };

  const resetLoginForm = () => {
    setPassword("");
    setEmail("");
    setEmailValError("");
    setEmailError("");
  };

  const resetAddArticleForm = () => {
    setTitle("");
    setDescription("");
    setImage(null);
  };

  const handleSubmitArticle = async () => {
    try {
      if (!isLoggedIn) {
        alert("Please log in to submit an article.");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      if (image) {
        formData.append("image", image);
      }

      await pb.collection("articles").create(formData);
      setSuccess(true);
      closeAddArticle();
      setTitle("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error("Error adding article:", error);
    }
  };

  const handleRegister = async () => {
    setPasswordError("");
    setEmailError("");
    setEmailValError("");

    if (!emailRegex.test(email)) {
      setEmailValError("Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("passwordConfirm", confirmPassword);
      formData.append("name", name);
      if (profilePicture) {
        formData.append("avatar", profilePicture);
      }

      await pb.collection("users").create(formData);
      alert("User registered successfully");
      closeRegister();
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setProfilePicture(null);
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data;

        if (errorData.email) {
          setEmailError("Email is already in use.");
        }
      }
    }
  };

  const handleLogin = async () => {
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);
      setName(authData.record.name);
      setIsLoggedIn(true);
      closeLogin();
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleLogout = () => {
    pb.authStore.clear();
    setIsLoggedIn(false);
    setName("");
  };

  return (
    <>
      <header className="header">
        <div className="profile">
          <img
            src="/images/dp.jpeg"
            alt="Ralph Edwards"
            className="profile-img"
          />
          <span className="title">PHOTOGRAPHY BLOG</span>
        </div>
        <nav className="nav">
          <BrowserRouter>
            <Link to="/">
              <button className="homebtn">Home</button>
            </Link>
            <Link to="/blogs">
              <button className="blogsbtn">Blogs</button>
            </Link>
          </BrowserRouter>
          {isLoggedIn ? (
            <>
              <Button className="add-button" onClick={openAddArticle}>
                ADD ARTICLE
              </Button>
              <Button className="logout-button" onClick={handleLogout}>
                LOG OUT
              </Button>
            </>
          ) : (
            <>
              <Button className="login-button" onClick={openLogin}>
                LOGIN
              </Button>
              <Button className="register-button" onClick={openRegister}>
                REGISTER
              </Button>
            </>
          )}
        </nav>
      </header>

      {/* Add Article Modal */}
      <Modal
        opened={openedAddArticle}
        onClose={() => {
          closeAddArticle();
          resetAddArticleForm();
        }}
        title="Add New Article"
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      >
        <TextInput
          label="Name"
          placeholder="Enter your name"
          value={name}
          disabled
          required
        />

        <TextInput
          label="Title"
          placeholder="Enter article title"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          required
          mt="sm"
        />
        <TextInput
          label="Description"
          placeholder="Enter article description"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          required
          mt="sm"
        />
        <FileInput
          label="Image"
          placeholder="Upload an image"
          value={image}
          onChange={setImage}
          mt="sm"
          accept="image/png,image/jpeg"
        />
        <Button
          className="MBtn"
          onClick={handleSubmitArticle}
          fullWidth
          mt="md"
        >
          Submit
        </Button>
      </Modal>

      {/* Login Modal */}
      <Modal
        opened={openedLogin}
        onClose={() => {
          closeLogin();
          resetLoginForm();
        }}
        title="Login"
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      >
        <TextInput
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
          mt="sm"
        />
        {emailValError === "Please enter a valid email address" && (
          <Notification
            color="red"
            title="Error"
            onClose={() => setEmailValError("")}
          >
            Please enter a valid email address
          </Notification>
        )}
        <TextInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          required
          type={showPassword ? "text" : "password"}
          mt="sm"
          rightSection={
            <Button
              variant="subtle"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: "transparent",
                padding: 0,
                width: "30px",
                height: "30px",
              }}
            >
              {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </Button>
          }
          rightSectionWidth={42}
        />
        <Button className="MBtn" onClick={handleLogin} fullWidth mt="md">
          Login
        </Button>
      </Modal>

      {/* Register Modal */}
      <Modal
        opened={openedRegister}
        onClose={() => {
          closeRegister();
          resetRegisterForm();
        }}
        title="Register New User"
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      >
        <TextInput
          label="Name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          required
        />
        <TextInput
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
          mt="sm"
          error={emailError && "Email is already in use"}
        />
        {emailValError === "Please enter a valid email address" && (
          <Notification
            color="red"
            title="Error"
            onClose={() => setEmailValError("")}
          >
            Please enter a valid email address
          </Notification>
        )}
        {emailError && (
          <Notification
            color="red"
            title="Error"
            onClose={() => setEmailError("")}
          >
            Email is already in use
          </Notification>
        )}
        <TextInput
          label="Password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          required
          type={showPassword ? "text" : "password"}
          mt="sm"
          rightSection={
            <Button
              variant="subtle"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: "transparent",
                padding: 0,
                width: "30px",
                height: "30px",
              }}
            >
              {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </Button>
          }
          rightSectionWidth={42}
        />
        {passwordError === "Password must be at least 8 characters long" && (
          <Notification
            color="red"
            title="Error"
            onClose={() => setPasswordError("")}
          >
            Password must be at least 8 characters long
          </Notification>
        )}

        <TextInput
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.currentTarget.value)}
          required
          type={showConfirmPassword ? "text" : "password"}
          mt="sm"
          rightSection={
            <Button
              variant="subtle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                background: "transparent",
                padding: 0,
                width: "30px",
                height: "30px",
              }}
            >
              {showConfirmPassword ? (
                <IconEyeOff size={18} />
              ) : (
                <IconEye size={18} />
              )}
            </Button>
          }
          rightSectionWidth={42}
        />
        {passwordError === "Passwords do not match" && (
          <Notification
            color="red"
            title="Error"
            onClose={() => setPasswordError("")}
          >
            Passwords do not match
          </Notification>
        )}
        <FileInput
          label="Profile Picture"
          placeholder="Upload profile picture"
          value={profilePicture}
          onChange={setProfilePicture}
          mt="sm"
          accept="image/png,image/jpeg"
        />
        <Button className="MBtn" onClick={handleRegister} fullWidth mt="md">
          Register
        </Button>
      </Modal>

      {success && (
        <Notification
          color="green"
          onClose={() => setSuccess(false)}
          title="Success"
          mt="md"
        >
          Article added successfully!
        </Notification>
      )}
    </>
  );
};

export default Header;
