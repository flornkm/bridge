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
    const [error, setError] = useState({
        name: false,
        email: false,
        agreeTerms: false,
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

    function verifyEmail(mail) {
        if (mail !== "" && mail.includes("@") && mail.includes(".") && mail.length > 4 && mail.length < 50) {
            return true;
        } else {
            return false;
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        let nameError = false;
        let emailError = false;
        let termsAgreeError = false;

        if (data.name === "") {
            nameError = true;
        }

        if (!verifyEmail(data.email)) {
            emailError = true;
        }

        if (!data.agreeTerms) {
            termsAgreeError = true;
        }

        setError({
            name: nameError,
            email: emailError,
            agreeTerms: termsAgreeError,
        });

        console.log(data, error);

        if (data.name !== "" && verifyEmail(data.email) && data.agreeTerms) {
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
                                        <div className="group w-full grid grid-cols-4 items-center relative">
                                            <label htmlFor="username" className="text-gray-500">
                                                Name
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                className="w-full border brdg-border border-neutral-200 rounded-lg p-2 col-span-3 focus:outline-none"
                                                onChange={(e) => setData({ ...data, name: e.target.value })}
                                            />
                                            {error.name && <div className="text-xs text-red-500 absolute right-2 top-[50%] translate-y-[-50%] z-10 pointer-events-none px-2">
                                                <p className="relative z-10">Enter Name</p>
                                                <div className="w-full h-full bg-white blur-md absolute top-0 left-0" />
                                                <div className="w-full h-full bg-white blur-md absolute top-0 left-0" />
                                                <div className="w-full h-full bg-white blur-md absolute top-0 left-0" />
                                            </div>}
                                        </div>
                                        <div className="group w-full grid grid-cols-4 items-center relative">
                                            <label htmlFor="username" className="text-gray-500">
                                                E-Mail
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                value={data.email}
                                                className="w-full border brdg-border border-neutral-200 rounded-lg p-2 col-span-3 focus:outline-none"
                                                onChange={(e) => setData({ ...data, email: e.target.value })}
                                            />
                                            {error.email && <div className="text-xs text-red-500 absolute right-2 top-[50%] translate-y-[-50%] z-10 pointer-events-none px-2">
                                                <p className="relative z-10">Enter a valid Email</p>
                                                <div className="w-full h-full bg-white blur-md absolute top-0 left-0" />
                                                <div className="w-full h-full bg-white blur-md absolute top-0 left-0" />
                                                <div className="w-full h-full bg-white blur-md absolute top-0 left-0" />
                                            </div>}
                                        </div>
                                        <div className="h-4" />
                                        <div className="group w-full flex items-center gap-4 cursor-pointer focus:outline-[#60A5FA] focus:outline-offset-8 rounded-lg relative" tabIndex={0} onKeyDown={(event) => {
                                            if (event.keyCode === 13) {
                                                termsClick();
                                            }
                                        }} onClick={termsClick}>
                                            <div className="w-full max-w-[24px] h-6 p-1 rounded-md cursor-pointer border transition-all" style={{ borderColor: (!agreeTerms ? "#e5e5e5" : "#000"), backgroundColor: (!agreeTerms ? "#fafafa" : "#000") }}>
                                                <RiveComponentTerms />
                                            </div>
                                            <label htmlFor="username" className="text-gray-500 flex-grow cursor-pointer">
                                                I accept that my data will be stored and used for the
                                                purpose of the waitlist.
                                            </label>
                                            {error.agreeTerms && <div className="text-xs text-red-500 absolute right-2 bottom-0 z-10 pointer-events-none px-2">
                                                <p className="relative z-10">Please accept</p>
                                                <div className="w-full h-full bg-white blur-md absolute top-0 left-0" />
                                                <div className="w-full h-full bg-white blur-md absolute top-0 left-0" />
                                                <div className="w-full h-full bg-white blur-md absolute top-0 left-0" />
                                            </div>}
                                        </div>

                                        <div className="group w-full flex items-center gap-4 cursor-pointer focus:outline-[#60A5FA] focus:outline-offset-8 rounded-lg" tabIndex={0} onKeyDown={(event) => {
                                            if (event.keyCode === 13) {
                                                showcaseClick();
                                            }
                                        }} onClick={showcaseClick}>
                                            <div className="w-full max-w-[24px] h-6 p-1 rounded-md cursor-pointer border transition-all" style={{ borderColor: (!agreeShowcase ? "#e5e5e5" : "#000"), backgroundColor: (!agreeShowcase ? "#fafafa" : "#000") }}>
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
                                                className="font-medium px-3 py-2 rounded-lg ring-1 ring-neutral-200 bg-white text-black transition-all hover:bg-neutral-50 w-full">
                                                Cancel
                                            </button>
                                        </div>
                                        <div className="w-full">
                                            <button
                                                onClick={handleSubmit}
                                                className="font-medium px-3 py-2 rounded-lg bg-black text-white transition-all hover:bg-zinc-800 w-full">
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
                                        <div className="h-[354px] mb-4 rounded-xl overflow-hidden ring-1 ring-violet-100">
                                            <Image src="/images/general/logo.svg" width={96} height={96} alt="3d bridge" className="absolute z-20 left-[50%] top-[40%] translate-x-[-50%] translate-y-[-50%]" />
                                            <Image src="/images/general/logo.svg" width={128} height={128} alt="3d bridge" className="absolute z-10 left-[50%] top-[40%] translate-x-[-50%] translate-y-[-50%] blur-3xl" />
                                            <Image src="/images/general/morph_lines.svg" width={512} height={512} alt="3d bridge" className="h-full w-full object-cover object-top" unoptimized />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <h2 className="text-xl font-semibold">Success! &#x1F38A;</h2>
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