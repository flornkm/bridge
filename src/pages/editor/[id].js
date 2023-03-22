import { useRouter } from "next/router";
import Image from "next/image";
import { useState, useEffect, Fragment } from "react";
import {
  useUser,
  useSupabaseClient,
  useSession,
} from "@supabase/auth-helpers-react";
import * as Icon from "phosphor-react";
import CookieBanner from "@/components/CookieBanner";
import { Popover, Transition } from '@headlessui/react'
import { TwitterPicker } from "react-color";
import { update } from "lodash";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Editor(props) {
  const supabase = useSupabaseClient();
  const session = useSession();
  const user = useUser();
  const [username, setUsername] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [colorSetting, setColorSetting] = useState(false);

  const [colors, setColors] = useState({
    heading: "#000000",
    text: "#737373",
    primaryButton: "#22c55e",
    secondaryButton: "#ef4444",
  });

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
      primaryButton: data.colors.primaryButton,
      secondaryButton: data.colors.secondaryButton,
    });
    setLoading(false);
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
        console.log(res);
      });
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
    if (router.query.id) {
      fetchProjects(session.user.id, router.query.id.replace(user.id, ""));
    }
  }, [router.query.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    !loading &&
    project && (
      <div className="w-screen h-screen bg-neutral-50 bg-[url('/images/editor/canvas.svg')] bg-cover bg-center">
        <div className="w-full bg-white py-6 fixed top-0 border-b border-b-neutral-200">
          <div className="max-w-[80%] w-full mx-auto justify-between flex items-center overflow-hidden">
            <div className="flex gap-10 items-center">
              <div
                className="flex gap-2 items-center cursor-pointer transition-all hover:opacity-80"
                onClick={() => router.push("/dashboard")}
              >
                <Icon.ArrowLeft size={20} weight="bold" />{" "}
                <h1 className="text-lg font-medium">Dashboard</h1>
              </div>
              <div className="flex gap-6">
                <Icon.ArrowArcLeft
                  size={20}
                  weight="bold"
                  className="cursor-pointer transition-all hover:opacity-80"
                />
                <Icon.ArrowArcRight
                  size={20}
                  weight="bold"
                  className="cursor-pointer transition-all hover:opacity-80"
                />
              </div>
            </div>
            <div className="flex gap-6 items-stretch">
              <div className="bg-neutral-100 ring-1 ring-neutral-200 rounded-full">
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
              <div className="w-[1px] bg-neutral-200" />
              <button className="font-medium text-base px-3 py-2 rounded-lg bg-black text-white transition-all hover:bg-zinc-800 flex gap-2 items-center">
                <Icon.UploadSimple size={20} weight="bold" />
                Export
              </button>
            </div>
          </div>
        </div>
        {project && project.type === "cookieBanner" && (
          <CookieBanner
            data={project}
            session={session}
            id={router.query.id}
            colors={colors}
          />
        )}
        <Transition
          show={!colorSetting}
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        ><div className="p-6 bg-white ring-1 ring-neutral-200 rounded-full absolute bottom-24 flex gap-4 left-[50%] translate-x-[-50%] items-stretch">
            <button className="font-medium text-base px-3 py-2 rounded-lg bg-black text-white transition-all hover:bg-zinc-800 flex gap-2 items-center">
              <Icon.Plus size={20} weight="bold" />
              Add
            </button>
            <div className="w-[1px] bg-neutral-200" />
            <div className="flex">
              <button className="font-medium text-base px-3 py-2 rounded-lg flex gap-2 items-center transition-all hover:opacity-80" onClick={() => { setColorSetting(true) }}>
                <Icon.Drop size={20} weight="bold" />
                Colors
              </button>
              <button className="font-medium text-base px-3 py-2 rounded-lg flex gap-2 items-center transition-all hover:opacity-80">
                <Icon.LineSegment size={20} weight="bold" />
                Animation
              </button>
              <button className="font-medium text-base px-3 py-2 rounded-lg flex gap-2 items-center transition-all hover:opacity-80">
                <Icon.Confetti size={20} weight="bold" />
                Effects
              </button>
            </div>
          </div>
        </Transition>
        <Transition
          show={colorSetting}
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        ><div className="p-6 bg-white ring-1 ring-neutral-200 rounded-full absolute bottom-24 flex gap-4 left-[50%] translate-x-[-50%] items-stretch">
            <button className="font-medium text-base px-3 py-2 rounded-lg bg-black text-white transition-all hover:bg-zinc-800 flex gap-2 items-center" onClick={() => { setColorSetting(false) }}>
              <Icon.ArrowLeft size={20} weight="bold" />
              Back
            </button>
            <div className="w-[1px] bg-neutral-200" />
            <div className="flex">
              <button className="font-medium text-base px-3 py-2 rounded-lg flex gap-2 items-center">
                <Popover className="relative">
                  <Popover.Button className="flex gap-2 transition-all hover:opacity-80"><div
                    className={
                      "rounded-full h-6 w-6 ring-1 ring-neutral-300"
                    }
                    style={{ backgroundColor: colors.heading }}
                  />
                    Heading</Popover.Button>

                  <Popover.Panel className="absolute bottom-0 translate-y-[-64px] rounded-md" >
                    <TwitterPicker
                      className="bg-white p-2"
                      styles={{
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
                          }
                        },
                      }}
                      color={colors.heading}
                      onBlur={() => {
                        console.log("blur");
                      }}
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
              <button className="font-medium text-base px-3 py-2 rounded-lg flex gap-2 items-center">
                <Popover className="relative">
                  <Popover.Button className="flex gap-2 transition-all hover:opacity-80">
                    <div
                      className={
                        "rounded-full h-6 w-6 ring-1 ring-neutral-300"
                      }
                      style={{ backgroundColor: colors.text }}
                    />
                    Text</Popover.Button>

                  <Popover.Panel className="absolute bottom-0 translate-y-[-64px] rounded-md" >
                    <TwitterPicker
                      className="bg-white p-2"
                      styles={{
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
                          }
                        },
                      }}
                      color={colors.heading}
                      onBlur={() => {
                        console.log("blur");
                      }}
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
              <button className="font-medium text-base px-3 py-2 rounded-lg flex gap-2 items-center">
                <Popover className="relative">
                  <Popover.Button className="flex gap-2 transition-all hover:opacity-80">
                    <div
                      className={
                        "rounded-full h-6 w-6 ring-1 ring-neutral-300"
                      }
                      style={{ backgroundColor: colors.primaryButton }}
                    />
                    Primary</Popover.Button>

                  <Popover.Panel className="absolute bottom-0 translate-y-[-64px] rounded-md" >
                    <TwitterPicker
                      className="bg-white p-2"
                      styles={{
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
                          }
                        },
                      }}
                      color={colors.primaryButton}
                      onBlur={() => {
                        console.log("blur");
                      }}
                      onChangeComplete={(color) => {
                        setColors({ ...colors, primaryButton: color.hex });
                        updateColors(color.hex, "primaryButton");
                      }}
                      triangle="hide"
                      width="330px"
                      colors={[
                        "#22c55e",
                        "#10b981",
                        "#06b6d4",
                        "#0ea5e9",
                      ]}
                    />
                  </Popover.Panel>
                </Popover>
              </button>
              <button className="font-medium text-base px-3 py-2 rounded-lg flex gap-2 items-center">
                <Popover className="relative">
                  <Popover.Button className="flex gap-2 transition-all hover:opacity-80">
                    <div
                      className={
                        "rounded-full h-6 w-6 ring-1 ring-neutral-300"
                      }
                      style={{ backgroundColor: colors.secondaryButton }}
                    />
                    Secondary</Popover.Button>

                  <Popover.Panel className="absolute bottom-0 translate-y-[-64px] rounded-md" >
                    <TwitterPicker
                      className="bg-white p-2"
                      styles={{
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
                          }
                        },
                      }}
                      color={colors.secondaryButton}
                      onBlur={() => {
                        console.log("blur");
                      }}
                      onChangeComplete={(color) => {
                        setColors({ ...colors, secondaryButton: color.hex });
                        updateColors(color.hex, "secondaryButton");
                      }}
                      triangle="hide"
                      width="330px"
                      colors={[
                        // some red tailwind colors
                        "#ef4444",
                        "#fbbf24",
                        "#f59e0b",
                      ]}
                    />
                  </Popover.Panel>
                </Popover>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    )
  );
}
