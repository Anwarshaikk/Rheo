import { RheoButton } from "@/components/rheo/RheoButton";
import { RheoCard } from "@/components/rheo/RheoCard";
import { DeliverableFactory } from "@/components/rheo/DeliverableFactory";

export default function Home() {
  return (
    <main className="rheo-hero min-h-screen p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-4xl font-bold text-rheo-text">Pipeline Board</h1>
          <div className="w-1/4">
            <DeliverableFactory />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <RheoCard title="Validate">
            <div className="rounded-md bg-white p-2 shadow">ICP defined</div>
          </RheoCard>
          <RheoCard title="Plan">
            <div className="rounded-md bg-white p-2 shadow">Offer & price</div>
          </RheoCard>
          <RheoCard title="Launch">
            <div className="rounded-md bg-white p-2 shadow">Proposal sent</div>
          </RheoCard>
          <RheoCard title="Run">
            <div className="rounded-md bg-white p-2 shadow">Invoice paid</div>
          </RheoCard>
        </div>
        <div className="mt-8 flex justify-center">
          <RheoButton>Evaluate Gates</RheoButton>
        </div>
      </div>
    </main>
  );
}

