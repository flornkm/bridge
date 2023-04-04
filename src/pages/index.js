import Head from "next/head";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import * as Icon from "phosphor-react";

export default function Home() {
    const cursor = useRef(null);
    const [customCursor, setCustomCursor] = useState(false);

    const handleMouseMove = (e) => {
        cursor.current.style.left = e.clientX + "px";
        cursor.current.style.top = e.clientY + "px";
    };

    useEffect(() => {
        if (customCursor) {
            document.addEventListener("mousemove", handleMouseMove);
            return () => document.removeEventListener("mousemove", handleMouseMove);
        }
    }, [customCursor]);

    return (
        <>
            <Head>
                <title>Bridge - Supply your website with interactive elements</title>
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
            <div className="max-md:w-[90%] w-full max-w-7xl pl-[5%] pr-[5%] flex justify-between py-4 items-center fixed translate-x-[-50%] left-[50%] z-50">
                <Image
                    alt="Bridge Logo"
                    src="/images/general/logo.svg"
                    width={56}
                    height={40}
                    className="cursor-pointer"
                />
                <div className="flex gap-8">
                    <button className="font-semibold">Login</button>
                    <button className="font-medium px-4 py-2 bg-black text-white rounded-lg">
                        Try for free
                    </button>
                </div>
            </div>
            <main className="max-md:w-[90%] w-full max-w-7xl pl-[5%] pr-[5%] m-auto bg-white min-h-[200vh]">
                <div
                    className="min-h-64 pt-48 relative z-20"

                >
                    <div className="max-w-2xl flex flex-col gap-6 mb-20">
                        <h1 className="font-semibold text-5xl leading-tight">
                            Supply your websites with interactive elements
                        </h1>
                        <p className="text-gray-500 font-medium text-3xl">
                            Bridge connects interactive, prestyled and modern popups to your
                            application.
                        </p>
                    </div>
                    <div className="flex justify-between absolute left-[50%] translate-x-[-50%] w-screen overflow-hidden py-10 pl-[5%] pr-[5%] items-center md:cursor-none" onMouseEnter={() => setCustomCursor(true)}
                        onMouseLeave={() => setCustomCursor(false)}>
                        <div className="bg-slate-900 text-slate-100 text-xl px-7 py-5 rounded-2xl -rotate-2 relative xl:left-32 max-xl:left-10 -top-6">
                            <code className="font-mono">
                                <pre>
                                    &#91;
                                    &#123;
                                    <br />
                                    &quot;id&quot;: 1,<br />
                                    &quot;content&quot;: [<br />
                                    &#123;<br />
                                    &quot;text&quot;: &quot;We use cookies!&quot;,<br />
                                    &quot;type&quot;: &quot;heading&quot;<br />
                                    &#125;,<br />
                                    &#123;<br />
                                    &quot;text&quot;: &quot;Please …&quot;,<br />
                                    &quot;type&quot;: &quot;text&quot;<br />
                                    &#125;
                                    ]<br />
                                    &#125;,
                                </pre>
                            </code>
                        </div>
                        <div className="py-4 px-8 bg-white z-20 shadow-2xl rounded-2xl ring-1 ring-neutral-200 absolute left-[50%] translate-x-[-50%] w-[90%] md:max-w-5xl flex justify-between max-lg:flex-col gap-10 transition-all duration-500 hover:scale-105">
                            <div className="flex flex-col gap-3">
                                <h3 className="font-semibold text-3xl">
                                    We use cookies on our site
                                </h3>
                                <p className="text-xl text-gray-500">
                                    You can learn more about that on our privacy policy.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button className="bg-violet-500 text-white font-medium p-4 rounded-lg md:cursor-none transition-all hover:opacity-90">
                                    <Icon.Check size={48} weight="fill" />
                                </button>
                                <button className="bg-fuchsia-200 text-fuchsia-400 font-medium p-4 rounded-lg md:cursor-none transition-all hover:opacity-90">
                                    <Icon.X size={48} weight="fill" />
                                </button>
                            </div>
                        </div>
                        <div className="bg-neutral-50 ring-1 ring-neutral-200 text-slate-100 text-xl px-7 py-4 rounded-2xl rotate-2 relative xl:right-32 max-xl:right-32 -top-16">
                            <div className="p-4 rounded-full h-56 w-56 bg-gradient-to-r from-violet-500 to-purple-400 flex justify-center items-center">
                                <div className="bg-white rounded-full h-44 w-44 p-4 flex justify-center items-center flex-col gap-1">
                                    <p className="font-bold text-5xl text-purple-900">100</p>
                                    <p className="text-purple-900 font-medium">Clicks</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-[url('/images/general/morph_lines.svg')] bg-top bg-no-repeat w-full h-full absolute top-64 left-[50%] translate-x-[-50%]">
                    <div className="bg-gradient-to-t from-white via-30% via-transparent to-white absolute z-10 top-0 left-0 right-0 bottom-0" />
                </div>
                <div className="min-h-64"></div>
            </main>
            {customCursor && <Image
                src="/images/general/custom_cursor.svg"
                alt="Custom Bridge Cursor"
                width={128}
                height={128}
                ref={cursor}
                className={
                    "fixed z-50 -translate-x-10 -translate-y-8 pointer-events-none max-md:hidden"
                }
            />}
            <div></div>
        </>
    );
}