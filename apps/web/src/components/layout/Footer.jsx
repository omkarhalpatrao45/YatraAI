function Footer() {
  return (
    <footer className="border-t border-zinc-200/60 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} YatraAI. Plan smarter trips with AI.
          </p>
          <p className="text-xs text-zinc-500">Built with React, Tailwind, Router & Axios.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

