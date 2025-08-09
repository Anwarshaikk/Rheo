'use client';

import { RheoButton } from "@/components/rheo/RheoButton";
import { RheoCard } from "@/components/rheo/RheoCard";
import { DeliverableFactory } from "@/components/rheo/DeliverableFactory";
import { EvidenceDrawer } from "@/components/rheo/EvidenceDrawer";
import { withAuth } from "@/components/rheo/withAuth";
import { toast } from "sonner";

function Home() {
  const handleEvaluateGates = async () => {
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId: 'prj_123', stageId: 'stage_123' }), // Placeholder IDs
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate gates');
      }

      const result = await response.json();
      console.log('Gates evaluated:', result);
      toast("Gates Evaluated", {
        description: "The gates have been successfully evaluated.",
      });
    } catch (error) {
      console.error('Error evaluating gates:', error);
      toast("Error", {
        description: "Failed to evaluate the gates.",
      });
    }
  };

  return (
    <main className="rheo-hero min-h-screen p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-4xl font-bold text-rheo-text">Pipeline Board</h1>
          <div className="flex space-x-4 w-1/2">
            <div className="w-1/2">
              <DeliverableFactory />
            </div>
            <div className="w-1/2">
              <EvidenceDrawer />
            </div>
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
          <RheoButton onClick={handleEvaluateGates}>Evaluate Gates</RheoButton>
        </div>
      </div>
    </main>
  );
}

export default withAuth(Home);

