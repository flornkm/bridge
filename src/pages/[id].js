import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import { NextSeo } from 'next-seo'
import { useEffect, useState, useRef } from 'react';
import * as Icon from 'phosphor-react'
import Confetti from 'react-dom-confetti';

export default function Published() {
    const [data, setData] = useState(null);
    const [confetti, setConfetti] = useState(false);
    const [formData, setFormData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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
            let name = id.substring(0, id.indexOf('-'));
            let projNum = id.substring(id.indexOf('-') + 1);

            fetch(`/api/published?name=${name}&id=${projNum}`, {
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

    function handleInputChange(event) {
        const { name, value, type } = event.target;
        const newValue = type === 'file' ? event.target.files[0] : value;
        setFormData(prevState => ({ ...prevState, [name]: newValue }));

        if (type === 'file') {
            // send to api/upload
            const fileData = new FormData();
            fileData.append('file', newValue);
            fileData.append('upload_preset', 'nextjs');

            fetch('/api/upload', {
                method: 'POST',
                body: fileData,
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    setFormData(prevState => ({ ...prevState, [name]: data.fileName }));
                    setError(prevState => ({ ...prevState, [name]: null }));
                })
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        let errorCount = 0;

        if (!formData) {
            data.content.map((items, index) => {
                items.content.map((item, index) => {
                    if (item.type === 'textInput' && item.required) {
                        setError(prevState => ({ ...prevState, [item.label]: 'This field is required' }));
                        errorCount++;
                    } else if (item.type === 'fileUpload' && item.required) {
                        setError(prevState => ({ ...prevState, [item.label]: 'This field is required' }));
                        errorCount++;
                    }
                })
            })
        } else {
            data.content.map((items, index) => {
                items.content.map((item, index) => {
                    if (item.type === 'textInput') {
                        if (!formData[item.label] && item.required) {
                            setError(prevState => ({ ...prevState, [item.label]: 'This field is required' }));
                            errorCount++;
                        } else {
                            setError(prevState => ({ ...prevState, [item.label]: null }));
                        }
                    } else if (item.type === 'fileUpload') {
                        // also look at file size
                        if (!formData[item.label] && item.required) {
                            setError(prevState => ({ ...prevState, [item.label]: 'This field is required' }));
                            errorCount++;
                        } else {
                            let file = formData[item.label];
                            if (!file) return;
                            let fileSize = file.size / 1024 / 1024; // in MB
                            if (fileSize > 2.5) {
                                setError(prevState => ({ ...prevState, [item.label]: 'File size must be less than 2.5MB' }));
                                errorCount++;
                            } else {
                                setError(prevState => ({ ...prevState, [item.label]: null }));
                            }
                        }
                    }
                })
            })
        }

        if (errorCount === 0) {
            let confetti = data.effects.confetti;

            let submitData = formData;

            // for the empty inputs, set them to empty string
            data.content.map((items, index) => {
                items.content.map((item, index) => {
                    if (item.type === 'textInput') {
                        if (!formData[item.label]) {
                            submitData[item.label] = '';
                        }
                    } else if (item.type === 'fileUpload') {
                        if (!formData[item.label]) {
                            submitData[item.label] = '';
                        }
                    }
                })
            })

            // put the empty fields to corresponding position so that the data is in the correct order every time
            let submitDataArr = [];
            data.content.map((items, index) => {
                items.content.map((item, index) => {
                    if (item.type === 'textInput') {
                        submitDataArr.push({ [item.label]: submitData[item.label] });
                    } else if (item.type === 'fileUpload') {
                        submitDataArr.push({ [item.label]: submitData[item.label] });
                    }
                })
            })

            // set the submitData to the correct order
            submitData = {};
            submitDataArr.map((item, index) => {
                submitData = { ...submitData, ...item };
            })

            setLoading(true);
            fetch(`/api/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ submitData, id: id.substring(36) }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.message === 'Success!') {
                        setLoading(false);
                        setSubmitted(true);
                        if (confetti) {
                            setConfetti(true)
                            setTimeout(() => {
                                setConfetti(false)
                            }, 3000);
                        }
                    }
                })
        }
    }

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
            <NextSeo
                title={data && data.name ? data.name : id && id.substring(0, id.indexOf('-'))}
                description="Visit this site to continue"
                openGraph={{
                    type: 'website', url: "bridge.supply", title: id && id.substring(0, id.indexOf('-')),
                    description: "Visit this site to continue",
                    images: [
                        {
                            url: id && `https://bridge.supply/api/og?title=${id && id.substring(0, id.indexOf('-'))}&text=Visit%20this%20site%20to%20continue`,
                            width: 1200, height: 600, alt: id && id.substring(0, id.indexOf('-')),
                        }
                    ]
                }}
            />
            <main className="h-full w-full bg-white overflow-hidden">
                <div className="max-md:w-[90%] min-h-screen w-full max-w-7xl md:pl-[15%] md:pr-[15%] m-auto pb-16 bg-white pt-24">
                    <div className="flex flex-col">
                        {!data && (
                            <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-6 bg-white overflow-hidden rounded-lg">
                                <div className="h-16 w-16 relative rounded-full ring-8 ring-purple-500 z-0 animate-spin"> <div className="absolute -left-4 -top-4 bg-white z-10 h-12 w-12 transition-all" /> </div>
                            </div>
                        )}
                        {data && data.content !== undefined && (
                            data.content.map((items, index) => {
                                return (
                                    <div key={index} className={`flex flex-col gap-4 mb-16 ${(() => {
                                        // if every item in items.content has visibility set to false, return true
                                        return items.content.every((item) => !item.visibility);
                                    })() ? "hidden" : ""}`}>
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
                                                        <div className="relative">
                                                            <input required={item.required} className={"border border-gray-200 bg-gray-50 rounded-md px-4 py-3 w-full brdg-border "}
                                                                style={{ color: data.colors.text }}
                                                                placeholder={item.content}
                                                                name={item.label}
                                                                onChange={handleInputChange}
                                                            />
                                                            {error && error[item.label] && <div className="text-xs text-red-500 absolute right-2 top-[50%] translate-y-[-50%] z-10 pointer-events-none px-2">
                                                                <p className="relative z-10">{error[item.label]}</p>
                                                                <div className="w-full h-full bg-white blur-md absolute top-0 left-0" />
                                                                <div className="w-full h-full bg-white blur-md absolute top-0 left-0" />
                                                                <div className="w-full h-full bg-white blur-md absolute top-0 left-0" />
                                                            </div>}
                                                        </div>
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
                                                        <label
                                                            htmlFor={index}
                                                            style={{ backgroundColor: data.colors.primaryButton }}
                                                            className={"text-white mb-1 font-medium focus:outline-[#60A5FA] outline-none outline-offset-0 rounded-xl max-md:w-full justify-center py-4 px-6 hover:opacity-90 transition-all cursor-pointer items-center flex gap-2 relative"}>
                                                            <Icon.Paperclip size={22} className="inline-block" />
                                                            {item.content}
                                                        </label>

                                                        <div className="md:flex w-full justify-between items-center flex-wrap">
                                                            <input
                                                                onmousedown={(e) => e.preventDefault()}
                                                                required={item.required}
                                                                style={{ color: data.colors.text }}
                                                                className={"file:hidden rounded-lg py-1.5 px-3"}
                                                                type="file"
                                                                id={index}
                                                                name={item.label}
                                                                onChange={handleInputChange}
                                                                accept="application/pdf"
                                                                readOnly={true}
                                                            />
                                                            {error && error[item.label] &&
                                                                <div className="text-xs text-red-500 relative pointer-events-none px-2">
                                                                    <p className="relative z-10">{error[item.label]}</p>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            } else if (item.type === "submit" && item.visibility) {
                                                return (
                                                    <div key={index} className={"flex flex-col gap-1 items-start " + (submitted && "cursor-not-allowed")}>
                                                        <button onClick={(e) => {
                                                            if (item.type === "submit") {
                                                                handleSubmit(e);
                                                            }
                                                        }} key={index} style={{ backgroundColor: data.colors.primaryButton }} className={"text-white font-medium rounded-xl max-md:w-full justify-center py-4 px-8 gap-4 focus:ring-gray-400 hover:opacity-90 transition-all cursor-pointer items-center flex relative   " + (submitted && "pointer-events-none")}>
                                                            {loading && <div className="h-5 w-5 relative rounded-full ring-2 ring-white z-0 animate-spin"> <div className="absolute -left-1 -top-1 z-10 h-3 w-3 transition-all" style={{ backgroundColor: data.colors.primaryButton }} /> </div>}
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
