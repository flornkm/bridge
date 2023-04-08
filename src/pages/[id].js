import { useRouter } from 'next/router'
import Head from 'next/head'
import { useEffect, useState } from 'react';
import * as Icon from 'phosphor-react'
import Confetti from 'react-dom-confetti';

export default function Published() {
    const [data, setData] = useState(null);
    const [confetti, setConfetti] = useState(false);
    const router = useRouter();

    const config = {
        angle: 90,
        spread: "61",
        startVelocity: "30",
        elementCount: "40",
        dragFriction: 0.12,
        duration: 3000,
        stagger: "4",
        width: "10px",
        height: "10px",
        perspective: "359px",
        colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
    };

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
                <div className="max-md:w-[90%] w-full max-w-7xl pl-[5%] pr-[5%] m-auto pb-40 bg-white pt-24">
                    <div className="flex flex-col">
                        {data && (
                            data.content.map((items, index) => {
                                return (
                                    <div key={index} className="flex flex-col gap-4 mb-16">
                                        {items.content.map((item, index) => {
                                            if (item.type === "heading" && item.visibility) {
                                                return (
                                                    <h1 key={index} className="text-4xl font-semibold" style={{ color: data.colors.heading }}>{item.content}</h1>
                                                )
                                            } else if (item.type === "text" && item.visibility) {
                                                return (
                                                    <p key={index} className="text-lg" style={{ color: data.colors.text }}>{item.content}</p>
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
                                            } else if (item.type === "fileUpload" && item.visibility) {
                                                return (
                                                    <div key={index} className="flex flex-col gap-1 items-start">
                                                        <div className="flex gap-1 items-center">
                                                            <label className="text-base" style={{ color: data.colors.label }}>{item.label}</label>
                                                            {item.required && <span className="text-red-500">*</span>}
                                                        </div>
                                                        <label style={{ backgroundColor: data.colors.primaryButton }} className="text-white font-medium rounded-md px-4 py-3 focus:outline-black focus:outline-1 hover:opacity-90 transition-all cursor-pointer items-center flex gap-2" for={index}>
                                                            <Icon.Paperclip size={24} className="inline-block" />
                                                            {item.content}
                                                        </label>
                                                        <input required={item.required}

                                                            type="file" hidden id={index} />
                                                    </div>
                                                )
                                            } else if (item.type === "submit" && item.visibility) {
                                                return (
                                                    <div key={index} className="flex flex-col gap-1 items-start">
                                                        <button onClick={() => {
                                                            if (item.type === "submit")
                                                                setConfetti(true)
                                                            setTimeout(() => {
                                                                setConfetti(false)
                                                            }, 3000)
                                                        }} key={index} style={{ backgroundColor: data.colors.primaryButton }} className="text-white font-medium rounded-md px-4 py-3 focus:outline-black focus:outline-1 hover:opacity-90 transition-all cursor-pointer items-center flex gap-2 relative">
                                                            {item.content}
                                                            {item.type === "submit" && data.effects.confetti && <div className="absolute w-0 left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%]"><Confetti active={confetti} config={config} /></div>}
                                                        </button>
                                                    </div>
                                                )
                                            }

                                        })}
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </main>
        </>
    )
}
