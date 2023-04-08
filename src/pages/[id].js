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
                <title>Bridge - Effiecient hiring process with joy</title>
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
                <div className="max-md:w-[90%] w-full max-w-7xl pl-[5%] pr-[5%] m-auto min-h-[200vh] bg-white">
                    {data && (
                        data.content.map((items, index) => {
                            return (
                                items.content.map((item, index) => {
                                    return (
                                        <div key={item.id} className="text-black textt-lg">
                                            <p>{item.content}</p>
                                        </div>
                                    )
                                })
                            )
                        })
                    )}
                </div>
            </main>
        </>
    )
}
