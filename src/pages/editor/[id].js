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
import { Menu, Transition } from "@headlessui/react";

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

  const [colors, setColors] = useState({
    heading: "#000000",
    text: "#737373",
    primary: "#22c55e",
    secondary: "#ef4444",
  });

  const router = useRouter();

  const fetchProjects = async (id, projectId) => {
    const res = await fetch(
      "/api/projects?user_id=" + id + "&project_id=" + projectId
    );
    const data = await res.json();
    setProject(data);
    
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
          />
        )}
        <div className="p-6 bg-white ring-1 ring-neutral-200 rounded-full absolute bottom-24 flex gap-4 left-[50%] translate-x-[-50%] items-stretch">
          <button className="font-medium text-base px-3 py-2 rounded-lg bg-black text-white transition-all hover:bg-zinc-800 flex gap-2 items-center">
            <Icon.Plus size={20} weight="bold" />
            Add
          </button>
          <div className="w-[1px] bg-neutral-200" />
          <div className="flex">
            <Menu as="div" className="relative inline-block text-left">
              <div className="h-full flex items-center">
                <Menu.Button className="font-medium text-base px-3 py-2 rounded-lg flex gap-2 items-center transition-all hover:opacity-80">
                  <Icon.Drop size={20} weight="bold" />
                  Colors
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute bottom-[80px] left-[50%] translate-x-[-50%] rounded-full bg-white ring-neutral-200 ring-1">
                  <div className="p-1 font-medium flex items-end">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "flex px-4 py-2 text-xs rounded-full flex-col gap-3 items-center w-24"
                          )}
                        >
                          <div
                            className={
                              "rounded-full h-6 w-6 ring-1 ring-neutral-300"
                            }
                            style={{ backgroundColor: colors.heading }}
                          />
                          Heading
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "flex px-4 py-2 text-xs rounded-full flex-col gap-3 items-center w-24"
                          )}
                        >
                          <div
                            className={
                              "rounded-full h-6 w-6 ring-1 ring-neutral-300"
                            }
                            style={{ backgroundColor: colors.text }}
                          />
                          Text
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "flex px-4 py-2 text-xs rounded-full flex-col gap-3 items-center w-24"
                          )}
                        >
                          <div
                            className={
                              "rounded-full h-6 w-6 ring-1 ring-neutral-300"
                            }
                            style={{ backgroundColor: colors.primary }}
                          />
                          Primary
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "flex px-4 py-2 text-xs rounded-full flex-col gap-3 items-center w-24"
                          )}
                        >
                          <div
                            className={
                              "rounded-full h-6 w-6 ring-1 ring-neutral-300"
                            }
                            style={{ backgroundColor: colors.secondary }}
                          />
                          Secondary
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
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
      </div>
    )
  );
}
