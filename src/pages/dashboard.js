import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";
import {
  useUser,
  useSupabaseClient,
  useSession,
} from "@supabase/auth-helpers-react";
import { Menu, Transition } from "@headlessui/react";
import Account from "@/components/Account";
import ProjectSetup from "@/components/ProjectSetup";
import * as Icon from "phosphor-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Dashboard(props) {
  const supabase = useSupabaseClient();
  const session = useSession();
  const user = useUser();
  const [username, setUsername] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [setup, setSetup] = React.useState(false);
  const [avatar_url, setAvatarUrl] = React.useState(null);
  const [avatar, setAvatar] = React.useState(null);
  const [settings, setSettings] = React.useState(false);
  const [projects, setProjects] = React.useState([]);

  const router = useRouter();

  React.useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);

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
      router.push("/login");
      console.log(error);
    } finally {
      setLoading(false);
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

  const fetchProjects = async (id) => {
    const res = await fetch("/api/projects?user_id=" + id);
    const data = await res.json();
    // sort by the most recent
    data.sort((a, b) => b.id - a.id);
    setProjects(data);
  };

  const selectProject = (id) => {
    if (id === 1) {
      console.log("Create a new project");
    }
  };

  const openSetup = () => {
    setSetup(true);
  };

  const closeSetup = () => {
    setSetup(false);
  };

  const deleteProject = async (id) => {
    const res = await fetch("/api/projects?project_id=" + id, {
      method: "DELETE",
    });
    const data = await res.json();
    console.log(data);
    fetchProjects(session.user.id);
  };

  const createProject = async (project) => {

    project.owner = session.user.id;

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });
    const data = await res.json();
    console.log(data);
    setSetup(false);
    fetchProjects(session.user.id);
  };

  React.useEffect(() => {
    router.push("/dashboard");

    if (session)
      fetchProjects(session.user.id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Head>
        <title>Project Dashboard - Bridge</title>
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
        <meta
          property="og:image"
          content="/images/bridge_opengraph.jpg"
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
      <div className="w-screen h-screen bg-neutral-50 bg-[url('/images/dashboard/dashboard_gradient.jpg')] bg-cover">
        <div className="w-full bg-white py-6 bg-opacity-80 fixed top-0 backdrop-blur-xl z-50">
          <div className="max-w-[80%] w-full mx-auto justify-between flex items-center">
            <h1 className="text-lg font-medium">Dashboard</h1>
            <div className="flex">
              <Menu as="div" className="relative inline-block text-left">
                <div className="h-full flex items-center">
                  <Menu.Button className="bg-neutral-100 ring-1 ring-neutral-200 cursor-pointer rounded-full transition-all hover:opacity-80">
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
                  </Menu.Button>
                </div>

                <Transition
                  as={React.Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="p-1 font-medium">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm rounded-md"
                            )}
                            onClick={() => setSettings(true)}
                          >
                            Account settings
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
                              "block px-4 py-2 text-sm rounded-md"
                            )}
                          >
                            Support
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
                              "block px-4 py-2 text-sm rounded-md"
                            )}
                          >
                            License
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            type="submit"
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block w-full px-4 py-2 text-left text-sm rounded-md"
                            )}
                            onClick={() => {
                              router.push("/login");
                              supabase.auth.signOut();
                            }}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
          <div className="h-[1px] w-full bg-gradient-to-r from-violet-300 to-neutral-50 absolute bottom-0" />
        </div>
        <div className="pt-40 text-3xl font-semibold max-w-[80%] mx-auto mb-8 flex justify-between items-center flex-wrap gap-4">
          <h2>Your projects</h2>
          <button
            onClick={() => {
              setSetup(true);
            }}
            className="font-medium text-base px-3 py-2 rounded-lg bg-black text-white transition-all hover:bg-zinc-800"
          >
            Create Project
          </button>
        </div>
        <div className="grid grid-cols-3 gap-10 max-w-[80%] mx-auto max-md:grid-cols-1 max-xl:grid-cols-2 pb-32">
          {projects.length === 0 && (
            <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-6 bg-black overflow-hidden rounded-lg mix-blend-exclusion">
              <div className="h-16 w-16 relative rounded-full ring-8 ring-white z-0 animate-spin"> <div className="absolute -left-4 -top-4 bg-black z-10 h-12 w-12 transition-all" /> </div>
            </div>
          )}
          {projects.length > 0 && projects.map((project) => (
            <div
              key={project.id}
              className="col-span-1 bg-white rounded-lg ring-1 ring-neutral-200 p-6 cursor-pointer transition-all hover:bg-opacity-80 shadow-lg shadow-neutral-100 active:ring-neutral-300"
              onClick={(e) => {
                console.log(e.target.tagName);
                if (e.target.tagName !== "A" && e.target.tagName !== "BUTTON") {
                  selectProject(project.id);
                  router.push("/editor/" + project.owner + project.id);
                }
              }}
            >
              <div>
                <div className="bg-indigo-50 mb-6 h-56 rounded-lg ring-1 ring-indigo-200 gap-1 px-8 flex flex-col items-left justify-center truncate">
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-blue-600 flex flex-col gap-4">
                    {
                      project.content.map((item, index) => {
                        if (item.id < 6) {
                          const maxLength = Math.max(...project.content.map(item => item.content[0].content.length));
                          const percentage = ((item.content[0].content.length + 1) / maxLength) * 100;
                          const limitedPercentage = percentage > 100 ? 100 : percentage;
                          return (
                            <div
                              key={index}
                              className="h-3 bg-indigo-500 opacity-30 rounded-full"
                              style={{ width: `${limitedPercentage}%` }}
                            />
                          )
                        }
                      })
                    }
                  </div>
                </div>
              </div>
              <div className="flex w-full justify-between gap-4 items-center">
                <div className="truncate">
                  <h1 className="text-lg font-medium mb-2">{project.name}</h1>
                  <Link target="_blank" href={"/" + project.owner + project.id} className="text-xs text-gray-500 relative z-10 hover:text-black" >
                    https://bridge.supply/{project.owner + project.id}
                  </Link>
                </div>
                <div>
                </div>
                <button className="flex flex-col items-center justify-center ">
                  <Menu as="div" className="relative inline-block text-left">
                    <div className="h-full flex items-center">
                      <Menu.Button className="cursor-pointer p-2 transition-all hover:bg-neutral-100 rounded-md relative text-gray-500 hover:text-black ">
                        <Icon.DotsThree weight="bold" className="w-6 h-6 pointer-events-none " />
                      </Menu.Button>
                    </div>

                    <Transition
                      as={React.Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="p-1 font-medium">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                type="submit"
                                onClick={() => {
                                  deleteProject(project.id);
                                }}
                                className={classNames(
                                  active
                                    ? "bg-red-100 text-red-900"
                                    : "text-red-700",
                                  "block w-full px-4 py-2 text-left text-sm rounded-md"
                                )}
                              >
                                Delete
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </button>
              </div>
            </div>
          ))}
        </div>
        {settings && (
          <Account
            session={session}
            setSettings={setSettings}
            avatar_url={avatar_url}
            setAvatarUrl={setAvatarUrl}
            avatar={avatar}
            setAvatar={setAvatar}
          />
        )}
        <ProjectSetup isOpen={setup} setIsOpen={setSetup} openSetup={openSetup} closeSetup={closeSetup} createProject={createProject} />
      </div>
    </>
  );
}

export default Dashboard;
