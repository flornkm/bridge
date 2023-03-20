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
      transition: "all 0.2s ease",
      objectFit: "cover",
      ...style,
    };

    return (
      <div ref={ref} style={inlineStyles} {...props}>
        {props.items.content.map((item, index) => {
          if (item.type === "heading") {
            return (
              <input
                key={index}
                onChange={(e) => props.changeInput(e, id, index)}
                type="text"
                value={item.text + " " + id}
                className="text-2xl font-semibold w-full bg-transparent"
                style={{ color: props.colors.heading }}
              />
            );
          } else if (item.type === "text") {
            return (
              <input
                key={index}
                onChange={(e) => props.changeInput(e, id, index)}
                type="text"
                value={item.text}
                className="text-base w-full bg-transparent"
                style={{ color: props.colors.text }}
              />
            );
          } else if (
            item.type === "primaryButton" ||
            item.type === "secondaryButton"
          ) {
            return (
              <input
                key={index}
                onChange={(e) => props.changeInput(e, id, index)}
                type="text"
                value={item.text}
                className="px-8 py-4 font-medium transition-all hover:opacity-80 cursor-pointer text-white rounded-lg text-center"
                style={{
                  backgroundColor: props.colors[item.type],
                }}
              />
            );
          }
        })}
      </div>
    );
  }
);

export default Item;
