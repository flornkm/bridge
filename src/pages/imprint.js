import Image from 'next/image'
import { NextSeo } from 'next-seo'

export default function Published() {
    return (
        <>
            <NextSeo
                title="Imprint"
                description="Visit this site to continue"
                nofollow={true}
                noindex={true}
            />
            <div className="max-md:w-[90%] w-full max-w-7xl pl-[5%] pr-[5%] flex justify-between py-4 items-center fixed translate-x-[-50%] left-[50%] z-50">
                <Image
                    alt="Bridge Logo"
                    src="/images/general/logo.svg"
                    width={48}
                    height={32}
                    className="cursor-pointer"
                />
                <div className="flex gap-4 max-sm:gap-2 mix-blend-screen bg-white ring-4 ring-white rounded-lg">
                    <button onClick={() => {
                        window.location.href = "/"
                    }} className="font-medium px-4 py-2 bg-black text-white rounded-lg transition-all hover:bg-zinc-800 flex gap-3 items-center group">
                        Back to home
                    </button>
                </div>
            </div>
            <main className="h-full w-full bg-white overflow-hidden">
                <div className="max-md:w-[90%] w-full max-w-7xl pl-[15%] pr-[15%] m-auto pt-24 bg-white pb-24">
                    <h1 className="font-semibold text-3xl">
                        Imprint
                    </h1>
                    <div class="text-left">
                    <div class="text-left pt-8">
                        <span class="text-gray-500 text-sm">
                            <strong className="pr-1">Responsible for this tool <br/></strong>
                            <span>Florian Kiem, Uferstr. 48, 73525 Schwäbisch Gmünd</span>
                        </span>
                    </div>
                    <div class="text-left pt-4">
                        <span class="text-gray-500 text-sm">
                            <strong className="pr-1">Contact <br/></strong>
                            <span>florian@designwithtech.com</span>
                        </span>
                    </div>
                    </div>
                    <div class="text-center">
                        <br />
                    </div>
                    <div class="text-left">
                        <br />
                    </div>
                    <div class="text-left">
                        <span class="text-gray-500 text-sm">
                            <strong>Last updated&nbsp;</strong>
                            <span>May 19, 2023</span>
                        </span>
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        <h2 class="text-xl font-bold">WEBSITE DISCLAIMER</h2>
                    </div>
                    <div>
                        <br />
                    </div>
                    <div class="text-left">
                        <p class="text-gray-600">
                            The information provided by Bridge on https://bridge.supply/ (the Site) is for general informational purposes only.
                            All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
                            UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE.
                            YOUR USE OF THE SITE AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE IS SOLELY AT YOUR OWN RISK.
                        </p>
                    </div>
                    <div>
                        <br />
                    </div>
                    <div>
                        <h2 class="text-xl font-bold">EXTERNAL LINKS DISCLAIMER</h2>
                    </div>
                    <div>
                        <p class="text-gray-600">
                            The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising.
                            Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
                            WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED THROUGH THE SITE OR ANY WEBSITE OR FEATURE LINKED IN ANY BANNER OR OTHER ADVERTISING.
                            WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES.
                        </p>
                    </div>
                    <div>
                        <div class="py-4">
                            <p class="text-base text-gray-600">
                                The views and opinions contained in the testimonials belong solely to the individual user and do not reflect our views and opinions.
                                <span class="block">
                                    We are not affiliated with users who provide testimonials, and users are not paid or otherwise compensated for their testimonials.
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
