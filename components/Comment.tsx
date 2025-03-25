import React from "react";
import RatingSection from "./RatingSection";

interface CommentProps {
  productId: string;
}

const Comment: React.FC<CommentProps> = ({ productId }) => {
  return <RatingSection productId={productId} />;
};

export default Comment;
