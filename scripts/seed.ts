// This script will be used to seed the database with initial data.
// The logic to connect to Firestore and write the data will be added later.

export const seedGates = [
  {
    stageName: 'Validate',
    gate: {
      name: 'ICP defined',
      requiredEvidence: ['note'],
    },
  },
  {
    stageName: 'Plan',
    gate: {
      name: 'Offer & price',
      requiredEvidence: ['note'],
    },
  },
  {
    stageName: 'Launch',
    gate: {
      name: 'Proposal sent',
      requiredEvidence: ['signed_link'],
    },
  },
  {
    stageName: 'Run',
    gate: {
      name: 'Invoice paid',
      requiredEvidence: ['invoice_url'],
    },
  },
];
