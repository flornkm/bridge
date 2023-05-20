import Link from "next/link";
import * as Icon from 'phosphor-react'

function Footer() {
    return (<>
        <div className="h-56" />
        <div className="grid grid-cols-3 gap-24 max-md:gap-16 w-full max-md:grid-cols-1">
            <div className="w-full flex flex-col">
                <h3 className="text-lg font-semibold mb-1">Bridge</h3>
                <p className="text-gray-500">Unlocking seamless job page creation.</p>
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
    </>
    )
}

export default Footer