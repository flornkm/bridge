function CookieBanner({ data }) {
  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-10 py-4 bg-white ring-1 ring-neutral-200 rounded-2xl max-w-[80%] w-full shadow-lg">
      <input value={data.content[0].content[0].text} />
    </div>
  );
}

export default CookieBanner;
