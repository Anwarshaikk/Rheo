'use client';

import { useState } from "react";
import { RheoButton } from "@/components/rheo/RheoButton";
import { RheoCard } from "@/components/rheo/RheoCard";
import { DeliverableFactory } from "@/components/rheo/DeliverableFactory";
import { EvidenceDrawer } from "@/components/rheo/EvidenceDrawer";
import { withAuth } from "@/components/rheo/withAuth";
import { GateChip } from "@/components/rheo/GateChip";
import { toast } from "sonner";
import { motion } from "framer-motion";

function Home() {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [hasNewEvidence, setHasNewEvidence] = useState(true); // Mock state

  const handleEvaluateGates = async () => {
    setIsEvaluating(true);
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
    } finally {
      setIsEvaluating(false);
    }
  };

  const stages = [
    { name: "Validate", gates: [{ label: "ICP defined", passed: true }] },
    { name: "Plan", gates: [{ label: "Offer & price", passed: true }] },
    { name: "Launch", gates: [{ label: "Proposal sent", passed: false }] },
    { name: "Run", gates: [{ label: "Invoice paid", passed: false }] },
  ];

  return (
    <main className="rheo-hero min-h-screen p-8">
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <h1 className="text-4xl font-semibold tracking-tight text-rheo-text mb-6">Pipeline Board</h1>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* Left: Stages */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stages.map((stage, index) => (
              <motion.div
                key={stage.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1], delay: index * 0.05 }}
              >
                <RheoCard title={stage.name}>
                  <div className="space-y-2">
                    {stage.gates.map((gate) => (
                      <GateChip key={gate.label} label={gate.label} passed={gate.passed} />
                    ))}
                  </div>
                </RheoCard>
              </motion.div>
            ))}
          </div>
          {/* Right: Factory + Evidence */}
          <aside className="space-y-4">
            <div className="rheo-glass rounded-lg p-4">
              <DeliverableFactory />
            </div>
            <div className="rheo-glass rounded-lg p-4">
              <EvidenceDrawer />
            </div>
          </aside>
        </div>
        <div className="mt-8 flex justify-center">
          <RheoButton onClick={handleEvaluateGates} disabled={!hasNewEvidence || isEvaluating}>
            {isEvaluating ? "Evaluating..." : "Evaluate Gates"}
          </RheoButton>
        </div>
      </div>
    </main>
  );
}

export default withAuth(Home);

