import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.itemArray.map((item, index) => {
        return (
          <div key={index}>
            {item.type === "heading" && (
              <h1 className="text-2xl font-semibold">{item.text}</h1>
            )}
            {item.type === "text" && <p className="text-base">{item.text}</p>}
            {item.type === "primaryButton" && (
              <button className="bg-black text-white px-3 py-2 rounded-lg font-medium text-base">
                {item.text}
              </button>
            )}
            {item.type === "secondaryButton" && (
              <button className="bg-white text-black px-3 py-2 rounded-lg font-medium text-base border-2 border-black">
                {item.text}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
