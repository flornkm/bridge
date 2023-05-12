import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Fragment } from "react";
import {
  useUser,
  useSupabaseClient,
  useSession,
} from "@supabase/auth-helpers-react";
import * as Icon from "phosphor-react";
import CookieBanner from "@/components/CookieBanner";
import { Popover, Transition, Dialog } from '@headlessui/react'
import { TwitterPicker } from "react-color";
import JobBoard from "@/components/JobBoard";
import CommandMenu from "@/components/CommandMenu";
import { Command } from 'cmdk';

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Editor(props) {
  const [open, setOpen] = useState(false);
  const supabase = useSupabaseClient();
  const session = useSession();
  const user = useUser();
  const [username, setUsername] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [colorSetting, setColorSetting] = useState(false);
  const [effectSetting, setEffectSetting] = useState(false);
  const [animCount, setAnimCount] = useState("1");
  const [confetti, setConfetti] = useState(false);
  const [activeAnim, setActiveAnim] = useState({
    animIn: "fadeIn 1s ease-in-out",
    animOut: "fadeOut 1s ease-in-out",
  });
  const [publishing, setPublishing] = useState(false);
  let [isOpen, setIsOpen] = useState(false);

  const trainsitionPreset = {
    enter: "transform transition duration-[150ms]",
    enterFrom: "opacity-0 scale-90",
    enterTo: "opacity-100 scale-100",
    leave: "transform duration-[150ms] transition ease-in-out",
    leaveFrom: "opacity-100 scale-100",
    leaveTo: "opacity-0 scale-90",
  };

  const [colors, setColors] = useState({
    heading: "#000000",
    text: "#737373",
    label: "#ffffff",
    primaryButton: "#22c55e",
    secondaryButton: "#ef4444",
  });

  const [effects, setEffects] = useState({
    confetti: false,
  });

  const colorStyles = {
    default: {
      card: {
        boxShadow: "none",
        border: "1px solid #e5e7eb",
        borderRadius: "1rem",
      },
      colorSettings: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      },
      swatch: {
        borderRadius: "1000px",
        boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
      },
    }
  }

  const [items, setItems] = useState(null);

  const router = useRouter();

  const fetchProjects = async (id, projectId) => {
    const res = await fetch(
      "/api/projects?user_id=" + id + "&project_id=" + projectId
    );
    const data = await res.json();
    setProject(data);
    setColors({
      heading: data.colors.heading,
      text: data.colors.text,
      label: data.colors.label,
      primaryButton: data.colors.primaryButton,
      danger: data.colors.danger,
    });
    setEffects({
      confetti: data.effects.confetti,
    });
    setLoading(false);
    setItems(data.content);
  };

  async function getProfile() {
    try {
      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
        if (data.avatar_url) {
          downloadImage(data.avatar_url);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function updateColors(color, type) {
    supabase
      .from("projects")
      .update({ colors: { ...colors, [type]: color } })
      .eq("id", router.query.id.replace(session.user.id, ""))
      .eq("owner", session.user.id)
      .then((res) => {
      });
  }

  async function updateEffects(effect, bool) {
    supabase
      .from("projects")
      .update({ effects: { ...effects, [effect]: bool } })
      .eq("id", router.query.id.replace(session.user.id, ""))
      .eq("owner", session.user.id)
      .then((res) => {
      });
  }

  async function add(content) {
    setItems([...items, content]);
    project.content = items;


    // supabase
    //   .from("projects")
    //   .update({ content: items })
    //   .eq("id", router.query.id.replace(session.user.id, ""))
    //   .eq("owner", session.user.id)
    //   .then((res) => {
    //   });
  }

  function publishCheck() {
    setPublishing(true);
    setIsOpen(true);
  }

  async function publish() {
    const { data, error } = await supabase
      .from("published")
      .select("*")
      .eq("id", router.query.id.replace(session.user.id, ""))
      .eq("owner", session.user.id)
      .single();

    if (data) {
      supabase
        .from("published")
        .update({
          id: router.query.id.replace(session.user.id, ""),
          type: "job",
          owner: session.user.id,
          name: project.name,
          content: items,
          colors: colors,
          effects: effects,
        })
        .eq("id", router.query.id.replace(session.user.id, ""))
        .eq("owner", session.user.id)
        .then(() => {
          setPublishing(false);
          setIsOpen(false);
        });
    } else {
      supabase
        .from("published")
        .insert({
          id: router.query.id.replace(session.user.id, ""),
          type: "job",
          owner: session.user.id,
          name: project.name,
          content: items,
          colors: colors,
          effects: effects,
        })
        .then(() => {
          setPublishing(false);
          setIsOpen(false);
        });
    }
  }

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatar(url);
    } catch (error) {
      console.log("Error downloading image: ", error);
    }
  }

  useEffect(() => {
    getProfile();
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (router.query.id && session && user) {
      fetchProjects(session.user.id, router.query.id.replace(user.id, ""));
    } else {
      router.push("/dashboard");
    }
  }, [router.query.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function closeModal() {
    setIsOpen(false);
    setPublishing(false);
  }

  return (
    !loading &&
    project && (
      <>
        <Head>
          <title>{project.name} - Bridge</title>
          <meta
            name="description"
            content="Bridge is a tool that allows you to create interactive elements for your website."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            property="og:title"
            content="Bridge is a tool that allows you to create interactive elements for your website."
          />
          <meta
            property="og:description"
            content="Bridge is a tool that allows you to create interactive elements for your website."
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@floriandwt" />
          <meta name="twitter:title" content="Florian Portfolio" />
          <meta
            name="twitter:image"
            content="/images/bridge_twitter.jpg"
          />
          <meta
            name="twitter:description"
            content="Bridge is a tool that allows you to create interactive elements for your website."
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={"w-screen h-screen overflow-x-hidden bg-zinc-50 bg-cover bg-center " + (project.type === "cookieBanner" && "bg-[url('/images/editor/canvas.svg')]")}>
          <div className="w-full bg-white py-6 fixed top-0 border-b border-b-zinc-200 z-40">
            <div className="max-w-[80%] w-full mx-auto justify-between flex items-center">
              <div className="flex gap-10 items-center">
                <div
                  className="flex gap-2 items-center cursor-pointer transition-all hover:opacity-80"
                  onClick={() => router.push("/dashboard")}
                >
                  <Icon.ArrowLeft size={24} weight="bold" />{" "}
                  <h1 className="text-lg font-medium">Dashboard</h1>
                </div>
              </div>
              <Link target="_blank" href={"/" + project.name.toLowerCase() + "-" + project.id} className="px-4 truncate py-2 text-gray-600 hover:text-black bg-white ring-1 ring-zinc-200 rounded-xl flex gap-2 items-center max-2xl:absolute max-2xl:top-24 max-2xl:left-[50%] max-2xl:translate-x-[-50%] max-md:w-[90%] justify-center">
                <Icon.Link size={20} />
                {"bridge.supply/" + project.name.toLowerCase() + "-" + project.id}
              </Link>
              <div className="flex gap-6 items-stretch relative">
                <div className="bg-zinc-100 ring-1 ring-zinc-200 rounded-full max-sm:hidden">
                  {!avatar ? (
                    <Icon.User size={40} className="p-2" />
                  ) : (
                    <Image
                      src={avatar}
                      alt="Avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                </div>
                <div className="w-[1px] bg-zinc-200 max-sm:hidden" />
                <button onClick={() => {
                  publishCheck();
                }} className={"font-medium text-base px-3 py-2 rounded-lg bg-black text-white transition-all hover:bg-zinc-800 flex gap-2 items-center group " + (publishing && "pointer-events-none")}>
                  {publishing && <div className="h-5 w-5 relative rounded-full ring-2 ring-white z-0 animate-spin"> <div className="absolute -left-1 -top-1 bg-black z-10 h-3 w-3 transition-all group-hover:bg-zinc-800" /> </div>}
                  {!publishing && <Icon.UploadSimple size={20} weight="bold" />}
                  Publish
                </button>
              </div>
            </div>
          </div>
          <div className="bg-zinc-50 pt-40 w-full flex justify-center">
            {project && project.type === "cookieBanner" && (
              <CookieBanner
                data={project}
                session={session}
                id={router.query.id}
                colors={colors}
                animCount={animCount}
                confetti={confetti}
                setConfetti={setConfetti}
                effects={effects}
              />
            )}
            {project && project.type === "job" && (
              <JobBoard
                data={project}
                session={session}
                id={router.query.id}
                colors={colors}
                confetti={confetti}
                setConfetti={setConfetti}
                effects={effects}
                items={items}
                setItems={setItems}
              />
            )}
            <Transition
              show={!colorSetting && !effectSetting}
              as={Fragment}
              enter={trainsitionPreset.enter}
              enterFrom={trainsitionPreset.enterFrom}
              enterTo={trainsitionPreset.enterTo}
              leave={trainsitionPreset.leave}
              leaveFrom={trainsitionPreset.leaveFrom}
              leaveTo={trainsitionPreset.leaveTo}
            ><div className="shadow-lg z-50 px-4 py-2.5 bg-black rounded-full fixed bottom-12 flex gap-4 left-[50%] translate-x-[-50%] items-stretch">
                <Popover className="relative">
                  <Popover.Button className="font-medium text-base h-10 w-10 justify-center rounded-lg bg-black text-white transition-all hover:bg-zinc-800 flex gap-2 items-center">
                    <Icon.Plus size={24} weight="bold" />
                  </Popover.Button>

                  <Popover.Panel className="absolute bottom-0 translate-y-[-56px] rounded-xl bg-black p-1 translate-x-[-50%] left-[50%] truncate text-white flex gap-2" >
                    <div className="flex gap-2 items-center justify-left cursor-pointer hover:bg-zinc-800 pr-3 pl-2 py-1 rounded-lg" onClick={() => {
                      add({
                        id: project.content.length + 1,
                        content: [
                          {
                            type: "textInput",
                            label: "Label",
                            content: "Placeholder",
                            required: false,
                            visibility: true
                          }
                        ]
                      },)
                    }}>
                      <Icon.Textbox size={32} weight="bold" className="p-2" />
                      Text Input
                    </div>
                    <div className="flex gap-2 items-center justify-left cursor-pointer hover:bg-zinc-800 pr-3 pl-2 py-1 rounded-lg" onClick={() => {
                      add({
                        id: project.content.length + 1,
                        content: [
                          {
                            type: "text",
                            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                            visibility: true
                          }
                        ]
                      },)
                    }}>
                      <Icon.TextAa size={32} weight="bold" className="p-2" />
                      Text
                    </div>
                    <div className="flex gap-2 items-center justify-left cursor-pointer hover:bg-zinc-800 pr-3 pl-2 py-1 rounded-lg" onClick={() => {
                      add({
                        id: project.content.length + 1,
                        content: [
                          {
                            type: "textArea",
                            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                            visibility: true
                          }
                        ]
                      },)
                    }}>
                      <Icon.TextAlignLeft size={32} weight="bold" className="p-2" />
                      Textarea
                    </div>
                    <div className="flex gap-2 items-center justify-left cursor-pointer hover:bg-zinc-800 pr-3 pl-2 py-1 rounded-lg" onClick={() => {
                      add({
                        id: project.content.length + 1,
                        content: [
                          {
                            type: "fileUpload",
                            label: "Label",
                            content: "Upload",
                            required: false,
                            visibility: true
                          }
                        ]
                      },)
                    }}>
                      <Icon.File size={32} weight="bold" className="p-2" />
                      File Upload
                    </div>
                  </Popover.Panel>
                </Popover>
                <div className="border-l border-zinc-700 border-dashed" />
                <div className="flex gap-4">
                  <button className="font-medium bg-cover text-base h-10 w-10 justify-center rounded-lg overflow-hidden text-white transition-all hover:bg-zinc-800 flex gap-2 items-center" onClick={() => { setColorSetting(true) }}>
                    <Icon.Drop size={24} weight="bold" className="relative z-10" />
                  </button>
                  <button className="font-medium bg-black bg-cover text-base h-10 w-10 justify-center rounded-lg overflow-hidden text-white transition-all hover:bg-zinc-800 flex gap-2 items-center" onClick={() => { setEffectSetting(true) }}>
                    <Icon.Confetti size={24} weight="bold" />
                  </button>
                </div>
              </div>
            </Transition>
            <Transition
              show={colorSetting}
              as={Fragment}
              enter={trainsitionPreset.enter}
              enterFrom={trainsitionPreset.enterFrom}
              enterTo={trainsitionPreset.enterTo}
              leave={trainsitionPreset.leave}
              leaveFrom={trainsitionPreset.leaveFrom}
              leaveTo={trainsitionPreset.leaveTo}
            ><div className="shadow-lg z-50 px-4 py-2.5 bg-black rounded-full fixed bottom-12 flex gap-4 left-[50%] translate-x-[-50%] items-stretch">
                <button className="font-medium text-base h-10 w-10 justify-center rounded-lg bg-black text-white transition-all hover:bg-zinc-800 flex gap-2 items-center" onClick={() => { setColorSetting(false) }}>
                  <Icon.ArrowLeft size={24} weight="bold" />
                </button>
                <div className="border-l border-zinc-700 border-dashed" />
                <div className="flex text-white">
                  <button className="font-medium text-base rounded-lg flex gap-2 items-center">
                    <Popover className="relative">
                      <Popover.Button className="flex gap-2 transition-all items-center px-3 py-2 rounded-xl hover:bg-zinc-800"><div
                        className={
                          "rounded-full h-6 w-6 shadow-inner shadow-[#FFFFFF33]"
                        }
                        style={{ backgroundColor: colors.heading }}
                      />
                        Heading</Popover.Button>

                      <Popover.Panel className="absolute bottom-0 translate-y-[-56px] rounded-md left-[50%] translate-x-[-50%]" >
                        <TwitterPicker
                          className="bg-black p-1"
                          styles={colorStyles}
                          color={colors.heading}
                          onChangeComplete={(color) => {
                            setColors({ ...colors, heading: color.hex });
                            updateColors(color.hex, "heading");
                          }}
                          triangle="hide"
                          width="330px"
                          colors={[
                            "#ffffff",
                            "#f9fafb",
                            "#f3f4f6",
                            "#e5e7eb",
                            "#d1d5db",
                            "#9ca3af",
                            "#6b7280",
                            "#4b5563",
                            "#374151",
                            "#1f2937",
                            "#111827",
                          ]}
                        />
                      </Popover.Panel>
                    </Popover>
                  </button>
                  <button className="font-medium text-base rounded-lg flex gap-2 items-center">
                    <Popover className="relative">
                      <Popover.Button className="flex gap-2 transition-all items-center px-3 py-2 rounded-xl hover:bg-zinc-800">
                        <div
                          className={
                            "rounded-full h-6 w-6 shadow-inner shadow-[#FFFFFF33]"
                          }
                          style={{ backgroundColor: colors.text }}
                        />
                        Text</Popover.Button>

                      <Popover.Panel className="absolute bottom-0 translate-y-[-56px] rounded-md left-[50%] translate-x-[-50%]" >
                        <TwitterPicker
                          className="bg-white p-1"
                          styles={colorStyles}
                          color={colors.heading}
                          onChangeComplete={(color) => {
                            setColors({ ...colors, text: color.hex });
                            updateColors(color.hex, "text");
                          }}
                          triangle="hide"
                          width="330px"
                          colors={[
                            "#ffffff",
                            "#f9fafb",
                            "#f3f4f6",
                            "#e5e7eb",
                            "#d1d5db",
                            "#9ca3af",
                            "#6b7280",
                            "#4b5563",
                            "#374151",
                            "#1f2937",
                            "#111827",
                          ]}
                        />
                      </Popover.Panel>
                    </Popover>
                  </button>
                  <button className="font-medium text-base rounded-lg flex gap-2 items-center">
                    <Popover className="relative">
                      <Popover.Button className="flex gap-2 transition-all items-center px-3 py-2 rounded-xl hover:bg-zinc-800">
                        <div
                          className={
                            "rounded-full h-6 w-6 shadow-inner shadow-[#FFFFFF33]"
                          }
                          style={{ backgroundColor: colors.label }}
                        />
                        Labels</Popover.Button>

                      <Popover.Panel className="absolute bottom-0 translate-y-[-56px] rounded-md left-[50%] translate-x-[-50%]" >
                        <TwitterPicker
                          className="bg-white p-1"
                          styles={colorStyles}
                          color={colors.label}
                          onBlur={() => {
                            console.log("blur");
                          }}
                          onChangeComplete={(color) => {
                            setColors({ ...colors, label: color.hex });
                            updateColors(color.hex, "label");
                          }}
                          triangle="hide"
                          width="330px"
                          colors={[
                            "#ffffff",
                            "#f9fafb",
                            "#f3f4f6",
                            "#e5e7eb",
                            "#d1d5db",
                            "#9ca3af",
                            "#6b7280",
                            "#4b5563",
                            "#374151",
                            "#1f2937",
                            "#111827",
                          ]}
                        />
                      </Popover.Panel>
                    </Popover>
                  </button>
                  <button className="font-medium text-base rounded-lg flex gap-2 items-center">
                    <Popover className="relative">
                      <Popover.Button className="flex gap-2 transition-all items-center px-3 py-2 rounded-xl hover:bg-zinc-800">
                        <div
                          className={
                            "rounded-full h-6 w-6 shadow-inner shadow-[#FFFFFF33]"
                          }
                          style={{ backgroundColor: colors.primaryButton }}
                        />
                        Buttons</Popover.Button>

                      <Popover.Panel className="absolute bottom-0 translate-y-[-56px] rounded-md left-[50%] translate-x-[-50%]" >
                        <TwitterPicker
                          className="bg-white p-1"
                          styles={colorStyles}
                          color={colors.primaryButton}
                          onChangeComplete={(color) => {
                            setColors({ ...colors, primaryButton: color.hex });
                            updateColors(color.hex, "primaryButton");
                          }}
                          triangle="hide"
                          width="330px"
                          colors={[
                            "#14b8a6",
                            "#06b6d4",
                            "#0ea5e9",
                            "#3b82f6"
                          ]}
                        />
                      </Popover.Panel>
                    </Popover>
                  </button>
                  <button className="font-medium text-base rounded-lg flex gap-2 items-center">
                    <Popover className="relative">
                      <Popover.Button className="flex gap-2 transition-all items-center px-3 py-2 rounded-xl hover:bg-zinc-800">
                        <div
                          className={
                            "rounded-full h-6 w-6 shadow-inner shadow-[#FFFFFF33]"
                          }
                          style={{ backgroundColor: colors.danger }}
                        />
                        Alerts</Popover.Button>

                      <Popover.Panel className="absolute bottom-0 translate-y-[-56px] rounded-md left-[50%] translate-x-[-50%]" >
                        <TwitterPicker
                          className="bg-white p-1"
                          styles={colorStyles}
                          color={colors.danger}
                          onBlur={() => {
                            console.log("blur");
                          }}
                          onChangeComplete={(color) => {
                            setColors({ ...colors, danger: color.hex });
                            updateColors(color.hex, "danger");
                          }}
                          triangle="hide"
                          width="330px"
                          colors={[
                            // some red tailwind colors
                            "#f43f5e",
                            "#ec4899",
                            "#d946ef",
                            "#a855f7"
                          ]}
                        />
                      </Popover.Panel>
                    </Popover>
                  </button>
                </div>
              </div>
            </Transition>
            {project.type === "cookieBanner" && <Transition
              as={Fragment}
              enter={trainsitionPreset.enter}
              enterFrom={trainsitionPreset.enterFrom}
              enterTo={trainsitionPreset.enterTo}
              leave={trainsitionPreset.leave}
              leaveFrom={trainsitionPreset.leaveFrom}
              leaveTo={trainsitionPreset.leaveTo}
            ><div className="shadow-lg z-50 px-4 py-2.5 bg-black rounded-full fixed bottom-12 flex gap-4 left-[50%] translate-x-[-50%] items-stretch">
                <button className="font-medium text-base h-10 w-10 justify-center rounded-lg bg-black text-white transition-all hover:bg-zinc-800 flex gap-2 items-center" onClick={() => { setAnimationSetting(false) }}>
                  <Icon.ArrowLeft size={24} weight="bold" />
                </button>
                <div className="w-[1px] bg-zinc-200" />
                <button className="font-medium text-base px-3 py-2 rounded-lg flex gap-2 items-center" onClick={() => { setAnimationSetting(true) }}>
                  <Popover className="relative">
                    <Popover.Button className="flex gap-2 transition-all hover:opacity-80">
                      <Icon.ArrowLineRight size={20} weight="bold" />
                      Animation In</Popover.Button>
                    <Popover.Panel className="absolute bottom-0 translate-y-[-64px] rounded-xl flex gap-4 p-1 w-56 justify-between bg-white ring-1 ring-zinc-200" >
                      <p onClick={() => {
                        updateAnimations("fadeIn 1s ease-in-out", "animIn");
                        setActiveAnim({ ...activeAnim, animIn: "fadeIn 1s ease-in-out" });
                      }}
                        onMouseOver={() => {
                          setAnimations({
                            ...animations,
                            animIn: "fadeIn 1s ease-in-out",
                          });
                          setAnimCount("infinite");
                        }}
                        onMouseOut={() => {
                          setAnimCount("1");
                        }}
                        className={"cursor-pointer px-4 py-2 w-full rounded-lg transition-all hover:opacity-80 " + (activeAnim.animIn === "fadeIn 1s ease-in-out" ? "bg-black text-white" : "bg-white text-black")}
                      >Fade in</p>
                      <p
                        onClick={() => {
                          updateAnimations("slideIn 1s ease-in-out", "animIn");
                          setActiveAnim({ ...activeAnim, animIn: "slideIn 1s ease-in-out" });
                        }}
                        onMouseOver={() => {
                          setAnimations({
                            ...animations,
                            animIn: "slideIn 1s ease-in-out",
                          });
                          setAnimCount("infinite");
                        }}
                        onMouseOut={() => {
                          setAnimCount("1");
                        }}
                        className={"cursor-pointer px-4 py-2 w-full rounded-lg transition-all hover:opacity-80 " + (activeAnim.animIn === "slideIn 1s ease-in-out" ? "bg-black text-white" : "bg-white text-black")}
                      >Slide in</p>
                    </Popover.Panel>
                  </Popover>
                </button>
                <button className="font-medium text-base px-3 py-2 rounded-lg flex gap-2 items-center transition-all hover:opacity-80" onClick={() => { setAnimationSetting(true) }}>
                  <Popover className="relative">
                    <Popover.Button className="flex gap-2 transition-all hover:opacity-80">
                      <Icon.ArrowLineLeft size={20} weight="bold" />
                      Animation Out</Popover.Button>
                    <Popover.Panel className="absolute bottom-0 translate-y-[-64px] rounded-xl flex gap-4 p-1 w-56 justify-between bg-white ring-1 ring-zinc-200" >
                      <p onClick={() => {
                        updateAnimations("fadeOut 1s ease-in-out", "animOut");
                        setActiveAnim({ ...activeAnim, animOut: "fadeOut 1s ease-in-out" });
                      }}
                        onMouseOver={() => {
                          setAnimations({
                            ...animations,
                            animIn: "fadeOut 1s ease-in-out",
                          });
                          setAnimCount("infinite");
                        }}
                        onMouseOut={() => {
                          setAnimCount("1");
                        }}
                        className={"cursor-pointer px-4 py-2 w-full rounded-lg transition-all hover:opacity-80 " + (activeAnim.animOut === "fadeOut 1s ease-in-out" ? "bg-black text-white" : "bg-white text-black")}
                      >Fade out</p>
                      <p
                        onClick={() => {
                          updateAnimations("slideOut 1s ease-in-out", "animOut");
                          setActiveAnim({ ...activeAnim, animOut: "slideOut 1s ease-in-out" });
                        }}
                        onMouseOver={() => {
                          setAnimations({
                            ...animations,
                            animIn: "slideOut 1s ease-in-out",
                          });
                          setAnimCount("infinite");
                        }}
                        onMouseOut={() => {
                          setAnimCount("1");
                        }}
                        className={"cursor-pointer px-4 py-2 w-full rounded-lg transition-all hover:opacity-80 " + (activeAnim.animOut === "slideOut 1s ease-in-out" ? "bg-black text-white" : "bg-white text-black")}
                      >Slide out</p>
                    </Popover.Panel>
                  </Popover>
                </button>
              </div>
            </Transition>}
            <Transition
              show={effectSetting}
              as={Fragment}
              enter={trainsitionPreset.enter}
              enterFrom={trainsitionPreset.enterFrom}
              enterTo={trainsitionPreset.enterTo}
              leave={trainsitionPreset.leave}
              leaveFrom={trainsitionPreset.leaveFrom}
              leaveTo={trainsitionPreset.leaveTo}
            ><div className="shadow-lg z-50 px-4 py-2.5 bg-black rounded-full fixed bottom-12 flex gap-4 left-[50%] translate-x-[-50%] items-stretch">
                <button className="font-medium text-base h-10 w-10 justify-center rounded-lg bg-black text-white transition-all hover:bg-zinc-800 flex gap-2 items-center" onClick={() => { setEffectSetting(false) }}>
                  <Icon.ArrowLeft size={24} weight="bold" />
                </button>
                <div className="border-l border-zinc-700 border-dashed" />
                <button className="font-medium text-base rounded-lg flex gap-2 items-center text-white" onClick={() => { setEffectSetting(true) }}>
                  <Popover className="relative">
                    <Popover.Button className="flex gap-2 transition-all items-center px-3 py-2 rounded-xl hover:bg-zinc-800">
                      <Icon.Cursor size={20} weight="fill" />
                      Confirm</Popover.Button>
                    <Popover.Panel className="absolute bottom-0 translate-y-[-56px] left-[50%] translate-x-[-50%] rounded-xl flex gap-2 p-1 w-auto justify-between bg-black" >
                      <div
                        onClick={() => {
                          setEffects({ ...effects, confetti: false });
                          updateEffects("confetti", false);
                        }}
                        className={"cursor-pointer h-10 w-10 flex items-center justify-center rounded-lg transition-all " + (effects.confetti ? "bg-black text-white hover:bg-zinc-800" : "bg-white text-black hover:bg-zinc-100")}
                      >
                        <Icon.Placeholder size={20} weight="bold" />
                      </div>
                      <div
                        onClick={() => {
                          setEffects({ ...effects, confetti: true });
                          updateEffects("confetti", true);
                        }}
                        className={"cursor-pointer h-10 w-10 flex items-center justify-center rounded-lg transition-all " + (!effects.confetti ? "bg-black text-white hover:bg-zinc-800" : "bg-white text-black hover:bg-zinc-100")}
                      >
                        <Icon.Confetti size={20} weight="bold" />
                      </div>
                    </Popover.Panel>
                  </Popover>
                </button>
              </div>
            </Transition>
          </div>
          <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-xl font-medium leading-6 text-gray-900 flex items-center gap-3 mb-4"
                      >
                        {publishing && <div className="h-5 w-5 relative rounded-full ring-2 ring-black z-0 animate-spin"> <div className="absolute -left-1 -top-1 bg-white z-10 h-3 w-3 transition-all group-hover:bg-zinc-800" /> </div>}
                        Publish changes?
                      </Dialog.Title>
                      <div>
                        <p className="text-gray-500 mb-4">
                          Your changes are going to get shown to the world.
                        </p>
                        <p className="text-yellow-700 mt-2 flex gap-4 items-center p-2 rounded-md bg-yellow-50">
                          <Icon.Warning size={40} weight="fill" className="text-yellow-500" /> Please note that Label- and Orderchanges result in not
                          showing your old submissions anymore.
                        </p>
                      </div>
                      <div className="w-full flex justify-left gap-4 mt-14">
                        <div className="w-full">
                          <button
                            onClick={closeModal}
                            className="font-medium px-3 py-2 rounded-lg border border-zinc-200 bg-white text-black transition-all outline-gray-300 hover:bg-zinc-50 w-full focus:outline-gray-300">
                            Cancel
                          </button>
                        </div>
                        <div className="w-full">
                          <button
                            onClick={publish}
                            className="font-medium px-3 py-2 rounded-lg bg-black text-white transition-all hover:bg-zinc-800 w-full focus:outline-gray-300">
                            Publish
                          </button>
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
          <CommandMenu
            open={open}
            setOpen={setOpen}
            commands={
              <>
                <Command.Item
                  key={1}
                  value="Create new project"
                  tabIndex={0}
                  onSelect={() => {
                    router.push("/dashboard");
                  }}

                  className="mb-1 focus:outline-none flex items-center gap-3 outline-none p-2 cursor-pointer transition-all bg-black hover:bg-opacity-5 aria-selected:bg-opacity-5 bg-opacity-0 rounded-md ">
                  <Icon.ArrowBendUpLeft size={18} weight="bold" />
                  Back to Dashboard
                </Command.Item>
              </>
            }
          />
        </div>
      </>
    )
  );
}
