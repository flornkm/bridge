import Head from "next/head";
import Image from "next/image";

export default function Home() {


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
            <div className="max-md:w-[90%] w-full max-w-7xl pl-[5%] pr-[5%] m-auto bg-white flex justify-between py-4 items-center">
                <Image alt="Bridge Logo" src="/images/general/logo.svg" width={56} height={40} className="cursor-pointer" />
                <div className="flex gap-8">
                    <button className="font-semibold">
                        Login
                    </button>
                    <button className="font-semibold px-4 py-2 bg-black text-white rounded-lg">
                        Try for free
                    </button>
                </div>
            </div>
            <main className="max-md:w-[90%] w-full max-w-7xl pl-[5%] pr-[5%] m-auto bg-white">
                <div className="min-h-64 pt-24">
                    <div className="max-w-2xl flex flex-col gap-6">
                        <h1 className="font-semibold text-5xl leading-tight">Supply your websites with
                            interactive elements</h1>
                        <p className="text-gray-500 font-medium text-2xl">Bridge connects interactive, prestyled and
                            modern popups to your application.</p>
                    </div>

                </div>
            </main>
            <div></div>
        </>
    );
}
