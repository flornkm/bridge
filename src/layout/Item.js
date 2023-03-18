import Link from "next/link";
import React, {
  forwardRef,
  HTMLAttributes,
  CSSProperties,
  useEffect,
} from "react";

// eslint-disable-next-line react/display-name
const Item = forwardRef(
  ({ id, index, withOpacity, isDragging, style, ...props }, ref) => {

    const inlineStyles = {
      opacity: isDragging ? "0.7" : "1",
      cursor: isDragging ? "grabbing" : "grab",
      boxShadow: isDragging ? "rgb(0 0 0 / 0.1) 0 2px 4px -2px" : "none",
      transform: isDragging ? "scale(1.05)" : "scale(1)",
      objectFit: "cover",
      ...style,
    };

    return (
      <div ref={ref} style={inlineStyles} {...props}>
        {props.items.content.map((item) => {
          return <p key={index}>{item.text} {id}</p>;
        })}
      </div>
    );
  }
);

export default Item;
