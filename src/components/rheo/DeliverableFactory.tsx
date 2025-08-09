'use client';

import { useState } from "react";
import { RheoButton } from "./RheoButton";
import { RheoCard } from "./RheoCard";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function DeliverableFactory() {
  const [clientName, setClientName] = useState('');
  const [yourCompany, setYourCompany] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [docusignLink, setDocusignLink] = useState('');
  const { toast } = useToast();

  const handleCreateProposal = async () => {
    try {
      const response = await fetch('/api/deliverables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientName,
          yourCompany,
          priceRange,
          docusignLink,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create proposal');
      }

      const result = await response.json();
      console.log('Proposal created:', result);
      toast("Proposal Created", {
        description: "The proposal has been successfully created.",
      });
    } catch (error) {
      console.error('Error creating proposal:', error);
      toast("Error", {
        description: "Failed to create the proposal.",
      });
    }
  };

  return (
    <RheoCard title="Deliverable Factory">
      <div className="flex flex-col space-y-4">
        <Input
          placeholder="Client Name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
        <Input
          placeholder="Your Company"
          value={yourCompany}
          onChange={(e) => setYourCompany(e.target.value)}
        />
        <Input
          placeholder="Price Range"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
        />
        <Input
          placeholder="DocuSign Link"
          value={docusignLink}
          onChange={(e) => setDocusignLink(e.target.value)}
        />
        <RheoButton onClick={handleCreateProposal}>
          Create Proposal
        </RheoButton>
      </div>
    </RheoCard>
  );
}

