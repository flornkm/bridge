import React from "react";

function ProjectSetup({ setSetup }) {
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10 bg-black bg-opacity-40 w-screen h-screen flex justify-center items-center px-[5%]">
      <div className="form-widget bg-white p-6 rounded-xl w-[550px] flex flex-col gap-4 relative z-20">
        <h2 className="font-medium text-xl mb-6">Create a new project</h2>
        <div className="w-full grid grid-cols-3 items-center">
          <label htmlFor="name" className="text-neutral-500">
            Project Title
          </label>
          <input
            id="title"
            type="text"
            required={true}
            className="w-full ring-1 ring-neutral-200 rounded-lg p-2 col-span-2"
          />
        </div>
        <div className="w-full grid grid-cols-3 items-center mb-14">
          <label htmlFor="website" className="text-neutral-500">
            Website
          </label>
          <input
            id="website"
            type="website"
            required={true}
            className="w-full ring-1 ring-neutral-200 rounded-lg p-2 col-span-2"
          />
        </div>
        <div className="w-full flex justify-left gap-4">
          <div className="w-full">
            <button
              className="font-medium px-3 py-2 rounded-lg ring-1 ring-neutral-200 bg-white text-black transition-all hover:bg-neutral-50 w-full"
              onClick={() => {
                setSetup(false);
              }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
          <div className="w-full">
            <button
              className="font-medium px-3 py-2 rounded-lg bg-black text-white transition-all hover:bg-zinc-800 w-full"
              onClick={() => updateProfile({ username, website, avatar_url })}
              disabled={loading}
            >
              {loading ? "Loading ..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectSetup;
