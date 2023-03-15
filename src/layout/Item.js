import React, { forwardRef } from "react";

// eslint-disable-next-line react/display-name
const Item = forwardRef(
  ({ id, index, withOpacity, isDragging, style, ...props }, ref) => {

    const inlineStyles = {
      opacity: isDragging ? "0.7" : "1",
      cursor: isDragging ? "grabbing" : "grab",
      boxShadow: isDragging ? "rgb(0 0 0 / 0.1) 0 2px 4px -2px" : "none",
      transform: isDragging ? "scale(1.05)" : "scale(1)",
      backgroundSize: "cover",
      top: "0",
      objectFit: "cover",
      transformOrigin: "0 0",
      gridRow: index === 1 || index === 2 ? "span 2 / span 2" : null,
      ...style,
    };

    const [emblaRef] = useEmblaCarousel({ loop: false }, [
      Autoplay({ jump: true, delay: 3000 }),
    ]);

    const imgLoader = ({ src, width, quality }) => {
      return `${src}?w=${width}&q=${quality || 75}`;
    };

    return (
      <div
        ref={ref}
        style={inlineStyles}
        className="relative w-full h-full"
        {...props}
      >
        Test
      </div>
    );
    
  }
);

export default Item;
