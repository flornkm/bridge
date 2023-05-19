export default function Custom404() {
    return <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-t from-violet-100 to-violet-50 flex-col gap-12">
        <h1 className="text-2xl font-medium flex gap-4 text-violet-500 items-center"><span className="text-5xl font-semibold">404</span> <span className="text-violet-200">|</span> Page Not Found</h1>
        <button onClick={() => {
            window.location.href = "/"
        }} className="font-medium px-4 py-2 bg-violet-500 text-white rounded-lg transition-all hover:bg-violet-600 shadow-lg flex gap-3 items-center group">
            Back to home
        </button>
    </div>;
}
