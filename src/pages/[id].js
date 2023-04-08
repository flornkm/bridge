import { useRouter } from 'next/router'
import Head from 'next/head'
import { useEffect, useState } from 'react';

export default function Published() {
    const [data, setData] = useState(null);
    const router = useRouter();

    const { id } = router.query;

    useEffect(() => {
        if (id) {
            const supabaseId = id.split('&')[0];
            const name = id.split('&')[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            console.log(supabaseId, name);

            fetch(`/api/published?id=${supabaseId}&name=${name}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setData(data);
                })
        }
    }, [id]);

    return (
        <>
            <Head>
                <title>{id && id.split('&')[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</title>
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

            <main className="h-full w-full bg-white">
                <div className="max-md:w-[90%] w-full max-w-7xl pl-[5%] pr-[5%] m-auto min-h-[200vh] bg-white pt-24">
                    <div className="flex flex-col gap-4">
                        {data && (
                            data.content.map((items, index) => {
                                return (
                                    items.content.map((item, index) => {
                                        if (item.type === "heading" && item.visibility) {
                                            return (
                                                <h1 key={index} className="text-4xl font-semibold" style={{ color: data.colors.heading }}>{item.content}</h1>
                                            )
                                        } else if (item.type === "text" && item.visibility) {
                                            return (
                                                <p key={index} className="text-lg mb-8" style={{ color: data.colors.text }}>{item.content}</p>
                                            )
                                        } else if (item.type === "textInput" && item.visibility) {
                                            return (
                                                <div key={index} className="flex flex-col gap-1">
                                                    <div className="flex gap-1 items-center">
                                                        <label className="text-base" style={{ color: data.colors.label }}>{item.label}</label>
                                                        {item.required && <span className="text-red-500">*</span>}
                                                    </div>
                                                    <input required={item.required} className="ring-1 ring-gray-200 rounded-md px-4 py-3 w-full focus:outline-black focus:outline-1"
                                                        style={{ color: data.colors.text, placeholder: { color: data.colors.text } }}
                                                        placeholder={item.content} />
                                                </div>
                                            )
                                        }
                                    })
                                )
                            })
                        )}
                    </div>
                </div>
            </main>
        </>
    )
}
