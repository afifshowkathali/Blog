import React from "react";
import Header from "./components/Header";
import BlogSection from "./components/BlogSection";
import "./App.css";
import PocketBase from "pocketbase";

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <main>
        <h1 className="heading">Blog</h1>
        <h3 className="quote">
          “Photography is the simplest thing in the world, but it is incredibly
          complicated to make it really work.” ― Martin Parr
        </h3>
        <BlogSection />
      </main>
    </div>
  );
};

export default App;
export const pb = new PocketBase("https://afif-project.lammem.net");
