import React from "react";
import "./BlogCard.css";
import dayjs from "dayjs";

interface BlogCardProps {
  post: {
    collectionId: string;
    id: string;
    image: string;
    title: string;
    description: string;
    created: string;
    expand?: {
      user?: {
        name: string;
      };
    };
  };
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <article className="blog-card">
      <img
        src={`https://afif-project.lammem.net/api/files/${post.collectionId}/${post.id}/${post.image}?token=`}
        alt={post.title}
        className="blog-image"
      />
      <div className="blog-content">
        <h3 className="blog-title">{post.title}</h3>
        <p className="blog-description">{post.description}</p>
        <div className="blog-info">
          <span>{post?.expand?.user?.name}</span> |{" "}
          <span> {dayjs(post.created).format("DD MMMM YYYY")}</span>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
