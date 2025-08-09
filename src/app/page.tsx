'use client';

import { useState, useEffect, useCallback } from "react";
import { RheoButton } from "@/components/rheo/RheoButton";
import { RheoCard } from "@/components/rheo/RheoCard";
import { DeliverableFactory } from "@/components/rheo/DeliverableFactory";
import { EvidenceDrawer } from "@/components/rheo/EvidenceDrawer";
import { withAuth } from "@/components/rheo/withAuth";
import { GateChip } from "@/components/rheo/GateChip";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Define types for our data
interface Project { id: string; name: string; [key: string]: any; }
interface Stage { id: string; name: string; projectId: string; [key: string]: any; }
interface Gate { id: string; name: string; passed: boolean; stageId: string; [key: string]: any; }

function Home() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);
  const [gates, setGates] = useState<Gate[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const fetchProjectData = useCallback(async (projectId: string) => {
    if (!user) return;

    const stagesQuery = query(collection(db, "stages"), where("projectId", "==", projectId));
    const gatesQuery = query(collection(db, "gates"), where("projectId", "==", projectId));

    const stagesUnsub = onSnapshot(stagesQuery, (snapshot) => {
      const stagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Stage));
      setStages(stagesData);
    });

    const gatesUnsub = onSnapshot(gatesQuery, (snapshot) => {
      const gatesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Gate));
      setGates(gatesData);
    });

    return () => {
      stagesUnsub();
      gatesUnsub();
    };
  }, [user]);

  useEffect(() => {
    if (user && !currentProject) {
      const projectsQuery = query(collection(db, "projects"), where("createdBy", "==", user.uid));
      getDocs(projectsQuery).then(snapshot => {
        const userProjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        setProjects(userProjects);
        if (userProjects.length > 0) {
          setCurrentProject(userProjects[0]);
        }
      });
    }
  }, [user, currentProject]);

  useEffect(() => {
    if (currentProject) {
      const unsubscribe = fetchProjectData(currentProject.id);
      return () => {
        unsubscribe?.then(u => u && u());
      };
    }
  }, [currentProject, fetchProjectData]);

  const handleEvaluateGates = async () => {
    if (!currentProject) return;
    setIsEvaluating(true);
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: currentProject.id, orgId: currentProject.orgId, userId: user?.uid }),
      });
      if (!response.ok) throw new Error('Failed to evaluate gates');
      const result = await response.json();
      toast.success(`Evaluation Complete: ${result.passedGates} gates passed!`);
    } catch (error) {
      toast.error("Failed to evaluate gates.");
    } finally {
      setIsEvaluating(false);
    }
  };
  
  // A simple component to create a project if none exist
  const CreateFirstProject = () => (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4">No projects found.</h2>
      <RheoButton onClick={async () => {
        const name = prompt("Enter project name:");
        if (name && user) {
          const idToken = await user.getIdToken();
          await fetch('/api/projects', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ name, orgId: 'org_placeholder', vertical: 'b2b-agency' }),
          });
          // Refetch projects
          setCurrentProject(null); // This will trigger the useEffect to refetch
        }
      }}>Create Your First Project</RheoButton>
    </div>
  );

  return (
    <main className="rheo-hero min-h-screen p-8">
      <div className="mx-auto w-full max-w-[1400px] px-6">
        <h1 className="text-4xl font-semibold tracking-tight text-rheo-text mb-6">
          {currentProject ? currentProject.name : "Pipeline Board"}
        </h1>
        {!currentProject ? (
          <CreateFirstProject />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {stages.map((stage, index) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1], delay: index * 0.05 }}
                >
                  <RheoCard title={stage.name}>
                    <div className="space-y-2">
                      {gates.filter(g => g.stageId === stage.id).map(gate => (
                        <GateChip key={gate.id} label={gate.name} passed={gate.passed} />
                      ))}
                    </div>
                  </RheoCard>
                </motion.div>
              ))}
            </div>
            <aside className="space-y-4">
              <div className="rheo-glass rounded-lg p-4">
                <DeliverableFactory />
              </div>
              <div className="rheo-glass rounded-lg p-4">
                <EvidenceDrawer />
              </div>
            </aside>
          </div>
        )}
        {currentProject && (
          <div className="mt-8 flex justify-center">
            <RheoButton onClick={handleEvaluateGates} disabled={isEvaluating}>
              {isEvaluating ? "Evaluating..." : "Evaluate Gates"}
            </RheoButton>
          </div>
        )}
      </div>
    </main>
  );
}

export default withAuth(Home);

