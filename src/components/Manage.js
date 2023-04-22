import { useEffect, useState } from 'react'

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
        console.log("TEST")
        objectWithMostKeys = submissions[getIndexWithMostKeys(submissions)];
    }

    return (
        <div>
            {loading ? (
                <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-6 bg-white overflow-hidden rounded-lg">
                    <div className="h-16 w-16 relative rounded-full ring-8 ring-purple-500 z-0 animate-spin"> <div className="absolute -left-4 -top-4 bg-white z-10 h-12 w-12 transition-all" /> </div>
                </div>
            ) : (
                submissions && objectWithMostKeys !== undefined ? (<div className="flex flex-col gap-2 rounded-lg bg-white ring-1 ring-neutral-200 max-h-[756px] overflow-y-scroll overflow-x-visible w-full">
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Object.keys(objectWithMostKeys).filter(key => key !== 'id').length}, 1fr)`, gap: '8px' }} className="text-sm p-2 bg-neutral-100 shadow-lg shadow-neutral-100 z-10 sticky top-0 border-b border-neutral-200 items-center rounded-t-lg">
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
                            <div key={submission.id} style={{ display: 'grid', gridTemplateColumns: `repeat(${Object.keys(objectWithMostKeys).filter(key => key !== 'id').length}, 1fr)`, gap: '8px' }} className="hover:bg-neutral-100 cursor-default transition-all p-0.5 rounded-md">
                                {Object.keys(objectWithMostKeys).map((key) => (
                                    objectWithMostKeys[key] && typeof objectWithMostKeys[key] === 'object' && (
                                        Object.keys(objectWithMostKeys[key]).filter(childKey => childKey !== 'id').map((childKey) => (
                                            <div key={childKey} className="max-w-[128px] relative group py-2 ">
                                                {submission[key] && typeof submission[key] === 'object' && submission[key][childKey] !== undefined && (
                                                    childKey === "date" || childKey === "time" ? (
                                                        <>
                                                            <p className="truncate px-1.5 py-1 hover:bg-neutral-100 rounded-lg transition-all text-indigo-400 text-sm">{new Date(submission[key][childKey]).toLocaleString()}</p>
                                                            <div className="text-sm absolute z-20 truncate hidden left-[50%] translate-x-[-50%] bottom-12 group-hover:block text-white px-2.5 py-1 bg-black rounded-full">
                                                                {new Date(submission[key][childKey]).toLocaleString()}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className={"truncate px-1.5 py-1 transition-all " + ((submission[key][childKey]?.toString()?.includes("@") || submission[key][childKey]?.toString()?.includes(".pdf")) && " hover:underline ") + (submission[key][childKey] === "pending" ? " text-purple-500 text-center rounded-full ring-1 ring-purple-200 bg-purple-100 text-sm cursor-pointer transition-all hover:text-purple-600 hover:bg-purple-200 hover:ring-purple-300" : " rounded-lg")}>
                                                                {childKey === "status" ? submission[key][childKey]?.charAt(0).toUpperCase() + submission[key][childKey]?.slice(1) : submission[key][childKey]}
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
                        <h1 className="text-center text-3xl font-bold italic text-indigo-500">No submissions yet!</h1>
                    </div>)
            )}
        </div>
    )
}
