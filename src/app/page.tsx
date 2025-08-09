import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Pipeline Board</h1>
      <div className="flex space-x-4">
        <div className="w-64 rounded-lg bg-gray-100 p-4">
          <h2 className="text-lg font-bold">Validate</h2>
          <div className="mt-4 space-y-2">
            <div className="rounded-md bg-white p-2">ICP defined</div>
          </div>
        </div>
        <div className="w-64 rounded-lg bg-gray-100 p-4">
          <h2 className="text-lg font-bold">Plan</h2>
          <div className="mt-4 space-y-2">
            <div className="rounded-md bg-white p-2">Offer & price</div>
          </div>
        </div>
        <div className="w-64 rounded-lg bg-gray-100 p-4">
          <h2 className="text-lg font-bold">Launch</h2>
          <div className="mt-4 space-y-2">
            <div className="rounded-md bg-white p-2">Proposal sent</div>
          </div>
        </div>
        <div className="w-64 rounded-lg bg-gray-100 p-4">
          <h2 className="text-lg font-bold">Run</h2>
          <div className="mt-4 space-y-2">
            <div className="rounded-md bg-white p-2">Invoice paid</div>
          </div>
        </div>
      </div>
      <Button>Evaluate</Button>
    </main>
  );
}