import { useEffect, useState } from 'react'

export default function Manage({ id, session, supabase }) {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);




    useEffect(() => {
        if (submissions.length === 0) {
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
                    setSubmissions(data.submissions)
                    setLoading(false)
                    console.log(submissions)
                }
            }

            if (session && id) {
                const userId = session.user.id
                const projectId = id.replace(userId, '')

                fetchSubmissions(userId, projectId)
            }
        }

    }, [id, session, submissions, supabase])

    const maxSubmission = submissions.reduce((prev, current) => {
        return Object.keys(prev).length > Object.keys(current).length ? prev : current;
    }, {});

    return (
        <div>
            {loading ? (
                <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-6 bg-white overflow-hidden rounded-lg">
                    <div className="h-16 w-16 relative rounded-full ring-8 ring-purple-500 z-0 animate-spin"> <div className="absolute -left-4 -top-4 bg-white z-10 h-12 w-12 transition-all" /> </div>
                </div>
            ) : (
                <div className="flex flex-col gap-5 p-2 rounded-lg bg-white ring-1 ring-neutral-100">
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Object.keys(maxSubmission).length}, 1fr)`, gap: '8px' }} className="text-sm p-2 bg-neutral-100 rounded-md items-center">
                        {Object.keys(maxSubmission).map((key) => (
                            <p key={key} className="text-gray-500">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </p>
                        ))}
                    </div>
                    {submissions.map((submission) => (
                        <div key={submission.id} style={{ display: 'grid', gridTemplateColumns: `repeat(${Object.keys(maxSubmission).length}, 1fr)`, gap: '8px' }}>
                            {Object.keys(maxSubmission).map((key) => (
                                <div key={key} className="max-w-[128px] relative group">{
                                    submission[key] && (
                                        key === "date" || key === "time" ? (
                                            <>
                                                <p className="truncate cursor-pointer px-1.5 py-1 hover:bg-neutral-100 rounded-lg transition-all">{new Date(submission[key]).toLocaleString()}</p>
                                                <div className="text-sm absolute translate-x-[-50%] truncate hidden left-[50%] bottom-10 group-hover:block text-white px-2.5 py-1 bg-black rounded-full">
                                                    {new Date(submission[key]).toLocaleString()}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p className="truncate cursor-pointer px-1.5 py-1 hover:bg-neutral-100 rounded-lg transition-all">{submission[key]}</p>
                                                {submission[key] && (
                                                    submission[key].toString().includes("@") || submission[key].toString().includes(".pdf")
                                                ) && (
                                                        <div className="text-sm absolute translate-x-[-50%] truncate hidden left-[50%] bottom-10 group-hover:block text-white px-2.5 py-1 bg-black rounded-full">
                                                            {submission[key]}
                                                        </div>
                                                    )}
                                            </>
                                        ))
                                }</div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
