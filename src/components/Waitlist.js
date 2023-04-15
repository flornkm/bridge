import Image from 'next/image';
import { Fragment, useState, useRef, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import RiveComponent from '@rive-app/react-canvas';
import { useRive, Layout, Fit } from "@rive-app/react-canvas";

function WaitList(props) {
    const [loading, setLoading] = useState(true);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreeShowcase, setAgreeShowcase] = useState(false);
    const [data, setData] = useState({
        name: "",
        email: "",
        agreeTerms: false,
        agreeShowcase: false,
    });
    const [apiLoad, setApiLoad] = useState(false);
    const [success, setSuccess] = useState(false);

    const { rive: termsAnimation, RiveComponent: RiveComponentTerms } = useRive({
        src: "/animations/checkmark.riv",
        artboard: "checkmark",
        layout: new Layout({ fit: Fit.Cover }),
        onLoad: () => { setLoading(false) },
    });

    function termsClick() {
        if (termsAnimation) {
            if (!agreeTerms) {
                termsAnimation.play("on")
                setAgreeTerms(true);
                setData({ ...data, agreeTerms: true });
            } else {
                termsAnimation.play("off");
                setAgreeTerms(false);
                setData({ ...data, agreeTerms: false });
            }
        }
    }

    const { rive: showcaseAnimation, RiveComponent: RiveComponentShowcase } = useRive({
        src: "/animations/checkmark.riv",
        artboard: "checkmark",
        layout: new Layout({ fit: Fit.Cover }),
        onLoad: () => setLoading(false),
    });

    function showcaseClick() {
        if (showcaseAnimation) {
            if (!agreeShowcase) {
                showcaseAnimation.play("on")
                setAgreeShowcase(true);
                setData({ ...data, agreeShowcase: true });
            } else {
                showcaseAnimation.play("off");
                setAgreeShowcase(false);
                setData({ ...data, agreeShowcase: false });
            }
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setApiLoad(true);

        fetch("/api/airtable", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            // if the request is successful, set success to true
            .then(() => {
                setSuccess(true)
                setApiLoad(false);
            })
    }

    return (
        <Transition appear show={props.isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={props.closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md min-h-[512px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Transition
                                    show={!success && !apiLoad}
                                    enter="transition-opacity duration-150"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="transition-opacity duration-150"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <h2 className="text-xl font-semibold mb-2">Join the waitlist</h2>
                                    <div className="mt-2 mb-8">
                                        <p className="text-base text-gray-500">
                                            Be the first to get notified when we launch.
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className="w-full grid grid-cols-4 items-center">
                                            <label htmlFor="username" className="text-gray-500">
                                                Name
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                className="w-full ring-1 ring-neutral-200 rounded-lg p-2 col-span-3 focus:outline-gray-300"
                                                onChange={(e) => setData({ ...data, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="w-full grid grid-cols-4 items-center">
                                            <label htmlFor="username" className="text-gray-500">
                                                E-Mail
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                value={data.email}
                                                className="w-full ring-1 ring-neutral-200 rounded-lg p-2 col-span-3 focus:outline-gray-300"
                                                onChange={(e) => setData({ ...data, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="h-4" />
                                        <div className="w-full flex items-center gap-4 cursor-pointer focus:outline-gray-300 focus:outline-offset-8 rounded-lg" tabIndex={0} onKeyDown={(event) => {
                                            if (event.keyCode === 13) {
                                                termsClick();
                                            }
                                        }} onClick={termsClick}>
                                            <div className="w-full max-w-[24px] h-6 p-1 rounded-md cursor-pointer ring-1 ring-neutral-200 transition-all" style={{ backgroundColor: (!agreeTerms ? "#fafafa" : "#000") }}>
                                                <RiveComponentTerms />
                                            </div>
                                            <label htmlFor="username" className="text-gray-500 flex-grow cursor-pointer">
                                                I accept that my data will be stored and used for the
                                                purpose of the waitlist.
                                            </label>
                                        </div>
                                        <div className="w-full flex items-center gap-4 cursor-pointer focus:outline-gray-300 focus:outline-offset-8 rounded-lg" tabIndex={0} onKeyDown={(event) => {
                                            if (event.keyCode === 13) {
                                                showcaseClick();
                                            }
                                        }} onClick={showcaseClick}>
                                            <div className="w-full max-w-[24px] h-6 p-1 rounded-md cursor-pointer ring-1 ring-neutral-200 transition-all" style={{ backgroundColor: (!agreeShowcase ? "#fafafa" : "#000") }}>
                                                <RiveComponentShowcase />
                                            </div>
                                            <label htmlFor="username" className="text-gray-500 flex-grow cursor-pointer">
                                                I am okay with being showcased on the website.
                                            </label>
                                        </div>
                                    </div>

                                    <div className="w-full flex justify-left gap-4 mt-14">
                                        <div className="w-full">
                                            <button
                                                onClick={() => {
                                                    props.closeModal();
                                                }}
                                                className="font-medium px-3 py-2 rounded-lg ring-1 ring-neutral-200 bg-white text-black transition-all outline-gray-300 hover:bg-neutral-50 w-full focus:outline-gray-300">
                                                Cancel
                                            </button>
                                        </div>
                                        <div className="w-full">
                                            <button
                                                onClick={handleSubmit}
                                                className="font-medium px-3 py-2 rounded-lg bg-black text-white transition-all hover:bg-zinc-800 w-full focus:outline-gray-300">
                                                Sign up
                                            </button>
                                        </div>
                                    </div></Transition>
                                <Transition
                                    show={success && !apiLoad}
                                    enter="transition-opacity duration-150"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="transition-opacity duration-150"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="flex flex-col h-full w-full gap-2">
                                        <Image src="/images/general/bridge_3d.jpg" width={512} height={512} alt="3d bridge" className="max-h-[370px] object-contain animate-pulse" unoptimized />
                                        <div className="flex flex-col gap-2">
                                            <h2 className="text-xl font-semibold">Success</h2>
                                            <p className="text-base text-gray-500">
                                                Thanks for signing up! We will notify you as soon as we launch.
                                            </p>
                                        </div>
                                    </div>
                                </Transition>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default WaitList