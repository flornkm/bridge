import Link from "next/link";
import React, {
  forwardRef,
  HTMLAttributes,
  CSSProperties,
  useEffect,
  useState,
} from "react";
import * as Icon from "phosphor-react";
import Confetti from 'react-dom-confetti';

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
      position: "relative",
      ...style,
    };

    const config = {
      angle: 90,
      spread: "61",
      startVelocity: "30",
      elementCount: "40",
      dragFriction: 0.12,
      duration: 3000,
      stagger: "4",
      width: "10px",
      height: "10px",
      perspective: "359px",
      colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
    };

    return (
      <div ref={ref} style={inlineStyles} {...props} className="flex flex-col border-l border-neutral-200 border-solid pl-6">
        {!props.items.content && props.landingpage === "true" && (
          id === "1" ? (
            <div className="flex flex-col items-start justify-center h-full cursor-grab">
              <p className="font-semibold text-black text-2xl">Drag me</p>
              <p className="text-gray-500">Order differently</p>
            </div>
          ) : (
            <button className="bg-violet-500 text-white font-medium p-2 rounded-lg transition-all hover:opacity-90 cursor-grab">
              <Icon.Check size={32} weight="fill" />
            </button>
          )
        )}
        {props.items.content && props.items.content.map((item, index) => {
          if (item.type === "heading") {
            return (
              <input
                key={index}
                onChange={(e) => {
                  props.changeInput(e, id, index)
                }}
                onBlur={props.handleBlur}
                type="text"
                value={item.content}
                className="text-4xl font-semibold w-full bg-transparent focus:outline-none bg-opacity-0 transition-all rounded-md focus:bg-neutral-100 px-1 mb-4"
                style={{ color: props.colors.heading }}
              />
            )
          } else if (item.type === "text") {
            return (
              <input
                key={index}
                onChange={(e) => {
                  props.changeInput(e, id, index)
                }
                }
                onBlur={props.handleBlur}
                type="text"
                value={item.content}
                className="text-lg flex gap-4 items-center w-full bg-transparent focus:outline-none bg-opacity-0 transition-all rounded-md focus:bg-neutral-100 px-1"
                style={{ color: props.colors.text }}
              />
            )
          } else if (item.type === "textInput") {
            return (
              <div key={index} className={"px-1 flex flex-col gap-2 " + (props.items.content.indexOf(item) !== props.items.content.length - 1 && "mb-8")}>
                <label>{item.label}</label>
                <input
                  onChange={(e) => {
                    props.changeInput(e, id, index)
                  }}
                  onBlur={props.handleBlur}
                  type="text"
                  value={item.content}
                  className="text-lg flex gap-4 items-center w-full bg-transparent focus:outline-none bg-opacity-0 transition-all rounded-md focus:bg-neutral-100 px-3 py-2 ring-1 ring-neutral-200"
                  style={{ color: props.colors.text }}
                />
              </div>
            )
          }
        })}
        {/* {props.items.content && props.items.content.map((item, index) => {
          if (item.type === "heading") {
            return (
              <input
                key={index}
                onChange={(e) => {
                  props.changeInput(e, id, index)
                }}
                onBlur={props.handleBlur}
                type="text"
                value={item.text}
                className="text-2xl font-semibold w-full bg-transparent focus:outline-none bg-opacity-0 transition-all rounded-md focus:bg-neutral-100 px-1 cursor-default"
                style={{ color: props.colors.heading }}
              />
            );
          } else if (item.type === "text") {
            return (
              <input
                key={index}
                onChange={(e) => {
                  props.changeInput(e, id, index)
                }}
                onBlur={props.handleBlur}
                type="text"
                value={item.text}
                className="text-base w-full bg-transparent focus:outline-none transition-all rounded-md focus:bg-neutral-100 px-1 cursor-default"
                style={{ color: props.colors.text }}
              />
            );
          } else if (
            item.type === "primaryButton" ||
            item.type === "secondaryButton"
          ) {
            return (
              <>

                <input
                  key={index}
                  onChange={(e) => {
                    // change this input value
                    props.changeInput(e, id, index)
                  }}
                  onBlur={props.handleBlur}
                  onClick={() => {
                    if (item.type === "primaryButton")
                      props.setConfetti(true)
                    setTimeout(() => {
                      props.setConfetti(false)
                    }, 3000)
                  }}
                  type="text"
                  value={item.text}
                  className="px-8 py-4 font-medium transition-all hover:opacity-80 text-white rounded-lg text-center focus:outline-none cursor-default"
                  style={{
                    backgroundColor: props.colors[item.type],
                  }}
                />
                {item.type === "primaryButton" && props.effects.confetti && <div className="absolute w-0 left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%]"><Confetti active={props.confetti} config={config} /></div>}
              </>
            );
          }
        })} */}
      </div>
    );
  }
);

export default Item;
