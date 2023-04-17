import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
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
        console.log(id)
        if (id) {
            const ownerId = id.substring(0, 36);
            const projNum = id.substring(36);

            fetch(`/api/published?owner=${ownerId}&id=${projNum}`, {
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

    const reduceColorOpacity = (color, percent) => {
        const opacity = 1 - percent / 100;
        return `${color}${Math.round(opacity * 255).toString(16)}`;
    }

    const shadeColor = (color, percent) => {
        var R = parseInt(color.substring(1, 3), 16);
        var G = parseInt(color.substring(3, 5), 16);
        var B = parseInt(color.substring(5, 7), 16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = R < 255 ? R : 255;
        G = G < 255 ? G : 255;
        B = B < 255 ? B : 255;

        var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
        var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
        var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

        return "#" + RR + GG + BB;
    }

    return (
        <>
            <Head>
                <title>{data && data.name}</title>
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
                <div className="max-md:w-[90%] min-h-screen w-full max-w-7xl md:pl-[15%] md:pr-[15%] m-auto pb-16 bg-white pt-24 overflow-hidden">
                    <div className="flex flex-col">
                        {data && data.content !== undefined && (
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
                                                        <div className="flex w-full justify-between items-center">
                                                            <label className="text-base" style={{ color: data.colors.label }}>{item.label}</label>
                                                            {item.required && <span
                                                                style={{ color: data.colors.danger, backgroundColor: reduceColorOpacity(data.colors.danger, 90) }}
                                                                className="text-xs px-1 py-0.5 rounded-md bg-opacity-10">
                                                                Required
                                                            </span>}
                                                        </div>
                                                        <input required={item.required} className={"ring-1 ring-gray-200 bg-gray-50 rounded-md px-4 py-3 w-full focus:outline-gray-300"}
                                                            style={{ color: data.colors.text }}
                                                            placeholder={item.content} />
                                                    </div>
                                                )
                                            } else if (item.type === "fileUpload" && item.visibility) {
                                                return (
                                                    <div key={index} className="flex flex-col gap-1 items-start">
                                                        <div className="flex w-full justify-between items-center">
                                                            <label className="text-base" style={{ color: data.colors.label }}>{item.label}</label>
                                                            {item.required && <span
                                                                style={{ color: data.colors.danger, backgroundColor: reduceColorOpacity(data.colors.danger, 90) }}
                                                                className="text-xs px-1 py-0.5 rounded-md bg-opacity-10">
                                                                Required
                                                            </span>}
                                                        </div>
                                                        <label style={{ backgroundColor: data.colors.primaryButton }} className={"text-white mb-1 font-medium rounded-xl max-md:w-full justify-center py-4 px-6 hover:opacity-90 transition-all cursor-pointer items-center flex gap-2 relative focus:outline-gray-500"} for={index}>
                                                            <Icon.Paperclip size={22} className="inline-block" />
                                                            {item.content}
                                                        </label>
                                                        <input required={item.required}
                                                            style={{ color: data.colors.text }}
                                                            className={"file:hidden rounded-lg py-1.5 px-3 focus:outline-gray-300"}
                                                            type="file" id={index} />
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
                                                        }} key={index} style={{ backgroundColor: data.colors.primaryButton }} className={"text-white font-medium rounded-xl max-md:w-full justify-center py-4 px-8 focus:ring-gray-400 hover:opacity-90 transition-all cursor-pointer items-center flex gap-2 relative focus:outline-gray-300"}>
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
                        {!data || data.content === undefined && (
                            <div className="w-full h-full flex items-center justify-center">
                                <h1 className="text-2xl font-semibold text-black">Project not found</h1>
                            </div>
                        )
                        }
                    </div>
                </div>
                <Link href="/" className="focus:ring-purple-400 focus:ring-1 focus:outline-none flex gap-3 items-center m-auto w-40 mb-16 justify-center text-xs px-3 py-1.5 font-medium bg-purple-100 ring-1 ring-purple-200 active:scale-95 active:shadow-none hover:shadow-purple-100 hover:bg-purple-50 transition-all rounded-md text-purple-500 shadow-lg shadow-purple-200">
                    <Image alt="Bridge Logo" src="/images/general/logo.svg" width={20} height={24} className="" />
                    Made with Bridge
                </Link>
            </main>
        </>
    )
}
