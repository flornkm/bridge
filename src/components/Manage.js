import Link from 'next/link';
import { useEffect, useState, Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Manage({ id, session, supabase }) {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (submissions && submissions.length === 0) {
            const fetchSubmissions = async (owner, id) => {
                const { data, error } = await supabase
                    .from('published')
                    .select('submissions')
                    .eq('owner', owner)
                    .eq('id', id)
                    .single()

                if (error) {
                    console.log(error)
                } else {
                    setSubmissions(data.submissions);

                    setLoading(false)
                }
            }

            if (session && id) {
                const userId = session.user.id
                const projectId = id.replace(userId, '')

                fetchSubmissions(userId, projectId)
            }
        }

    }, [id, session, submissions, supabase])

    function getIndexWithMostKeys(objects) {
        let maxKeys = 0;
        let maxIndex = null;
        for (let i = 0; i < objects.length; i++) {
            const keys = Object.keys(objects[i]);
            if (keys.length > maxKeys) {
                maxKeys = keys.length;
                maxIndex = i;
            }
        }
        return maxIndex;
    }

    let objectWithMostKeys = undefined;

    if (submissions && submissions.length > 0) {
        objectWithMostKeys = submissions[getIndexWithMostKeys(submissions)];
    }

    async function openFileFromStorage(fileName) {
        console.log(fileName)
        const { data, error } = await supabase.storage
            .from("uploads")
            .download(fileName)

        if (error) {
            console.log(error)
        } else {
            if (fileName.endsWith('.pdf')) {
                const blob = new Blob([data], { type: 'application/pdf' })

                const url = URL.createObjectURL(blob)
                window.open(url, '_blank')
            }
        }
    }

    return (
        <div>
            {loading ? (
                <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-6 bg-white overflow-hidden rounded-lg">
                    <div className="h-16 w-16 relative rounded-full ring-8 ring-purple-500 z-0 animate-spin"> <div className="absolute -left-4 -top-4 bg-white z-10 h-12 w-12 transition-all" /> </div>
                </div>
            ) : (
                submissions && objectWithMostKeys !== undefined ? (<div className="flex flex-col gap-2 rounded-lg bg-white ring-1 ring-zinc-200 max-h-[756px] w-full">
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Object.keys(objectWithMostKeys).filter(key => key !== 'id').length}, 1fr)`, gap: '8px' }} className="text-sm p-2 bg-zinc-100 shadow-lg shadow-zinc-100 z-10 sticky top-0 border-b border-zinc-200 items-center rounded-t-lg px-5">
                        {Object.keys(objectWithMostKeys).map((key) => (
                            objectWithMostKeys[key] && typeof objectWithMostKeys[key] === 'object' && (
                                Object.keys(objectWithMostKeys[key]).filter(childKey => childKey !== 'id').map((childKey) => (
                                    <div key={childKey} className="max-w-[128px] relative group py-0.5 ">
                                        <p className="truncate text-sm transition-all">
                                            {childKey.charAt(0).toUpperCase() + childKey.slice(1)}
                                        </p>
                                    </div>
                                ))
                            )
                        ))}
                    </div>
                    <div className="p-2 flex flex-col gap-2">
                        {submissions.map((submission) => (
                            <div key={submission.id} style={{ display: 'grid', gridTemplateColumns: `repeat(${Object.keys(objectWithMostKeys).filter(key => key !== 'id').length}, 1fr)`, gap: '8px' }} className="hover:bg-zinc-100 cursor-default transition-all p-0.5 rounded-md px-2 ">
                                {Object.keys(objectWithMostKeys).map((key) => (
                                    objectWithMostKeys[key] && typeof objectWithMostKeys[key] === 'object' && (
                                        Object.keys(objectWithMostKeys[key]).filter(childKey => childKey !== 'id').map((childKey) => (
                                            <div key={childKey} className="max-w-[128px] relative group py-2 flex items-center ">
                                                {submission[key] && typeof submission[key] === 'object' && submission[key][childKey] !== undefined && (
                                                    childKey === "date" || childKey === "time" ? (
                                                        <>
                                                            <p className="truncate px-1.5 items-center py-1 hover:bg-zinc-100 rounded-lg transition-all text-indigo-400 text-sm">{new Date(submission[key][childKey]).toLocaleString()}</p>
                                                            <div className="text-sm absolute z-20 truncate hidden left-[50%] translate-x-[-50%] bottom-12 group-hover:block text-white px-2.5 py-1 bg-black rounded-full">
                                                                {new Date(submission[key][childKey]).toLocaleString()}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p onClick={() => {
                                                                if (submission[key][childKey]?.toString()?.includes("@")) {
                                                                    window.open(`mailto:${submission[key][childKey]}`)
                                                                } else if (submission[key][childKey]?.toString()?.includes(".pdf")) {
                                                                    openFileFromStorage(submission[key][childKey])
                                                                }
                                                            }} className={"transition-all truncate " + ((submission[key][childKey]?.toString()?.includes("@") || submission[key][childKey]?.toString()?.includes(".pdf")) && " hover:underline cursor-pointer ")}>
                                                                {childKey === "status" ?
                                                                    <Menu as="div" className="relative inline-block text-left">
                                                                        <Menu.Button className={(submission[key][childKey] === "pending" ? "px-2.5 py-1.5 text-purple-500 text-center rounded-full border border-purple-200 bg-purple-100 text-sm cursor-pointer transition-all hover:text-purple-600 hover:bg-purple-200 hover:border-purple-300" : " rounded-lg")}>{submission[key][childKey]?.charAt(0).toUpperCase() + submission[key][childKey]?.slice(1)}</Menu.Button>
                                                                        <Transition
                                                                            as={Fragment}
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
                                                                                    </Menu.Item>
                                                                                </div>
                                                                            </Menu.Items>
                                                                        </Transition>
                                                                    </Menu>
                                                                    : <p className="px-1.5 py-1">{submission[key][childKey]}</p>}

                                                            </p>
                                                            {submission[key][childKey] && (
                                                                submission[key][childKey].toString().includes("@") || submission[key][childKey].toString().includes(".pdf")
                                                            ) && (
                                                                    <div className="text-sm absolute translate-x-[-50%] z-20 truncate hidden left-[50%] bottom-12 group-hover:block text-white px-2.5 py-1 bg-black rounded-full">
                                                                        {submission[key][childKey]}
                                                                    </div>
                                                                )}
                                                        </>
                                                    )
                                                )}
                                            </div>
                                        ))
                                    )
                                ))}
                            </div>
                        ))}
                    </div>
                </div>)
                    : (<div className="flex flex-col gap-2 rounded-lg">
                        <h1 className="text-center text-2xl font-medium text-black">No submissions yet.</h1>
                    </div>)
            )}
        </div>
    )
}
