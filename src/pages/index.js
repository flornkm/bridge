import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useInView } from 'react-intersection-observer';
import { useRef, useEffect, useState, useCallback } from "react";
import * as Icon from "phosphor-react";
import {
    DndContext,
    closestCenter,
    DragOverlay,
    useSensor,
    useSensors,
    MouseSensor,
    TouchSensor,
    PointerSensor,
    KeyboardSensor,
    sortableKeyboardCoordinates,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "@/layout/SortableItem";

export default function Home() {
    const cursor = useRef(null);
    const [customCursor, setCustomCursor] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [items, setItems] = useState([
        {
            id: "1",
        },
        {
            id: "2",
        },
    ]);
    const [activeId, setActiveId] = useState(null);
    const router = useRouter();

    const handleMouseMove = (e) => {
        requestAnimationFrame(() => {
            cursor.current.style.left = e.clientX + "px";
            cursor.current.style.top = e.clientY + "px";
        });
    };

    useEffect(() => {
        if (customCursor) {
            document.addEventListener("mousemove", handleMouseMove);
            return () => document.removeEventListener("mousemove", handleMouseMove);
        }
    }, [customCursor]);

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                tolerance: 5,
                delay: 150,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                tolerance: 5,
                delay: 150,
            },
        })
    );

    const handleDragStart = useCallback((event) => {
        setActiveId(event.active.id);
    }, []);

    const handleDragEnd = useCallback((event) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }

        setActiveId(null);
    }, []);

    const handleDragCancel = useCallback(() => {
        setActiveId(null);
    }, []);

    const handleDragOver = useCallback((event) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });

        }
    }, []);

    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '200px',
        triggerOnce: true,
    });

    useEffect(() => {
        if (inView) {
            setIsInView(true);
        }
    }, [inView]);

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
            <div className="max-md:w-[90%] w-full max-w-7xl pl-[5%] pr-[5%] flex justify-between py-4 items-center fixed translate-x-[-50%] left-[50%] z-50">
                <Image
                    alt="Bridge Logo"
                    src="/images/general/logo.svg"
                    width={56}
                    height={40}
                    className="cursor-pointer"
                />
                <div className="flex gap-8">
                    <button className="font-semibold" onClick={() => {
                        router.push('/login')
                    }}>Login</button>
                    <button className="font-medium px-4 py-2 bg-black text-white rounded-lg">
                        Try for free
                    </button>
                </div>
            </div>
            <main className="h-full w-full bg-white">
                <div className="max-md:w-[90%] w-full max-w-7xl pl-[5%] pr-[5%] m-auto min-h-[200vh] bg-white">
                    <div
                        className="min-h-64 pt-48 relative z-20"

                    >
                        <div className="max-w-3xl flex flex-col gap-6 mb-20">
                            <h1 className="font-semibold text-5xl leading-tight">
                                Streamline your hiring process
                                with an interactive tool.
                            </h1>
                            <p className="text-gray-500 font-medium text-3xl">
                                Create a high-quality candidate experience and find
                                the best talent for your business with bridge.
                            </p>
                        </div>
                        <div className="flex justify-between relative left-[50%] translate-x-[-50%] w-screen overflow-hidden py-10 pl-[5%] pr-[5%] items-center md:cursor-none" onMouseEnter={() => setCustomCursor(true)}
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
                            <div className="py-4 px-8 bg-white z-20 shadow-2xl rounded-2xl ring-1 ring-neutral-200 absolute left-[50%] translate-x-[-50%] w-[90%] md:max-w-5xl flex justify-between max-lg:flex-col gap-10 transition-all duration-500 md:hover:scale-105">
                                <div className="h-56" />
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
                    <div className="bg-[url('/images/general/morph_lines.svg')] bg-top bg-no-repeat w-full h-[768px] absolute top-64 pointer-events-none left-[50%] translate-x-[-50%]">
                        <div className="bg-gradient-to-t from-white via-30% via-transparent to-white absolute z-10 top-0 left-0 right-0 bottom-0" />
                    </div>
                    <div className="min-h-64 pt-24">
                        <div className="w-full flex justify-center flex-col items-center gap-3 mb-16">
                            <h2 className="font-semibold text-4xl text-black flex gap-4 items-center">Getting used to it is <Icon.FastForward weight="fill" className="text-violet-900" /></h2>
                            <p className="text-gray-500 text-xl font-medium">Features helping you to implement your goals.</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
                            <div className="flex flex-col gap-3 p-6 bg-neutral-50 rounded-2xl overflow-hidden relative h-96">
                                <h3 className="text-black font-semibold text-2xl">Drag and Drop</h3>
                                <div className="flex gap-4 items-center bg-white p-8 absolute right-0 bottom-8 pr-8 ring-1 ring-neutral-200 rounded-tl-2xl rounded-bl-2xl top-[60%] translate-y-[-50%]">
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragStart={handleDragStart}
                                        onDragEnd={handleDragEnd}
                                        onDragCancel={handleDragCancel}
                                        onDragOver={handleDragOver}
                                    >
                                        <SortableContext items={items} strategy={verticalListSortingStrategy}>
                                            {items.map((item, index) => {
                                                return (
                                                    <SortableItem
                                                        key={index}
                                                        id={item.id}
                                                        index={index}
                                                        items={item}
                                                        setItems={setItems}
                                                        landingpage="true"
                                                    />
                                                );
                                            })}
                                        </SortableContext>
                                    </DndContext>
                                </div>
                            </div>
                            <div className="flex flex-col md:col-span-2 gap-3 p-6 bg-neutral-50 rounded-2xl overflow-hidden relative h-96">
                                <h3 className="text-black font-semibold text-2xl">Privacy compliant</h3>
                                <div className="absolute left-16 top-[60%] translate-y-[-50%] h-48 w-full bg-no-repeat bg-right-center bg-[url('/images/general/privacy_badges.svg')]">
                                    <div className="absolute z-10 bg-gradient-to-r from-transparent to-neutral-100 top-0 bottom-0 left-0 right-0" />
                                </div>
                            </div>
                            <div className="flex flex-col md:col-span-2 gap-3 p-6 bg-neutral-50 rounded-2xl overflow-hidden h-96">
                                <h3 className="text-black font-semibold text-2xl flex gap-4 items-center">Easily share <span className="rounded-full ring-2 ring-purple-300 text-purple-500 text-sm px-2 py-1">Soon</span></h3>
                                <div className="w-full flex justify-between h-full items-center gap-4">
                                    <Image src="/images/general/memoji_1.jpg" alt="Daniel" width={128} height={128} className="rounded-full transition-all hover:scale-105 hover:shadow-xl ring-1 ring-purple-300" unoptimized={true} />
                                    <Icon.Link size={40} weight="fill" className="text-gray-500 max-md:hidden" />
                                    <Image src="/images/general/memoji_2.jpg" alt="Isabelle" width={128} height={128} className="rounded-full transition-all hover:scale-105 hover:shadow-xl ring-1 ring-pink-300" unoptimized={true} />
                                    <Icon.Link size={40} weight="fill" className="text-gray-500 max-md:hidden" />
                                    <Image src="/images/general/memoji_3.jpg" alt="Nataly" width={128} height={128} className="rounded-full transition-all hover:scale-105 hover:shadow-xl ring-1 ring-green-300" unoptimized={true} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 p-6 bg-neutral-50 rounded-2xl overflow-hidden h-96">
                                <h3 className="text-black font-semibold text-2xl">Publishing made easy</h3>
                                <div className="h-full w-full flex justify-center items-center">
                                    <button className="font-medium text-xl px-4 py-3 rounded-lg bg-black text-white transition-all hover:bg-zinc-800 flex gap-3 items-center cursor-default">
                                        <Icon.UploadSimple size={28} weight="bold" />
                                        Publish
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-40 pb-40">
                        <div className="flex flex-col gap-3 mb-10">
                            <h2 className="font-semibold text-4xl text-black flex gap-4 items-center">An intuitive Editor </h2>
                            <p className="text-gray-500 text-xl font-medium">Our editor works for everyone.</p>
                        </div>
                        {isInView ? (
                            <video autoPlay loop muted className="rounded-2xl ring-1 ring-neutral-200">
                                <source src="/videos/showcase.mp4" type="video/mp4" />
                            </video>
                        ) : (
                            <div ref={ref}></div>
                        )}
                    </div>
                    <div>
                        <div className="flex flex-col gap-3 mb-10">
                            <h2 className="font-semibold text-4xl text-black flex gap-4 items-center">Why tho?</h2>
                        </div>
                        <div className="pb-96">

                        </div>
                    </div>
                </div>
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