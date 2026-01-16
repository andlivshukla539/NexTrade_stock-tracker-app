import Link from "next/link";

export default async function NewAlertPage({ searchParams }: { searchParams?: Promise<{ symbol?: string }> }) {
  // In Next.js app router, searchParams can be passed from the framework.
  // We keep it optional here to avoid strict typing issues.
  const sp = (await searchParams) ?? {};
  const symbol = (sp.symbol || "").toString().toUpperCase();

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-100">Create Price Alert</h1>
        <Link href={symbol ? `/stocks/${symbol}` : "/"} className="text-sm text-gray-400 hover:text-yellow-500 transition-colors">
          {symbol ? `Back to ${symbol}` : "Back"}
        </Link>
      </div>

      <div className="alert-dialog rounded-md border border-gray-700 p-6 bg-[#0f0f0f]">
        <p className="text-gray-400 mb-4">
          This is a minimal placeholder for creating alerts. Choose a symbol and your desired threshold,
          and we’ll notify you when conditions are met.
        </p>

        <div className="grid gap-4 max-w-md">
          <label className="flex flex-col gap-2">
            <span className="text-gray-300">Symbol</span>
            <input
              className="px-3 py-2 rounded-md bg-[#1a1a1a] border border-gray-700 text-gray-100"
              defaultValue={symbol}
              placeholder="e.g. AAPL"
              readOnly
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-gray-300">Direction</span>
            <select className="px-3 py-2 rounded-md bg-[#1a1a1a] border border-gray-700 text-gray-100">
              <option value="upper">Price above (&gt;)</option>
              <option value="lower">Price below (&lt;)</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-gray-300">Threshold</span>
            <input
              type="number"
              className="px-3 py-2 rounded-md bg-[#1a1a1a] border border-gray-700 text-gray-100"
              placeholder="e.g. 200"
            />
          </label>

          <button className="add-alert px-4 py-2 rounded-md bg-yellow-500 text-yellow-900 font-medium hover:opacity-90 transition">
            Save Alert (stub)
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Note: This page is a visual stub to expose the feature in the UI. Hook it up to your alerts backend/actions as needed.
        </p>
      </div>
    </div>
  );
}
