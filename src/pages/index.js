import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useInView } from 'react-intersection-observer';
import { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
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
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { Menu, Transition } from "@headlessui/react";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "@/layout/SortableItem";
import Confetti from 'react-dom-confetti';
import RiveComponent from '@rive-app/react-canvas';
import { useHotkeys } from 'react-hotkeys-hook';
import Link from "next/link";
import WaitList from "@/components/Waitlist";
import Item from "@/layout/Item";

export default function Home() {
    const cursor = useRef(null);
    const [customCursor, setCustomCursor] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [confetti, setConfetti] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [shortcuts, setShortcuts] = useState(0);
    const [waitlist, setWaitlist] = useState(false);
    const scrollDiv = useRef(null);
    const navRect = useRef(null);
    const inViewState = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];
    const cards = [
        useRef(null),
        useRef(null),
        useRef(null),
    ]
    const navItems = [
        useRef(null),
        useRef(null),
        useRef(null),
    ]
    const circles = [
        useRef(null),
        useRef(null),
        useRef(null),
    ]
    const keys = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ]
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
    let [isOpen, setIsOpen] = useState(false)
    let [entries, setEntries] = useState([])

    function closeModal() {
        setIsOpen(false)

        setTimeout(() => {
            setWaitlist(false);
        }, 200);
    }

    function openModal() {
        setWaitlist(true);
        setIsOpen(true)
    }


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

    useEffect(() => {
        const handleScroll = () => {
            const position = scrollDiv.current.getBoundingClientRect();
            if (position.top < 0 && position.bottom > 0) {
                const percentage = Math.abs(position.top) / scrollDiv.current.offsetHeight;
                setScrollPosition(percentage);

                if (percentage < 0.2) {
                    if (inViewState[0].current && inViewState[1].current && inViewState[2].current && inViewState[3].current && inViewState[4].current && inViewState[5].current) {
                        inViewState[0].current.style.transform = "scale(1) rotate(0deg)";
                        inViewState[0].current.style.right = "0";
                        inViewState[4].current.style.transform = "scale(1) rotate(0deg)";
                        inViewState[5].current.style.gap = "24px";
                        setTimeout(() => {
                            if (inViewState[1].current && inViewState[2].current && inViewState[3].current) {
                                inViewState[1].current.style.transform = "scale(1) rotate(0deg)";
                                inViewState[1].current.style.left = "0";
                            }
                            setTimeout(() => {
                                if (inViewState[2].current && inViewState[3].current) {
                                    inViewState[2].current.style.transform = "scale(1) rotate(0deg)";
                                    inViewState[2].current.style.right = "0";
                                }
                                setTimeout(() => {
                                    if (inViewState[3].current) {
                                        inViewState[3].current.style.transform = "scale(1) rotate(0deg)";
                                        inViewState[3].current.style.left = "0";
                                    }
                                }, 100);
                            }, 100);
                        }, 100);
                    }
                    navRect.current.style.opacity = 1;
                    navRect.current.style.width = navItems[0].current.offsetWidth + "px";
                    navRect.current.style.left = navItems[0].current.offsetLeft + "px";
                } else if (percentage > 0.2 && percentage < 0.4) {
                    if (cards[0].current && cards[1].current && cards[2].current) {
                        cards[0].current.style.transform = "scale(1)";
                        cards[1].current.style.transform = "translateY(-50%) scale(1)";
                        cards[2].current.style.transform = "translateY(-50%) scale(1)";
                    }

                    navRect.current.style.width = navItems[1].current.offsetWidth + "px";
                    navRect.current.style.left = navItems[1].current.offsetLeft + "px";
                } else if (percentage > 0.4) {
                    if (circles[0].current && circles[1].current && circles[2].current) {
                        circles[0].current.style.transform = "translateY(-50%) translateX(-50%) scale(1)";
                        circles[0].current.style.opacity = 1;
                        setTimeout(() => {
                            if (circles[1].current && circles[2].current) {
                                circles[1].current.style.transform = "translateY(-50%) translateX(-50%) scale(1)";
                                circles[1].current.style.opacity = 1;
                                setTimeout(() => {
                                    if (circles[2].current) {
                                        circles[2].current.style.transform = "translateY(-50%) translateX(-50%) scale(1)";
                                        circles[2].current.style.opacity = 1;
                                    }
                                }, 100);
                            }
                        }, 100);
                    }
                    navRect.current.style.opacity = 1;
                    navRect.current.style.width = navItems[2].current.offsetWidth + "px";
                    navRect.current.style.left = navItems[2].current.offsetLeft + "px";
                }
            }
        };

        document.addEventListener("scroll", handleScroll);
        return () => document.removeEventListener("scroll", handleScroll);
    }, [scrollPosition, navItems]);

    useHotkeys('t', (e) => {
        e.preventDefault();
        openModal();
    });

    useHotkeys('meta', (e) => {
        keys[0].current.style.transform = "scale(0.9)";
        if (shortcuts === 0)
            keys[1].current.style.transform = "scale(1)";
        if (shortcuts === 1)
            keys[2].current.style.transform = "scale(1)";
        if (shortcuts === 2)
            keys[3].current.style.transform = "scale(1)";
    });

    useHotkeys('h', (e) => {
        e.preventDefault();
        if (shortcuts === 2) {
            keys[3].current.style.transform = "scale(0.9)";
            keys[0].current.style.transform = "scale(1)";
        }
    });

    useHotkeys('k', (e) => {
        e.preventDefault();
        if (shortcuts === 0) {
            keys[1].current.style.transform = "scale(0.9)";
            keys[0].current.style.transform = "scale(1)";
        }
    });

    useHotkeys('e', (e) => {
        e.preventDefault();
        if (shortcuts === 1) {
            keys[2].current.style.transform = "scale(0.9)";
            keys[0].current.style.transform = "scale(1)";
        }
    });

    useHotkeys('meta+h', (e) => {
        e.preventDefault();
        if (shortcuts === 2) {
            keys[3].current.style.transform = "scale(0.9)";
            keys[0].current.style.transform = "scale(0.9)";
            keys[3].current.style.opacity = 0.5;
            keys[0].current.style.opacity = 0.5;
            setTimeout(() => {
                setShortcuts(0);
            }, 500);
        }
    });

    useHotkeys('meta+e', (e) => {
        e.preventDefault();
        if (shortcuts === 1) {
            keys[0].current.style.transform = "scale(0.9)";
            keys[2].current.style.transform = "scale(0.9)";
            keys[0].current.style.opacity = 0.5;
            keys[2].current.style.opacity = 0.5;
            setTimeout(() => {
                setShortcuts(shortcuts + 1);
            }, 500);
        }
    });

    useHotkeys('meta+k', (e) => {
        e.preventDefault();
        if (shortcuts === 0) {
            keys[1].current.style.transform = "scale(0.9)";
            keys[0].current.style.transform = "scale(0.9)";
            keys[1].current.style.opacity = 0.5;
            keys[0].current.style.opacity = 0.5;
            setTimeout(() => {
                setShortcuts(shortcuts + 1);
            }, 500);
        }
    });

    function getRandomEmoji() {
        const emojis = ['😀', '😍', '🤔', '😴', '🤯', '👻', '👽', '🤖'];
        const randomIndex = Math.floor(Math.random() * emojis.length);
        return emojis[randomIndex];
    }

    const fetchNewestEntries = async () => {
        const response = await fetch('/api/airtable');
        const data = await response.json();
        const entriesWithEmojis = data.map(entry => {
            return {
                ...entry,
                emoji: getRandomEmoji()
            }
        });
        setEntries(entriesWithEmojis);
    };

    useEffect(() => {
        if (entries.length === 0)
            fetchNewestEntries();
    }, [entries]);

    return (
        <>
            <Head>
                <title>Bridge - The flexible hiring tool</title>
                <meta
                    name="description"
                    content="Hiring talent with joy"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta
                    property="og:title"
                    content="Hiring talent with joy"
                />
                <meta
                    property="og:description"
                    content="Hiring talent with joy"
                />
                <meta
                    property="og:image"
                    content="/images/bridge_opengraph.jpg"
                />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@floriandwt" />
                <meta name="twitter:title" content="Bridge" />
                <meta
                    name="twitter:image"
                    content="/images/bridge_twitter.jpg"
                />
                <meta
                    name="twitter:description"
                    content="Hiring talent with joy"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="max-md:w-[90%] w-full max-w-7xl pl-[5%] pr-[5%] flex justify-between py-4 items-center fixed translate-x-[-50%] left-[50%] z-50">
                <Image
                    alt="Bridge Logo"
                    src="/images/general/logo.svg"
                    width={48}
                    height={32}
                    className="cursor-pointer"
                />
                <div className="flex gap-4 max-sm:gap-2 mix-blend-screen bg-white ring-4 ring-white rounded-lg">
                    <button className="font-semibold transition-all hover:text-zinc-800 bg-white px-4 rounded-lg" onClick={() => {
                        router.push('/login')
                    }}>Login</button>
                    <button className="font-medium px-4 py-2 bg-black text-white rounded-lg transition-all hover:bg-zinc-800 flex gap-3 items-center group" onClick={() => {
                        openModal();
                    }}>
                        <span className="text-xs px-2 py-0.5 rounded-sm ring-2 ring-white font-bold -rotate-6 transition-all group-hover:rotate-0 max-sm:hidden">t</span>
                        Try for free
                    </button>
                </div>
            </div>
            <main className="h-full w-full bg-white">
                <div className="max-md:w-[90%] w-full max-w-7xl pl-[5%] pr-[5%] m-auto min-h-[200vh] bg-white">
                    <div
                        className="min-h-64 md:pt-48 max-md:pt-40 relative z-20 border-b border-b-zinc-200"

                    >
                        <div className="max-w-3xl flex flex-col gap-6 md:mb-16">
                            <h1 className="font-semibold md:text-5xl max-md:text-4xl md:leading-[1.3em]">
                                The hiring tool that integrates
                                with your workflow.
                            </h1>
                            <p className="text-gray-500 font-medium md:text-3xl max-md:text-xl leading-tight md:leading-[1.3em]">
                                Bridge simplifies your hiring process, providing a great experience for candidates.
                            </p>
                        </div>
                        <div className="flex justify-between relative left-[50%] translate-x-[-50%] w-[90vw] overflow-hidden max-md:py-48 md:py-10 pl-[5%] pr-[5%] items-center md:cursor-none" onMouseEnter={() => setCustomCursor(true)}
                            onMouseLeave={() => setCustomCursor(false)}>
                            <div className="bg-slate-900 text-slate-100 text-xl px-7 py-5 rounded-2xl -rotate-2 relative xl:left-32 max-xl:left-10 -top-6 max-md:hidden">
                                <code className="font-mono">
                                    <pre>
                                        &#91;
                                        &#123;
                                        <br />
                                        &quot;id&quot;: 1,<br />
                                        &quot;content&quot;: [<br />
                                        &#123;<br />
                                        &quot;content&quot;: &quot;Product Designer!&quot;,<br />
                                        &quot;type&quot;: &quot;heading&quot;<br />
                                        &#125;,<br />
                                        &#123;<br />
                                        &quot;text&quot;: &quot;We need you!&quot;,<br />
                                        &quot;type&quot;: &quot;text&quot;<br />
                                        &#125;
                                        ]<br />
                                        &#125;,
                                    </pre>
                                </code>
                            </div>
                            <div onClick={openModal} className="md:py-16 md:px-20 max-md:py-8 max-md:px-10 flex-col bg-white z-20 shadow-2xl rounded-2xl ring-1 ring-zinc-200 top-24 absolute left-[50%] translate-x-[-50%] w-[90%] md:max-w-4xl flex justify-between max-lg:flex-col transition-all duration-500 md:hover:scale-[1.01]">
                                <p className="text-3xl font-semibold mb-4">Senior UI / UX Designer</p>
                                <p className="text-lg font-medium text-gray-500 mb-10">We are seeking a highly experienced Senior UI/UX Designer …</p>
                                <div className="flex flex-col gap-1 items-start w-full mb-8">
                                    <div className="flex flex-col gap-1 w-full">
                                        <div className="flex w-full justify-between items-center">
                                            <label className="cursor-none ext-base text-gray-400">Your name</label>
                                        </div>
                                        <input className={"pointer-events-none ring-1 ring-gray-200 bg-gray-50 rounded-md px-4 py-3 focus:outline-gray-300 w-full"}
                                            placeholder="John Doe" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 items-start w-full">
                                    <div className="flex flex-col gap-1 w-full">
                                        <div className="flex w-full justify-between items-center">
                                            <label className="cursor-none text-base text-gray-400">Your adress</label>
                                        </div>
                                        <input className={"pointer-events-none ring-1 ring-gray-200 bg-gray-50 rounded-md px-4 py-3 focus:outline-gray-300 w-full"}
                                            placeholder="Examplestreet" />
                                    </div>
                                </div>
                                <div className="h-96" />
                            </div>
                            <div className="bg-zinc-50 ring-1 ring-zinc-200 text-slate-100 text-xl px-7 py-4 rounded-2xl rotate-2 relative xl:right-32 max-xl:right-32 -top-16 max-md:hidden">
                                <div className="p-4 rounded-full h-56 w-56 bg-gradient-to-r from-violet-500 to-purple-400 flex justify-center items-center">
                                    <div className="bg-white rounded-full h-44 w-44 p-4 flex justify-center items-center flex-col gap-1">
                                        <p className="font-bold text-5xl text-purple-900">100</p>
                                        <p className="text-purple-900 font-medium">Clicks</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[url('/images/general/morph_lines.svg')] bg-top bg-no-repeat w-full max-md:h-96 md:h-[768px] absolute top-64 pointer-events-none left-[50%] translate-x-[-50%]">
                        <div className="bg-gradient-to-t from-white via-30% via-transparent to-white absolute z-10 top-0 left-0 right-0 bottom-0" />
                    </div>
                    <div className="min-h-64 pt-24">
                        <div className="w-full flex justify-center flex-col md:items-center gap-3 mb-16">
                            <h2 className="font-semibold md:text-4xl max-md:text-2xl text-black flex gap-4 items-center">Features that&apos;ll make you even faster
                                {/* <Icon.FastForward weight="fill" className="text-violet-500" /> */}
                            </h2>
                            <p className="text-gray-500 text-xl font-medium">
                                Maximize your efficiency without sacrificing the user experience.
                            </p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
                            <div className="flex flex-col gap-3 p-6 bg-zinc-50 rounded-2xl overflow-hidden relative h-96">
                                <h3 className="text-black font-semibold md:text-2xl max-md:text-xl">Drag and Drop</h3>
                                <div className="flex flex-col gap-8 items-start bg-white left-8 p-8 absolute right-4 bottom-4 pr-8 ring-1 top-[30%] ring-zinc-200 rounded-2xl pb-8">
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
                                        {typeof document !== 'undefined' && (
                                            document.body && createPortal(
                                                <DragOverlay
                                                    modifiers={[restrictToWindowEdges]}
                                                    zIndex={39}
                                                    dropAnimation={{
                                                        duration: 100,
                                                        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                                                    }}
                                                >
                                                    {activeId ? (
                                                        <div
                                                            className={"scale-[1.01] transition-all"}
                                                            style={{
                                                                background: "white", borderRadius: "16px",
                                                            }}>
                                                            <Item
                                                                id={activeId}
                                                                index={items.findIndex((item) => item.id === activeId)}
                                                                items={items.find((item) => item.id === activeId)}
                                                                setItems={setItems}
                                                                className={"bg-transparent text-base flex gap-4 items-center"}
                                                                landingpage="true"
                                                            />
                                                        </div>
                                                    ) : null}
                                                </DragOverlay>,
                                                document.body,
                                            )
                                        )}
                                    </DndContext>
                                </div>
                            </div>
                            <div className="flex flex-col md:col-span-2 gap-3 p-6 bg-zinc-50 rounded-2xl overflow-hidden relative h-96">
                                <h3 className="text-black font-semibold md:text-2xl max-md:text-xl">Shortcuts from the future</h3>
                                {shortcuts === 0 && <div className="h-full w-full flex justify-center items-center gap-4 group" onClick={() => setShortcuts(1)}>
                                    <div className="bg-gradient-to-t from-zinc-100 to-white rounded-xl ring-zinc-200 ring-1 p-2 shadow-md text-black h-20 w-20 flex justify-center items-center transition-all group-active:scale-90 group-active:opacity-50 cursor-pointer" ref={keys[0]}>
                                        <Icon.Command weight="fill" size={56} />
                                    </div>
                                    <div className="bg-gradient-to-t from-zinc-100 to-white rounded-xl ring-zinc-200 ring-1 p-2 shadow-md flex justify-center items-center text-black h-20 w-20 text-5xl transition-all group-active:scale-90 group-active:opacity-50 cursor-pointer" ref={keys[1]}>
                                        K
                                    </div>
                                    <div className="absolute bottom-8 bg-black text-white font-medium py-2 px-4 rounded-full">
                                        Command Menu
                                    </div>
                                </div>}
                                {shortcuts === 1 && <div className="h-full w-full flex justify-center items-center gap-4 group" onClick={() => setShortcuts(2)}>
                                    <div className="bg-gradient-to-t from-zinc-100 to-white rounded-xl ring-zinc-200 ring-1 p-2 shadow-md text-black h-20 w-20 flex justify-center items-center transition-all group-active:scale-90 group-active:opacity-50 cursor-pointer" ref={keys[0]}>
                                        <Icon.Command weight="fill" size={56} />
                                    </div>
                                    <div className="bg-gradient-to-t from-zinc-100 to-white rounded-xl ring-zinc-200 ring-1 p-2 shadow-md flex justify-center items-center text-black h-20 w-20 text-5xl transition-all group-active:scale-90 group-active:opacity-50 cursor-pointer" ref={keys[2]}>
                                        E
                                    </div>
                                    <div className="absolute bottom-8 bg-black text-white font-medium py-2 px-4 rounded-full">
                                        Create new project
                                    </div>
                                </div>}
                                {shortcuts === 2 && <div className="h-full w-full flex justify-center items-center gap-4 group" onClick={() => setShortcuts(0)}>
                                    <div className="bg-gradient-to-t from-zinc-100 to-white rounded-xl ring-zinc-200 ring-1 p-2 shadow-md text-black h-20 w-20 flex justify-center items-center transition-all group-active:scale-90 group-active:opacity-50 cursor-pointer" ref={keys[0]}>
                                        <Icon.Command weight="fill" size={56} />
                                    </div>
                                    <div className="bg-gradient-to-t from-zinc-100 to-white rounded-xl ring-zinc-200 ring-1 p-2 shadow-md flex justify-center items-center text-black h-20 w-20 text-5xl transition-all group-active:scale-90 group-active:opacity-50 cursor-pointer" ref={keys[3]}>
                                        H
                                    </div>
                                    <div className="absolute bottom-8 bg-black text-white font-medium py-2 px-4 rounded-full">
                                        Ask for help
                                    </div>
                                </div>}
                            </div>
                            <div className="flex flex-col md:col-span-2 gap-3 p-6 bg-zinc-50 rounded-2xl overflow-hidden h-96">
                                <h3 className="text-black font-semibold md:text-2xl max-md:text-xl flex gap-4 items-center">Connect with candidates
                                </h3>
                                <div className="w-full flex justify-between h-full items-center md:gap-4">
                                    <Image src="/images/general/memoji_1.jpg" alt="Daniel" width={128} height={128} className="rounded-full transition-all hover:scale-105 hover:shadow-xl md:ring-1 border-white border-8 ring-zinc-200 relative max-md:z-20" unoptimized={true} />
                                    <Icon.Link size={40} weight="fill" className="text-gray-500 max-md:hidden" />
                                    <Image src="/images/general/memoji_2.jpg" alt="Isabelle" width={128} height={128} className="rounded-full transition-all hover:scale-105 hover:shadow-xl md:ring-1 border-white border-8 ring-zinc-200 relative max-md:z-10 max-md:-left-4" unoptimized={true} />
                                    <Icon.Link size={40} weight="fill" className="text-gray-500 max-md:hidden" />
                                    <Image src="/images/general/memoji_3.jpg" alt="Nataly" width={128} height={128} className="rounded-full transition-all hover:scale-105 hover:shadow-xl md:ring-1 border-white border-8 ring-zinc-200 relative max-md:-left-8" unoptimized={true} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 p-6 bg-zinc-50 rounded-2xl overflow-hidden h-96">
                                <h3 className="text-black font-semibold md:text-2xl max-md:text-xl">Publishing made easy</h3>
                                <div className="h-full w-full flex justify-center items-center">
                                    <button onClick={() => {
                                        setConfetti(true)
                                        setTimeout(() => {
                                            setConfetti(false)
                                        }, 3000)
                                    }} className="relative font-medium text-xl px-4 py-3 rounded-lg bg-black text-white transition-all hover:bg-zinc-800 flex gap-3 items-center">
                                        <Icon.UploadSimple size={28} weight="bold" />
                                        Publish
                                        <div className="absolute w-0 left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%]"><Confetti active={confetti} config={config} /></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-40 pb-40">
                        <div className="flex flex-col gap-3 mb-10">
                            <h2 className="font-semibold md:text-4xl max-md:text-2xl text-black flex gap-4 items-center">An intuitive Editor </h2>
                            <p className="text-gray-500 text-xl font-medium">Our editor works for everyone.</p>
                        </div>
                        {isInView ? (
                            <video autoPlay loop muted className="rounded-2xl ring-1 w-full object-cover aspect-video bg-[#FAF9FA] ring-zinc-200">
                                <source src="/videos/showcase.mp4" type="video/mp4" />
                            </video>
                        ) : (
                            <div ref={ref}></div>
                        )}
                    </div>
                    <div className="pb-56">
                        <div className="flex flex-col gap-3 relative">
                            <h2 className="font-semibold md:text-4xl max-md:text-2xl text-black flex gap-4 items-center">Why Bridge when there are a lot of other tools?</h2>
                        </div>
                        <div className="h-[200vh] relative flex flex-col items-start pt-16" ref={scrollDiv}>
                            <div className="flex justify-center sticky top-6 w-full z-10 max-md:top-28">
                                <div className="px-2 max-md:py-0.5 ring-1 ring-zinc-200 bg-white rounded-full items-center flex relative shadow-md overflow-hidden max-sm:w-full sm:gap-4 md:gap-0">
                                    <h3 className={"md:px-4 py-3 max-md:px-1.5 font-medium md:text-lg max-md:text-sm relative z-10 text-center max-sm:flex-grow " + (scrollPosition < 0.2 ? "text-black" : "text-gray-400")} ref={navItems[0]}>Customizable</h3>
                                    <h3 className={"md:px-4 py-3 max-md:px-1.5 font-medium md:text-lg max-md:text-sm relative z-10 text-center truncate max-sm:flex-grow " + (scrollPosition > 0.2 && scrollPosition < 0.4 ? "text-black" : "text-gray-400")} ref={navItems[1]}>Organisable</h3>
                                    <h3 className={"md:px-4 py-3 max-md:px-1.5 font-medium md:text-lg max-md:text-sm relative z-10 text-center truncate max-sm:flex-grow " + (scrollPosition > 0.4 ? "text-black" : "text-gray-400")} ref={navItems[2]}>Super fast</h3>

                                    <div className="bg-zinc-100 ring-4 ring-zinc-100 absolute top-2 bottom-2 rounded-full transition-all opacity-0" ref={navRect} />
                                </div>
                            </div>
                            <div className="sticky top-0 max-md:top-8 w-full h-auto col-span-2 flex items-center justify-center">
                                {scrollPosition < 0.2 && (
                                    <div className="w-full h-screen flex items-center">
                                        <div className="bg-gradient-to-br from-purple-300 to-fuchsia-400 h-[90vh] max-md:h-[70vh] max-md:top-8 w-full rounded-3xl relative top-4 flex flex-col items-center justify-center overflow-hidden">
                                            <div className="flex gap-16 justify-center items-start group">
                                                <div className="flex flex-col gap-16 w-80 h-auto items-center absolute left-[50%] z-10 top-[50%] translate-y-[-50%] transition-all translate-x-[-50%] rotate-0 duration-700" ref={inViewState[5]}>
                                                    <p className="text-center text-white font-medium text-lg relative z-10 transition-all -rotate-6 group-hover:rotate-0 scale-125 group-hover:scale-100 duration-500 selection:bg-fuchsia-400" ref={inViewState[4]}>Elegant Colors</p>
                                                    <div className="p-2 bg-black rounded-xl flex gap-2 relative z-10 shadow-xl scale-125 group-hover:scale-100 right-8 transition-all group-hover:right-0 -rotate-6 group-hover:rotate-0 duration-500" ref={inViewState[0]}>
                                                        <div className="h-10 w-10 bg-white rounded-full color-p" />
                                                        <div className="h-10 w-10 bg-zinc-200 rounded-full color-p" />
                                                        <div className="h-10 w-10 bg-zinc-400 rounded-full color-p" />
                                                        <div className="h-10 w-10 bg-zinc-600 rounded-full color-p" />
                                                        <div className="h-10 w-10 bg-zinc-800 rounded-full color-p" />
                                                    </div>
                                                    <div className="p-2 bg-black rounded-xl flex gap-2 relative z-10 shadow-xl scale-125 group-hover:scale-100 left-8 transition-all group-hover:left-0 -rotate-6 group-hover:rotate-0 duration-500" ref={inViewState[1]}>
                                                        <div className="h-10 w-10 bg-red-200 rounded-full color-p" />
                                                        <div className="h-10 w-10 bg-red-400 rounded-full color-p" />
                                                        <div className="h-10 w-10 bg-red-500 rounded-full color-p" />
                                                        <div className="h-10 w-10 bg-red-600 rounded-full color-p" />
                                                        <div className="h-10 w-10 bg-red-800 rounded-full color-p" />
                                                    </div>
                                                    <div className="p-2 bg-black rounded-xl flex gap-2 relative z-10 shadow-xl scale-125 group-hover:scale-100 right-8 transition-all group-hover:right-0 -rotate-6 group-hover:rotate-0 duration-500" ref={inViewState[2]}>
                                                        <div className="h-10 w-10 bg-green-200 rounded-full color-p" />
                                                        <div className="h-10 w-10 bg-green-400 rounded-full color-p" />
                                                        <div className="h-10 w-10 bg-green-500 rounded-full color-p" />
                                                        <div className="h-10 w-10 bg-green-600 rounded-full color-p" />
                                                        <div className="h-10 w-10 bg-green-800 rounded-full color-p" />
                                                    </div>
                                                    <div className="p-2 bg-black rounded-xl flex gap-2 relative z-10 shadow-xl scale-125 group-hover:scale-100 left-8 transition-all group-hover:left-0 -rotate-6 group-hover:rotate-0 duration-500" ref={inViewState[3]}>
                                                        <div className="h-10 w-10 bg-blue-200 rounded-full color-p" />
                                                        <div className="h-10 w-10 bg-blue-400 rounded-full color-p" />
                                                        <div className="h-10 w-10 bg-blue-500 rounded-full color-p" />
                                                        <div className="h-10 w-10 bg-blue-600 rounded-full color-p" />
                                                        <div className="h-10 w-10 bg-blue-800 rounded-full color-p" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)}
                                {scrollPosition > 0.2 && scrollPosition < 0.4 && entries.length > 0 && (
                                    <div className="w-full h-screen flex items-center">
                                        <div className="bg-gradient-to-br overflow-hidden from-blue-300 to-indigo-400 h-[90vh] max-md:h-[70vh] max-md:top-8 w-full rounded-3xl relative top-4 flex items-center justify-center flex-col gap-4 p-8">
                                            <p className="text-center text-white font-medium text-lg relative z-10">Manage your candidates</p>
                                            <div className="p-4 rounded-xl mx-auto bg-white shadow-xl w-[512px] max-w-full relative z-30 scale-105 transition-all duration-200" ref={cards[0]}>
                                                <p className="font-medium text-lg p-2 flex flex-wrap items-center md:gap-2 mb-2">Project Submissions</p>
                                                <div className="ring-1 ring-zinc-200 rounded-lg">
                                                    <div className="grid text-xs text-black sm:grid-cols-3 max-sm:grid-cols-2 w-full gap-8 p-2 px-3 justify-between items-center bg-zinc-100 rounded-t-lg border-b border-zinc-200">
                                                        <p className="max-sm:hidden">Time</p>
                                                        <p>Name</p>
                                                        <p className="w-full text-right">Status</p>
                                                    </div>

                                                    <div className="p-1">
                                                        <div className="grid sm:grid-cols-3 max-sm:grid-cols-2 w-full gap-8 p-2 justify-between hover:bg-zinc-50 rounded-lg items-center">
                                                            <p className="text-sm max-sm:hidden text-indigo-400">
                                                                11:03
                                                            </p>
                                                            <div className="flex gap-4 items-center">
                                                                <p className="">Bob U.</p>
                                                            </div>
                                                            <div className="w-full flex justify-end">
                                                                <Icon.DotsThree size={32} className="hover:bg-zinc-100 text-gray-800 transition-all rounded-md p-1 cursor-pointer" />
                                                            </div>
                                                        </div>
                                                        <div className="grid sm:grid-cols-3 max-sm:grid-cols-2 w-full gap-8 p-2 justify-between hover:bg-zinc-50 rounded-lg items-center">
                                                            <p className="text-sm max-sm:hidden text-indigo-400">
                                                                3:32
                                                            </p>
                                                            <div className="flex gap-4 items-center">
                                                                <p className="">Johnson B.</p>
                                                            </div>
                                                            <div className="w-full flex justify-end">
                                                                <Icon.DotsThree size={32} className="hover:bg-zinc-100 text-gray-800 transition-all rounded-md p-1 cursor-pointer" />
                                                            </div>
                                                        </div>
                                                        <div className="grid sm:grid-cols-3 max-sm:grid-cols-2 w-full gap-8 p-2 justify-between hover:bg-zinc-50 rounded-lg items-center">
                                                            <p className="text-sm max-sm:hidden text-indigo-400">
                                                                6:15
                                                            </p>
                                                            <div className="flex gap-4 items-center">
                                                                <p className="">Peter T.</p>
                                                            </div>
                                                            <div className="w-full flex justify-end">
                                                                <Icon.DotsThree size={32} className="hover:bg-zinc-100 text-gray-800 transition-all rounded-md p-1 cursor-pointer" />
                                                            </div>
                                                        </div>
                                                        <div className="grid sm:grid-cols-3 max-sm:grid-cols-2 w-full gap-8 p-2 justify-between hover:bg-zinc-50 rounded-lg items-center">
                                                            <p className="text-sm max-sm:hidden text-indigo-400">
                                                                8:49
                                                            </p>
                                                            <div className="flex gap-4 items-center">
                                                                <p className="">Igor S.</p>
                                                            </div>
                                                            <div className="w-full flex justify-end">
                                                                <Icon.DotsThree size={32} className="hover:bg-zinc-100 text-gray-800 transition-all rounded-md p-1 cursor-pointer" />
                                                            </div>
                                                        </div>
                                                        <div className="grid sm:grid-cols-3 max-sm:grid-cols-2 w-full gap-8 p-2 justify-between hover:bg-zinc-50 rounded-lg items-center">
                                                            <p className="text-sm max-sm:hidden text-indigo-400">
                                                                10:12
                                                            </p>
                                                            <div className="flex gap-4 items-center">
                                                                <p className="">John D.</p>
                                                            </div>
                                                            <div className="w-full flex justify-end">
                                                                <Icon.DotsThree size={32} className="hover:bg-zinc-100 text-gray-800 transition-all rounded-md p-1 cursor-pointer" />
                                                            </div>
                                                        </div>
                                                        {/* {entries.map((entry, index) => (
                                                            index < 4 &&
                                                            <div key={index} className="grid sm:grid-cols-3 max-sm:grid-cols-2 w-full gap-8 p-2 justify-between hover:bg-zinc-100 rounded-lg items-center">
                                                                <p className="text-sm max-sm:hidden text-indigo-400">{
                                                                    // only return the time from entry.fields.Date
                                                                    entry.fields.Date.split("T")[1].split(":").slice(0, 2).join(":")
                                                                }</p>
                                                                <div className="flex gap-4 items-center">
                                                                    <p className="font-medium">{entry.fields.Name}</p>
                                                                </div>

                                                                <div className="w-full flex justify-end">
                                                                    <Icon.DotsThree size={32} className="hover:bg-zinc-200 text-gray-800 transition-all rounded-md p-1 cursor-pointer" />
                                                                </div>
                                                            </div>
                                                        ))} */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-xl mx-auto bg-zinc-100 shadow-xl w-[512px] max-md:w-[72%] max-w-full z-20 absolute top-[50%] translate-y-[-24%] scale-95 h-80 transition-all duration-1000" ref={cards[1]} />
                                            <div className="p-4 rounded-xl mx-auto bg-zinc-100 shadow-xl w-[512px] max-md:w-[72%] max-w-full z-10 absolute top-[50%] translate-y-[-14%] scale-90 h-80 transition-all duration-1000" ref={cards[2]} />
                                            {/* <div className="text-black absolute bottom-24 right-72 max-md:right-24 animate-random-translate pointer-events-none z-40">
                                                <svg width="56" height="59" viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g>
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.8407 12.5161L17.4865 10.8649L5 4L8.64025 17.7764L11.3663 13.668L14.63 17.8454L16.1044 16.6935L12.8407 12.5161V12.5161Z" fill="currentColor" />
                                                        <path d="M17.654 11.3361L18.7031 10.9632L17.7274 10.4268L5.24089 3.56185L4.21854 2.99978L4.51659 4.12773L8.15684 17.9042L8.44129 18.9806L9.05688 18.0529L11.3994 14.5225L14.236 18.1532L14.5439 18.5472L14.9379 18.2394L16.4122 17.0875L16.8063 16.7797L16.4984 16.3857L13.6618 12.7549L17.654 11.3361Z" stroke="white" />
                                                    </g>
                                                    <defs>
                                                        <filter id="filter0_d_298_11" x="0.4375" y="-0.000488281" width="22.4824" height="24.1853" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                            <feOffset dy="1" />
                                                            <feGaussianBlur stdDeviation="1.5" />
                                                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_298_11" />
                                                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_298_11" result="shape" />
                                                        </filter>
                                                    </defs>
                                                </svg>
                                            </div> */}
                                        </div>
                                    </div>
                                )}
                                {scrollPosition > 0.4 && (
                                    <div className="w-full h-screen flex items-center">

                                        <div className="bg-gradient-to-br from-green-300 to-emerald-400 h-[90vh] max-md:h-[70vh] max-md:top-8 w-full rounded-3xl top-4 flex flex-col gap-4 justify-center items-center overflow-hidden relative">
                                            <p className="text-white font-medium text-xl relative z-10 selection:bg-green-300">Create in no time</p>
                                            {/* <div className="text-emerald-500 bg-white shadow-xl px-4 py-2 rounded-xl relative z-10 md:h-80 md:w-72 flex items-center justify-center">
                                                <h4 className="text-[96px] text-emerald-300 font-bold animate-pulse absolute z-10">≈ 5 <span className="text-4xl">mins</span></h4>
                                                <h4 className="text-[96px] font-bold relative">≈ 5 <span className="text-4xl">mins</span></h4>
                                            </div> */}
                                            <div className="absolute z-10 flex flex-col items-center justify-center translate-x-[-50%] left-[30%] bg-white shadow-xl h-28 w-28 md:h-40 md:w-40 rounded-full top-[20%] translate-y-[-0%] transition-all duration-1000 opacity-0" ref={circles[0]}>
                                                <Image
                                                    src="/images/general/custom_cursor.svg"
                                                    alt="Custom Bridge Cursor"
                                                    width={92}
                                                    height={92}

                                                />
                                                <p className="absolute -bottom-8 font-medium text-white">Build</p>
                                            </div>
                                            <div className="absolute z-10 flex flex-col items-center justify-center translate-x-[-50%] right-[10%] bg-white shadow-xl h-28 w-28 md:h-40 md:w-40 rounded-full top-[30%] translate-y-[-0%] transition-all duration-1000 opacity-0 max-md:right-[-10%]" ref={circles[1]}>
                                                <Image
                                                    src="/images/general/custom_cursor.svg"
                                                    alt="Custom Bridge Cursor"
                                                    width={92}
                                                    height={92}

                                                />
                                                <p className="absolute -bottom-8 font-medium text-white">Publish</p>
                                            </div>
                                            <div className="absolute z-10 flex flex-col items-center justify-center translate-x-[-50%] left-[45%] bg-white shadow-xl h-28 w-28 md:h-40 md:w-40 rounded-full top-[80%] translate-y-[-0%] transition-all duration-1000 opacity-0" ref={circles[2]}>
                                                <Image
                                                    src="/images/general/custom_cursor.svg"
                                                    alt="Custom Bridge Cursor"
                                                    width={92}
                                                    height={92}

                                                />
                                                <p className="absolute -bottom-8 font-medium text-white">Share</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="rounded-3xl bg-zinc-50 relative overflow-hidden mb-12">
                        <div className="pt-10 px-8 rounded-[23px] relative z-20 max-md:pb-8">
                            <div className="flex flex-col gap-3">
                                <h2 className="font-semibold md:text-3xl max-md:text-2xl text-black flex gap-4 items-center justify-center">Integrate in your Pipeline</h2>
                            </div>
                            <div className="max-md:h-80 w-full flex justify-center max-md:pb-12 max-md:pt-12">
                                <RiveComponent
                                    src="/animations/bridge_explanation.riv"
                                    artboard={typeof window !== "undefined" && window.innerWidth < 768 ? "artboard_mobile" : "artboard"}
                                    className="max-md:w-screen md:w-[85%] max-md:absolute max-md:translate-x-[-50%] left-[50%] aspect-video"
                                />
                            </div>
                        </div>
                    </div>
                    {/* <div className="rounded-3xl bg-zinc-50 relative overflow-hidden">
                        <div className="pt-10 px-8 rounded-[23px] relative z-20 bg-zinc-50">
                            <div className="flex flex-col gap-3">
                                <h2 className="font-semibold md:text-3xl max-md:text-2xl text-black flex gap-4 items-center justify-center">AI Choices <span className="rounded-full ring-2 ring-fuchsia-300 text-fuchsia-500 text-base px-2 py-1">Soon</span></h2>
                            </div>
                            <div className="max-md:h-80 w-full flex justify-center">
                                <RiveComponent src="/animations/bridge_ai.riv" className="max-md:w-screen md:w-[85%] max-md:absolute max-md:translate-x-[-50%] left-[50%] aspect-video" />
                            </div>
                        </div>
                    </div> */}
                    <div className="h-24" />
                    <div className="min-h-64 pt-24">
                        <div className="w-full flex justify-center flex-col gap-3 mb-16 max-md:mb-10">
                            <h2 className="font-semibold md:text-3xl max-md:text-xl text-black flex gap-4 items-center justify-center">Fixed pricing, adjusted to your business</h2>
                            {/* <p className="text-gray-500 text-lg font-medium">Because 90% of Bridge Users are using mobile browsers.</p> */}
                        </div>
                        <div className="w-full grid grid-cols-4 gap-8 items-start max-lg:grid-cols-1 mb-4 max-w-3xl mx-auto">
                            <div className="p-10 bg-white ring-1 ring-zinc-200 rounded-3xl shadow-md col-span-2 relative z-20 transition-all hover:bg-zinc-100 hover:bg-opacity-50">
                                <h3 className="text-2xl font-medium text-black mb-8">Starter</h3>
                                <div className="flex flex-col gap-4 mb-16">
                                    <div className="flex items-center gap-2 font-medium">
                                        <Icon.Check size={20} weight="bold" />
                                        Try with one project for free
                                    </div>
                                    <div className="flex items-center gap-2 font-medium">
                                        <Icon.Check size={20} weight="bold" />
                                        Basic Support within a few days
                                    </div>
                                    <div className="flex items-center gap-2 font-medium">
                                        <Icon.Check size={20} weight="bold" />
                                        Share with individual URL
                                    </div>
                                </div>
                                <p className="text-3xl font-semibold mb-6">Free</p>
                                <button
                                    onClick={() => {
                                        openModal(true);
                                    }}
                                    className="bg-black hover:bg-zinc-900 w-full text-white font-medium rounded-lg px-4 py-2">Start for free</button>
                            </div>
                            <div className="col-span-2 relative">
                                <div className="p-10 bg-white bg-opacity-50 ring-1 ring-zinc-200 rounded-3xl shadow-md col-span-2 relative z-20 transition-all hover:bg-zinc-100 hover:bg-opacity-50 group">
                                    <div className="bg-purple-500 rounded-full absolute -top-3 -right-3 px-2 py-1 text-sm flex items-center gap-2 text-white font-medium group-hover:scale-105 transition-all group-hover:rotate-1">
                                        <Icon.StarFour size={12} weight="fill" />
                                        Popular
                                    </div>
                                    <h3 className="text-2xl font-medium text-black mb-8">Pro</h3>
                                    <div className="flex flex-col gap-4 mb-16">
                                        <div className="flex items-center gap-2 font-medium">
                                            <Icon.Check size={20} weight="bold" />
                                            Create up to 10 projects
                                        </div>
                                        <div className="flex items-center gap-2 font-medium">
                                            <Icon.Check size={20} weight="bold" />
                                            Support within 24 hours
                                        </div>
                                        <div className="flex items-center gap-2 font-medium">
                                            <Icon.Check size={20} weight="bold" />
                                            Connect a custom domain
                                        </div>
                                        <div className="flex items-center gap-2 font-medium">
                                            <Icon.Check size={20} weight="bold" />
                                            Full feature support
                                        </div>
                                    </div>
                                    <p className="text-3xl font-semibold mb-6">49 € <span className="text-lg">/m</span></p>
                                    <button
                                        onClick={() => {
                                            openModal(true);
                                        }}
                                        className="bg-black hover:bg-zinc-900 w-full text-white font-medium rounded-lg px-4 py-2">Subscribe to Pro</button>
                                </div>
                                <div className="w-96 h-96 absolute z-10 pointer-events-none -right-40 top-16 bg-[url('/images/general/background_artwork_pricing.svg')] bg-cover bg-no-repeat bg-center max-lg:hidden" />
                            </div>
                            <div className="relative">
                            </div>
                        </div>
                        <p className="text-gray-500 max-w-3xl mx-auto">Options not fitting? We offer more options for enterprises:
                            <Link href="mailto:hello@bridge.supply" className="text-black font-medium hover:underline ml-1">
                                hello@bridge.supply
                            </Link></p>
                    </div>
                    {/* <div className="min-h-64 pt-24">
                        <div className="w-full flex justify-center flex-col md:items-center gap-3 mb-16">
                            <h2 className="font-semibold md:text-4xl max-md:text-2xl text-black flex gap-4 items-center">Designed to be mobile first</h2>
                            <p className="text-gray-500 text-xl font-medium">Because 90% of Bridge Users are using mobile browsers.</p>
                        </div>
                        <div className="flex gap-16 items-end justify-center w-full relative">
                            <Image src="/images/general/bridge_mockup_iphone.jpg" alt="Bridge Mobile" width={300} height={300} />
                            {/* <Image src="/images/general/bridge_mockup_macbook.jpg" alt="Bridge Mobile" width={1000} height={600} className="max-xl:hidden" /> */}
                    {/* <div className="absolute md:bottom-16 max-md:-bottom-16 right-0 px-6 gap-8 flex flex-col items-start py-4 bg-white rounded-lg ring-1 ring-zinc-200 shadow-md text-gray-500 max-w-md">
                                <p>We have designed Bridge in a way that it is easy to use on both mobile and desktop devices.
                                    You do not need to wrap your mind around how to layout everything, Bridge is responsive from the start.</p>
                                <button className="font-medium px-4 py-2 bg-black text-white rounded-lg transition-all hover:opacity-80" onClick={openModal}>
                                    Join now
                                </button>

                            </div>
                        </div>
                    </div> */}
                    <div className="h-56" />
                    <div className="grid grid-cols-3 gap-24 max-md:gap-16 w-full max-md:grid-cols-1">
                        <div className="w-full flex flex-col">
                            <h3 className="text-lg font-semibold mb-1">Bridge</h3>
                            <p className="text-gray-500">Bring joy to your hiring process.</p>
                        </div>
                        <div className="w-full flex flex-col items-end max-md:items-start">
                            <div className="flex flex-col items-start">
                                <h3 className="font-semibold mb-3">Navigation</h3>
                                <Link href="/" className="hover:bg-gray-100 transition-all text-gray-700 px-2 py-1 rounded-md -ml-2 mb-2">Home</Link>
                                <Link href="/login" className="hover:bg-gray-100 transition-all text-gray-700 px-2 py-1 rounded-md -ml-2 mb-2">Login</Link>
                                <p
                                    className="hover:bg-gray-100 transition-all text-gray-700 px-2 py-1 rounded-md -ml-2 mb-2 cursor-pointer"
                                    onClick={() => {
                                        openModal(true);
                                    }}>Sign up</p>
                            </div>
                        </div>
                        <div className="w-full flex flex-col items-end max-md:items-start">
                            <div className="flex flex-col items-start">
                                <h3 className="font-semibold mb-3">Social</h3>
                                <Link href="https://twitter.com/floriandwt" target="_blank" className="hover:bg-gray-100 transition-all text-gray-700 px-2 py-1 rounded-md -ml-2 mb-2 flex gap-1 items-center flex-wrap"><Icon.TwitterLogo weight="fill" /> @florandwt <span className="text-xs w-full">(Creator)</span></Link>
                            </div>
                        </div>
                    </div>
                    <div className="py-24">
                        <div className="flex justify-between items-center max-md:flex-col gap-8">
                            <div className="flex gap-1 items-center text-xs font-medium text-violet-500">
                                Made in Germany with <Icon.Heart size={12} weight="fill" />
                            </div>
                            <div className="flex gap-4 items-center text-gray-500 text-xs font-medium">
                                <Link href="/imprint" className="hover:bg-gray-100 transition-all text-gray-500 px-2 py-1 rounded-md -ml-2 mb-2">Imprint</Link>
                                <Link href="/privacy" className="hover:bg-gray-100 transition-all text-gray-500 px-2 py-1 rounded-md -ml-2 mb-2">Privacy</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {customCursor && <Image
                priority
                src="/images/general/custom_cursor.svg"
                alt="Custom Bridge Cursor"
                width={96}
                height={96}
                ref={cursor}
                className={
                    "fixed z-50 -translate-x-10 -translate-y-8 pointer-events-none max-md:hidden"
                }
            />}
            <div></div>
            {waitlist && <WaitList isOpen={isOpen} closeModal={closeModal} openModal={openModal} />}
        </>
    );
}