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
import CommandMenu from "@/components/CommandMenu";
import { set } from "lodash";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Dashboard(props) {
  const [open, setOpen] = React.useState(false);
  const supabase = useSupabaseClient();
  const session = useSession();
  const user = useUser();
  const [username, setUsername] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [projectLoading, setProjectLoading] = React.useState(true);
  const [setup, setSetup] = React.useState(false);
  const [avatar_url, setAvatarUrl] = React.useState(null);
  const [avatar, setAvatar] = React.useState(null);
  const [settings, setSettings] = React.useState(false);
  const [projects, setProjects] = React.useState([]);
  const [names, setNames] = React.useState([]);

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
    setNames(data.map((project) => project.name));
    setProjectLoading(false);
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
    if (project.name !== "") {
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
    }
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
      <div className="w-screen h-screen bg-zinc-50 bg-[url('/images/dashboard/dashboard_gradient.jpg')] bg-cover">
        <div className="w-full bg-white py-6 bg-opacity-80 fixed top-0 backdrop-blur-xl z-50">
          <div className="max-w-[80%] w-full mx-auto justify-between flex items-center">
            <h1 className="text-lg font-medium">Dashboard</h1>
            <div className="flex">
              <Menu as="div" className="relative inline-block text-left">
                <div className="h-full flex items-center">
                  <Menu.Button className="bg-zinc-100 ring-1 ring-zinc-200 cursor-pointer rounded-full transition-all hover:opacity-80">
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
                                ? "bg-zinc-100 text-gray-900"
                                : "text-zinc-700",
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
                                ? "bg-zinc-100 text-gray-900"
                                : "text-zinc-700",
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
                                ? "bg-zinc-100 text-gray-900"
                                : "text-zinc-700",
                              "block px-4 py-2 text-sm rounded-md"
                            )}
                          >
                            Upgrade to Pro
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            type="submit"
                            className={classNames(
                              active
                                ? "bg-zinc-100 text-gray-900"
                                : "text-zinc-700",
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
          <div className="h-[1px] w-full bg-gradient-to-r from-violet-300 to-zinc-50 absolute bottom-0" />
        </div>
        <div className="pt-40 text-3xl font-semibold max-w-[80%] mx-auto mb-8 flex justify-between items-center flex-wrap gap-4">
          <h2>Your projects</h2>
          {projects.length !== 0 && <button
            onClick={() => {
              setSetup(true);
            }}
            className="font-medium text-base px-3 py-2 rounded-lg bg-black text-white transition-all hover:bg-zinc-800"
          >
            Create Project
          </button>}
        </div>
        <div className="grid grid-cols-3 gap-10 max-w-[80%] mx-auto max-md:grid-cols-1 max-xl:grid-cols-2 pb-32">
          {projectLoading && (
            <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-6 bg-black overflow-hidden rounded-lg mix-blend-exclusion">
              <div className="h-16 w-16 relative rounded-full ring-8 ring-white z-0 animate-spin"> <div className="absolute -left-4 -top-4 bg-black z-10 h-12 w-12 transition-all" /> </div>
            </div>
          )}
          {projects.length === 0 && !projectLoading && (
            <div className="absolute translate-x-[-50%] left-[50%] top-[50%] translate-y-[-50%] flex flex-col gap-4 px-12 py-10 rounded-2xl shadow-lg shadow-zinc-100 bg-white border border-zinc-200">
              <h1 className="w-full text-3xl font-semibold">
                No Projects yet
              </h1>
              <p className="mb-8 text-zinc-500">
                Create a project to get started by clicking the button below.
              </p>
              <button
                onClick={() => {
                  setSetup(true);
                }}
                className="font-medium text-base px-3 py-2 rounded-lg bg-black text-white transition-all hover:bg-zinc-800"
              >
                Create Project
              </button>
            </div>
          )}
          {projects.length > 0 && !projectLoading && projects.map((project, index) => (
            <div
              key={project.id}
              className="col-span-1 bg-white rounded-2xl border border-zinc-200 p-6 cursor-pointer transition-all hover:bg-zinc-50 group relative"
              onClick={(e) => {
                console.log(e.target.tagName);
                if (e.target.tagName !== "A" && e.target.tagName !== "BUTTON" && e.target.tagName !== "INPUT") {
                  selectProject(project.id);
                  router.push("/editor/" + project.owner + project.id);
                }
              }}
            >
              <div>
                <div className="bg-zinc-100 mb-6 h-56 rounded-lg border border-zinc-200 gap-1 flex flex-col items-left justify-center truncate">
                  <Image
                    src={`https://bridge.supply/api/og?title=${project.name}&text=${project.content[0].content[0].content}&image=${project.content[0].content[1].content}`}
                    alt={project.name}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="flex w-full justify-between gap-4 items-center">
                <div className="">
                  <div className=" w-full group mb-2 relative">
                    <input
                      type="text"
                      className="text-lg font-medium relative z-10 w-full bg-transparent focus-within:bg-white rounded-md border border-transparent transition-all focus-within:px-1.5"
                      value={names[index]}
                      onChange={(e) => {
                        let newNames = [...names];
                        newNames[index] = e.target.value;
                        setNames(newNames);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();

                        }
                      }}
                    />
                    <div
                      style={{ opacity: names[index] === project.name ? 0 : 1, zIndex: 30 }}
                      className="cursor-pointer absolute transition-all z-30 top-[50%] translate-y-[-50%] right-0.5 text-black bg-white h-7 w-7 rounded-full flex items-center justify-center pointer-events-none"
                    >
                      <Icon.KeyReturn
                        weight="bold"
                        className="h-5 w-5"
                        width={20}
                      />
                    </div>
                  </div>
                  {/* <h1 className="text-lg font-medium mb-2">{project.name}</h1> */}
                  <Link target="_blank" href={"/jobs/" + project.name.toLowerCase() + "-" + project.id} className="text-xs text-gray-500 relative z-10 hover:text-black" >
                    https://bridge.supply/jobs/{project.name.toLowerCase() + "-" + project.id}
                  </Link>
                </div>
                <div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => {
                    router.push("/manage/" + project.owner + project.id);
                  }}
                    className="cursor-pointer p-2 transition-all hover:bg-zinc-100 group/user rounded-md relative text-gray-500 hover:text-black ">
                    <Icon.Users className="w-6 h-6 pointer-events-none " />
                    <div className="max-md:hidden truncate text-sm absolute translate-x-[-50%] left-[50%] bottom-12 hidden group-hover/user:block text-white px-2.5 py-1 bg-black rounded-full">
                      Manage Submissions
                    </div>
                  </button>
                  <button className="flex flex-col items-center justify-center ">
                    <Menu as="div" className="relative inline-block text-left">
                      <div className="h-full flex items-center">
                        <Menu.Button className="cursor-pointer p-2 transition-all hover:bg-zinc-100 rounded-md relative text-gray-500 hover:text-black ">
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
                            {/* <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="submit"
                                  onClick={() => {
                                    // go to manage/project.owner+project.id
                                    router.push("/manage/" + project.owner + project.id);
                                  }}
                                  className={classNames(
                                    active
                                      ? "bg-zinc-100 text-gray-900"
                                      : "text-zinc-700",
                                    "block w-full px-4 py-2 text-left text-sm rounded-md"
                                  )}
                                >
                                  Manage Submissions
                                </button>
                              )}
                            </Menu.Item> */}
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="submit"
                                  onClick={() => {
                                    deleteProject(project.id);
                                  }}
                                  className={classNames(
                                    active
                                      ? "bg-red-50 text-red-500"
                                      : "text-red-500",
                                    "block w-full px-4 py-2 text-left text-sm rounded-md"
                                  )}
                                >
                                  Delete Project
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
      <CommandMenu
        open={open}
        setOpen={setOpen}
        commands={[
          {
            name: "Create New Project",
            type: "command",
            description: "Create a new project",
            action: () => {
              openSetup();
            }
          },
          {
            name: "Open Project",
            type: "commandGroup",
            content: projects.map((project) => {
              return {
                name: "Open " + project.name,
                type: "command",
                description: "Open " + project.name,
                action: () => {
                  selectProject(project.id);
                  router.push("/editor/" + project.owner + project.id);
                }
              }
            })
          },
          {
            name: "Manage Project",
            type: "commandGroup",
            content: projects.map((project) => {
              return {
                name: "Manage " + project.name,
                type: "command",
                description: "Manage " + project.name,
                action: () => {
                  selectProject(project.id);
                  router.push("/manage/" + project.owner + project.id);
                }
              }
            })
          },
          {
            name: "Delete Project",
            type: "commandGroup",
            content: projects.map((project) => {
              return {
                name: "Delete " + project.name,
                type: "command",
                description: "Delete " + project.name,
                action: () => {
                  deleteProject(project.id);
                }
              }
            })
          },
          {
            name: "Sign Out",
            type: "command",
            description: "Sign out of your account",
            action: () => {
              signOut();
            }
          }
        ]}
      />

    </>
  );
}

export default Dashboard;
