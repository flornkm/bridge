import React from "react";
import * as Icon from "phosphor-react";

function Dashboard(props) {
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
    <div className="w-screen h-screen bg-neutral-50">
      <div className="w-full bg-white py-8 border-b border-b-neutral-200 fixed top-0">
        <div className="max-w-[80%] w-full mx-auto justify-between flex">
          <h1 className="text-lg font-medium">Dashboard</h1>
        </div>
      </div>
      <h2 className="pt-36 text-3xl font-semibold max-w-[80%] mx-auto mb-8">
        Your projects
      </h2>
      <div className="grid grid-cols-3 max-w-[80%] mx-auto max-md:grid-cols-1 max-xl:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="col-span-1 bg-white rounded-lg ring-1 ring-neutral-100 p-6 cursor-pointer transition-all hover:bg-opacity-80"
            onClick={() => {
              selectProject(project.id);
            }}
          >
            <div>
              <div className="bg-neutral-50 mb-8 h-40 rounded-lg ring-1 ring-neutral-100">
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
    </div>
  );
}

export default Dashboard;
