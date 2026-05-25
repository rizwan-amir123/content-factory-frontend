export default function AppFooter() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 mt-auto py-6 sm:py-8 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-400">
        <p>© 2026 Forge.ai Enterprise. All generation pipelines secured.</p>
        <div className="flex gap-4 sm:gap-6">
          <span className="hover:text-gray-900 transition-colors cursor-pointer">Security Ledger</span>
          <span className="hover:text-gray-900 transition-colors cursor-pointer">API Node Status</span>
        </div>
      </div>
    </footer>
  );
}
