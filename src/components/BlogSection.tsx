import React, { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import "./BlogSection.css";
import { pb } from "../App";

interface Post {
  id: string;
  collectionId: string;
  title: string;
  description: string;
  created: string;
  image: string;
  expand?: {
    user?: {
      name: string;
    };
  };
}

const BlogSection: React.FC = () => {
  const [articles, setArticles] = useState<Post[]>([]);

  useEffect(() => {
    pb.collection("articles")
      .getFullList<Post>({
        sort: "-created",
        expand: "user",
      })
      .then((records: Post[]) => {
        setArticles(records);
      });
  }, []);

  return (
    <section className="blog-section">
      {articles.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </section>
  );
};

export default BlogSection;
