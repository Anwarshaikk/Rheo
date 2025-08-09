'use client';

import { useState } from "react";
import { RheoButton } from "./RheoButton";
import { RheoCard } from "./RheoCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function EvidenceDrawer() {
  const [kind, setKind] = useState('');
  const [url, setUrl] = useState('');
  const [note, setNote] = useState('');

  const handleAddEvidence = async () => {
    try {
      // TODO: Implement API call to add evidence
      console.log({ kind, url, note });
      toast("Evidence Added", {
        description: "The evidence has been successfully added.",
      });
    } catch (error) {
      console.error('Error adding evidence:', error);
      toast("Error", {
        description: "Failed to add the evidence.",
      });
    }
  };

  return (
    <RheoCard title="Evidence Locker">
      <div className="flex flex-col space-y-4">
        <Select onValueChange={setKind}>
          <SelectTrigger>
            <SelectValue placeholder="Select evidence type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="note">Note</SelectItem>
            <SelectItem value="invoice_url">Invoice URL</SelectItem>
            <SelectItem value="signed_link">Signed Link</SelectItem>
          </SelectContent>
        </Select>
        {kind === 'invoice_url' || kind === 'signed_link' ? (
          <Input
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        ) : null}
        {kind === 'note' ? (
          <Textarea
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        ) : null}
        <RheoButton onClick={handleAddEvidence}>
          Add Evidence
        </RheoButton>
      </div>
    </RheoCard>
  );
}
