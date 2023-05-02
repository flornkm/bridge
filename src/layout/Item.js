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
      opacity: withOpacity ? '0.5' : '1',
      cursor: isDragging ? "grabbing" : "grab",
      transformOrigin: '50% 50%',
      backgroundColor: withOpacity ? "#f3f4f6" : "white",
      height: "auto",
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
      <div ref={ref} style={inlineStyles} {...props} className={"flex flex-col outline-gray-300 " + (!props.landingpage && "relative max-md:my-4 max-md:p-4 border border-transparent group/info md:p-8 rounded-2xl transition-colors cursor-grab") + (withOpacity && " pointer-events-none")}>
        {withOpacity && !props.landingpage && (
          <div className="absolute top-0 left-0 w-full h-full bg-neutral-100 rounded-2xl z-50" />
        )}
        {withOpacity && props.landingpage && (
          <div className="absolute top-0 left-0 w-full h-full bg-white">
            <div className="w-full h-full bg-neutral-100 rounded-lg overflow-hidden z-50" />
          </div>
        )}
        {!props.landingpage && !isDragging && (
          <div className="absolute top-0 right-8 opacity-0 group-hover/info:opacity-100 transition-all text-neutral-300 italic max-md:hidden">
            Hold and drag to reorder
          </div>
        )}
        {!props.items.content && props.landingpage === "true" && (
          id === "1" ? (
            <div className="flex flex-col items-start justify-center h-full cursor-grab">
              <p className="font-semibold text-black text-2xl">Drag me</p>
              <p className="text-gray-500">Order differently</p>
            </div>
          ) : (
            <div className="bg-violet-500 text-white font-medium py-2 pl-3 pr-4 rounded-lg transition-all cursor-grab flex gap-4 items-center">
              <Icon.Check size={32} weight="fill" />
              Apply
            </div>
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
              <div key={index} className={"flex md:gap-32 max-md:gap-4 items-center max-md:pb-8 " + (!item.visibility && "opacity-50")}>
                <input
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
                {id !== 1 && <div className="h-full flex max-md:absolute max-md:bottom-0 max-md:right-0 max-md:h-10">
                  <div onClick={() => {
                    props.changeInput(null, id, index, "visibility");
                  }}
                    className="flex flex-col items-center justify-center h-full cursor-pointer p-2 transition-all hover:bg-neutral-100 rounded-md relative group"
                  >
                    {item.visibility ? (
                      <div className="flex flex-col gap-2">
                        <Icon.Eye size={24} />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Icon.EyeClosed size={24} />
                      </div>
                    )}
                    <div className="max-md:hidden text-sm absolute translate-x-[-50%] left-[50%] bottom-14 hidden group-hover:block text-white px-2.5 py-1 bg-black rounded-full">
                      Visible?
                    </div>
                  </div>
                  {id > 5 && <div

                    onClick={() => {
                      props.deleteItem(id);
                    }}
                    className="flex flex-col items-center justify-center h-full cursor-pointer p-2 transition-all hover:bg-neutral-100 rounded-md relative group"
                  >
                    <div className="flex flex-col gap-2">
                      <Icon.Trash size={24} />
                    </div>
                    <div className="text-sm absolute translate-x-[-50%] left-[50%] bottom-14 hidden group-hover:block text-white px-2.5 py-1 bg-black rounded-full">
                      Remove
                    </div>
                  </div>}
                </div>}
              </div>
            )
          } else if (item.type === "textArea") {
            return (
              <div key={index} className={"flex md:gap-32 max-md:gap-4 items-center h-40 max-md:pb-8 " + (!item.visibility && "opacity-50")}>
                <textarea
                  onChange={(e) => {
                    props.changeInput(e, id, index)
                  }
                  }
                  onBlur={props.handleBlur}
                  type="text"
                  value={item.content}
                  className="text-lg flex gap-4 h-full items-center w-full bg-transparent focus:outline-none bg-opacity-0 transition-all rounded-md focus:bg-neutral-100 px-1"
                  style={{ color: props.colors.text }}
                />
                {id !== 1 && <div className="h-full flex items-center max-md:absolute max-md:bottom-0 max-md:right-0 max-md:h-10">
                  <div onClick={() => {
                    props.changeInput(null, id, index, "visibility");
                  }}
                    className="flex flex-col items-center justify-center cursor-pointer p-2 transition-all hover:bg-neutral-100 rounded-md relative group"
                  >
                    {item.visibility ? (
                      <div className="flex flex-col gap-2">
                        <Icon.Eye size={24} />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Icon.EyeClosed size={24} />
                      </div>
                    )}
                    <div className="max-md:hidden text-sm absolute translate-x-[-50%] left-[50%] bottom-14 hidden group-hover:block text-white px-2.5 py-1 bg-black rounded-full">
                      Visible?
                    </div>
                  </div>
                  {id > 5 && <div

                    onClick={() => {
                      props.deleteItem(id);
                    }}
                    className="flex flex-col items-center justify-center cursor-pointer p-2 transition-all hover:bg-neutral-100 rounded-md relative group"
                  >
                    <div className="flex flex-col gap-2">
                      <Icon.Trash size={24} />
                    </div>
                    <div className="text-sm absolute translate-x-[-50%] left-[50%] bottom-14 hidden group-hover:block text-white px-2.5 py-1 bg-black rounded-full">
                      Remove
                    </div>
                  </div>}
                </div>}
              </div>
            )
          } else if (item.type === "textInput") {
            return (
              <div key={index} className={"flex md:gap-32 max-md:gap-4 items-center max-md:pb-4 relative " + (!item.visibility && "opacity-50")}>
                <div className={"px-1 grow flex flex-col gap-2 " + (props.items.content.indexOf(item) !== props.items.content.length - 1 && "mb-8")}>
                  <div className="flex justify-start">
                    <div>
                      <div onClick={() => {
                        props.changeInput(null, id, index, "required");
                      }}
                        className="flex flex-col items-center justify-center h-full cursor-pointer p-1 transition-all hover:bg-neutral-100 rounded-md relative group"
                      >
                        {item.required ? (
                          <div className="flex flex-col gap-2">
                            <Icon.Check size={20} weight="bold" />
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2 text-gray-300">
                            <Icon.Check size={20} weight="bold" />
                          </div>
                        )}
                        <div className="text-sm absolute translate-x-[-50%] left-[50%] bottom-10 hidden group-hover:block text-white px-2.5 py-1 bg-black rounded-full">
                          Required?
                        </div>
                      </div>
                    </div>
                    <input
                      onChange={(e) => {
                        props.changeInput(e, id, index, "label")
                      }}
                      onBlur={props.handleBlur}
                      type="text"
                      value={item.label}
                      className="text-base flex gap-4 items-center w-full bg-transparent focus:outline-none bg-opacity-0 transition-all rounded-md focus:bg-neutral-100 px-1.5 py-1"
                      style={{ color: props.colors.label }}
                    />
                  </div>
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
                <div className="h-full flex max-md:absolute max-md:-top-1 max-md:right-0 max-md:h-10">
                  <div onClick={() => {
                    props.changeInput(null, id, index, "visibility");
                  }}
                    className="flex flex-col items-center justify-center h-full cursor-pointer p-2 transition-all hover:bg-neutral-100 rounded-md relative group"
                  >
                    {item.visibility ? (
                      <div className="flex flex-col gap-2">
                        <Icon.Eye size={24} />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Icon.EyeClosed size={24} />
                      </div>
                    )}
                    <div className="max-md:hidden text-sm absolute translate-x-[-50%] left-[50%] bottom-14 hidden group-hover:block text-white px-2.5 py-1 bg-black rounded-full">
                      Visible?
                    </div>
                  </div>
                  {id > 5 && <div

                    onClick={() => {
                      props.deleteItem(id);
                    }}
                    className="flex flex-col items-center justify-center h-full cursor-pointer p-2 transition-all hover:bg-neutral-100 rounded-md relative group"
                  >
                    <div className="flex flex-col gap-2">
                      <Icon.Trash size={24} />
                    </div>
                    <div className="text-sm absolute translate-x-[-50%] left-[50%] bottom-14 hidden group-hover:block text-white px-2.5 py-1 bg-black rounded-full">
                      Remove
                    </div>
                  </div>}
                </div>
              </div>
            )
          } else if (item.type === "fileUpload") {
            return (
              <div key={index} className={"flex md:gap-32 max-md:gap-4 items-center " + (!item.visibility && "opacity-50")}>
                <div className="flex flex-col gap-2 justify-start w-full items-start">
                  <div className="flex justify-start items-center w-full">
                    <div onClick={() => {
                      props.changeInput(null, id, index, "required");
                    }}
                      className="flex flex-col items-center justify-center h-full cursor-pointer p-1 transition-all hover:bg-neutral-100 rounded-md relative group"
                    >
                      {item.required ? (
                        <div className="flex flex-col gap-2">
                          <Icon.Check size={20} weight="bold" />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 text-gray-300">
                          <Icon.Check size={20} weight="bold" />
                        </div>
                      )}
                      <div className="text-sm absolute translate-x-[-50%] left-[50%] bottom-10 hidden group-hover:block text-white px-2.5 py-1 bg-black rounded-full">
                        Required?
                      </div>
                    </div>
                    <input
                      onChange={(e) => {
                        props.changeInput(e, id, index, "label")
                      }}
                      onBlur={props.handleBlur}
                      type="text"
                      value={item.label}
                      className="text-base flex gap-4 items-center w-full bg-transparent focus:outline-none bg-opacity-0 transition-all rounded-md focus:bg-neutral-100 px-1.5 py-1"
                      style={{ color: props.colors.label }}
                    />
                  </div>
                  <div className="flex justify-center gap-3 text-white rounded-xl pl-3 pr-2 py-4 transition-all hover:bg-zinc-800 group w-auto" style={{ backgroundColor: props.colors.primaryButton }}>
                    <Icon.Paperclip size={24} width="bold" className="w-auto" />
                    <input
                      value={item.content}
                      onChange={(e) => {
                        props.changeInput(e, id, index)
                      }}
                      onBlur={props.handleBlur}
                      className="bg-transparent text-white font-medium transition-all focus:outline-none"
                      style={{ width: `${item.content.length + 1}ch` }}
                    />
                  </div>
                </div>
                <div className="flex-grow" />
                <div className="h-full flex">
                  <div onClick={() => {
                    props.changeInput(null, id, index, "visibility");
                  }}
                    className="flex flex-col items-center justify-center h-full cursor-pointer p-2 transition-all hover:bg-neutral-100 rounded-md relative group"
                  >
                    {item.visibility ? (
                      <div className="flex flex-col gap-2">
                        <Icon.Eye size={24} />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Icon.EyeClosed size={24} />
                      </div>
                    )}
                    <div className="text-sm absolute translate-x-[-50%] left-[50%] bottom-14 hidden group-hover:block text-white px-2.5 py-1 bg-black rounded-full">
                      Visible?
                    </div>
                  </div>
                  {id > 5 && <div
                    onClick={() => {
                      props.deleteItem(id);
                    }}
                    className="flex flex-col items-center justify-center h-full cursor-pointer p-2 transition-all hover:bg-neutral-100 rounded-md relative group"
                  >
                    <div className="flex flex-col gap-2">
                      <Icon.Trash size={24} />
                    </div>
                    <div className="text-sm absolute translate-x-[-50%] left-[50%] bottom-14 hidden group-hover:block text-white px-2.5 py-1 bg-black rounded-full">
                      Remove
                    </div>
                  </div>}
                </div>
              </div>
            )
          } else if (item.type === "submit") {
            return (
              <div key={index} className={"flex md:gap-32 max-md:gap-4 items-center " + (!item.visibility && "opacity-50")}>
                <div className={"grow items-start flex flex-col gap-2 " + (props.items.content.indexOf(item) !== props.items.content.length - 1 && "mb-8")}>
                  <div className="flex relative justify-center gap-3 text-white rounded-xl px-3 py-4 transition-all hover:bg-zinc-800 group w-auto" onClick={() => {
                    if (item.type === "submit")
                      props.setConfetti(true)
                    setTimeout(() => {
                      props.setConfetti(false)
                    }, 3000)
                  }} style={{ backgroundColor: props.colors.primaryButton }} >
                    {item.type === "submit" && props.effects.confetti && <div className="absolute w-0 left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%]"><Confetti active={props.confetti} config={config} /></div>}

                    <input
                      value={item.content}
                      onChange={(e) => {
                        props.changeInput(e, id, index)
                      }}
                      onBlur={props.handleBlur}
                      className="bg-transparent text-white font-medium transition-all text-center focus:outline-none"
                      style={{ width: `${item.content.length + 1}ch` }}
                    />
                  </div>
                </div>
                <div className="flex-grow" />
              </div>
            )
          }
        })}
      </div>
    );
  }
);

export default Item;
