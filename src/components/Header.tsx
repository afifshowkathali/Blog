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

const Header: React.FC = () => {
  const [openedAddArticle, { open: openAddArticle, close: closeAddArticle }] =
    useDisclosure(false);
  const [openedRegister, { open: openRegister, close: closeRegister }] =
    useDisclosure(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [passwordError, setPasswordError] = useState("");

  const handleSubmitArticle = async () => {
    try {
      let userId = await findUser(name);
      if (!userId) {
        setUserNotFound(true);
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("user", userId);
      if (image) {
        formData.append("image", image);
      }

      await pb.collection("articles").create(formData);
      setSuccess(true);
      closeAddArticle();
      setTitle("");
      setDescription("");
      setName("");
      setImage(null);
      setUserNotFound(false);
    } catch (error) {
      console.error("Error adding article:", error);
    }
  };

  const handleRegister = async () => {
    setPasswordError("");

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
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const findUser = async (name: string) => {
    try {
      const result = await pb
        .collection("users")
        .getFirstListItem(`name="${name}"`);
      return result.id;
    } catch (error) {
      console.log("User not found:", error);
      return null;
    }
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
            <Link className="homebtn" to="/">
              Home
            </Link>
            <Link className="blogsbtn" to="/blogs">
              Blogs
            </Link>
          </BrowserRouter>
        </nav>
        <Button className="add-button" onClick={openAddArticle}>
          ADD ARTICLE
        </Button>
        <Button className="register-button" onClick={openRegister}>
          REGISTER
        </Button>
      </header>

      {/* Articles Modal*/}
      <Modal
        opened={openedAddArticle}
        onClose={closeAddArticle}
        title="Add New Article"
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      >
        <TextInput
          label="Name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          required
        />
        {userNotFound && (
          <Notification
            color="red"
            title="Error"
            onClose={() => setUserNotFound(false)}
          >
            User does not exist!
          </Notification>
        )}
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
        <Button onClick={handleSubmitArticle} fullWidth mt="md">
          Submit
        </Button>
      </Modal>

      {/* Register Modal */}
      <Modal
        opened={openedRegister}
        onClose={closeRegister}
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
        />
        <TextInput
          label="Password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          required
          type="password"
          mt="sm"
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
        <TextInput
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.currentTarget.value)}
          required
          type="password"
          mt="sm"
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
        <FileInput
          label="Profile Picture"
          placeholder="Upload profile picture"
          value={profilePicture}
          onChange={setProfilePicture}
          mt="sm"
          accept="image/png,image/jpeg"
        />
        <Button onClick={handleRegister} fullWidth mt="md">
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
