import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'

function ProjectSetup(props) {
    const [project, setProject] = useState({
        name: '',
        type: 'job'
    })

    return (
        <Transition appear show={props.isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={props.closeSetup}>
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
                            <Dialog.Panel className="w-full flex flex-col max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <h2 className="text-xl font-semibold mb-2">Create a new project</h2>
                                <div className="mt-2 mb-8">
                                    <p className="text-base text-gray-500">
                                        Enter project details below.
                                    </p>
                                </div>

                                <div className="w-full grid grid-cols-3 items-center mb-8">
                                    <label htmlFor="name" className="text-neutral-500">
                                        Project Title
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        required={true}
                                        value={project.name}
                                        className="w-full border border-neutral-200 rounded-lg p-2 col-span-2"
                                        onChange={(e) => {
                                            setProject({ ...project, name: e.target.value })
                                        }}
                                    />
                                </div>

                                <div className="w-full flex justify-left gap-4 mt-14">
                                    <div className="w-full">
                                        <button
                                            onClick={() => {
                                                props.closeSetup();
                                            }}
                                            className="font-medium px-3 py-2 rounded-lg border border-neutral-200 bg-white text-black transition-all hover:bg-neutral-50 w-full">
                                            Cancel
                                        </button>
                                    </div>
                                    <div className="w-full">
                                        <button
                                            onClick={() => {
                                                props.createProject(project);
                                                project.name = '';
                                            }}
                                            className="font-medium px-3 py-2 rounded-lg bg-black text-white transition-all hover:bg-zinc-800 w-full">
                                            Create
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default ProjectSetup