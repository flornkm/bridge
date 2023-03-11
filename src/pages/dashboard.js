import Image from "next/image";
import React from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Menu, Transition } from "@headlessui/react";
import Account from "@/components/Account";
import * as Icon from "phosphor-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Dashboard(props) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [settings, setSettings] = React.useState(false);
  const [projects, setProjects] = React.useState([
    {
      id: 1,
      name: "Create a new project",
      created_at: "2021-08-01",
      updated_at: "2021-08-01",
    },
  ]);

  const fetchProjects = async (id) => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects([...projects, ...data]);
  };

  const selectProject = (id) => {
    if (id === 1) {
      console.log("Create a new project");
    }
  };

  React.useEffect(() => {
    fetchProjects(props.session.user.id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-screen h-screen bg-neutral-50 bg-[url('/images/dashboard/dashboard_gradient.jpg')] bg-cover">
      <div className="w-full bg-white py-4 bg-opacity-80 fixed top-0">
        <div className="max-w-[80%] w-full mx-auto justify-between flex items-center">
          <h1 className="text-lg font-medium">Dashboard</h1>
          <div className="flex">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="p-2 bg-neutral-100 ring-1 ring-neutral-200 cursor-pointer rounded-full transition-all hover:opacity-80">
                  <Icon.User
                    size={24}
                  />
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
                            onClick={() => supabase.auth.signOut()}
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
      <div className="pt-32 text-3xl font-semibold max-w-[80%] mx-auto mb-8 flex justify-between items-center">
        <h2>Your projects</h2>
        <button className="font-medium text-base px-3 py-2 rounded-lg bg-black text-white transition-all hover:bg-zinc-800">
          Create Project
        </button>
      </div>
      <div className="grid grid-cols-3 max-w-[80%] mx-auto max-md:grid-cols-1 max-xl:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="col-span-1 bg-white rounded-lg ring-1 ring-neutral-200 p-6 cursor-pointer transition-all hover:bg-opacity-80 shadow-lg shadow-neutral-100 active:scale-[0.98]"
            onClick={() => {
              selectProject(project.id);
            }}
          >
            <div>
              <div className="bg-neutral-50 mb-6 h-56 rounded-lg ring-1 ring-neutral-200">
                {project.id === 1 && (
                  <div className="h-full w-full flex justify-center items-center">
                    <Icon.Plus size={56} />
                  </div>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-lg font-medium">{project.name}</h1>
            </div>
          </div>
        ))}
      </div>
      {settings && (
        <Account session={props.session} setSettings={setSettings} />
      )}
    </div>
  );
}

export default Dashboard;
