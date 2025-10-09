'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCVStore } from '@/lib/store';
import { CVForm } from '@/components/builder/CVForm';
import { CVPreview } from '@/components/builder/CVPreview';
import { Toolbar } from '@/components/builder/Toolbar';
import { useToast } from '@/components/ui/use-toast';
import { CV, Evaluation } from '@/lib/types';
import { draftsApi, pdfApi } from '@/lib/api-client';

export default function BuilderPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [evaluating, setEvaluating] = useState(false);
    const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
    
    const { 
        cv, 
        sectionVisibility, 
        isDirty, 
        updateCV, 
        setDirty, 
        setLastSaved,
        reset 
    } = useCVStore();
    
    // Load draft
    useEffect(() => {
        const loadDraft = async () => {
        try {
            const draft = await draftsApi.getById((params as any).id);
            updateCV(draft.data as CV);
            if (draft.lastEvaluation) {
            setEvaluation(draft.lastEvaluation as Evaluation);
            }
            setDirty(false);
        } catch (error) {
            toast({
            title: 'Fehler',
            description: 'Entwurf konnte nicht geladen werden',
            variant: 'destructive',
            });
            router.push('/dashboard');
        } finally {
            setLoading(false);
        }
        };

        if ((params as any).id !== 'new') {
        loadDraft();
        } else {
        reset();
        setLoading(false);
        }
    }, [(params as any).id]);
    
    // Autosave
    useEffect(() => {
        if (!isDirty || (params as any).id === 'new') return;
    
        const timer = setTimeout(async () => {
        await saveDraft(true);
        }, 10000); // 10 seconds
    
        return () => clearTimeout(timer);
    }, [cv, isDirty]);
    
    const saveDraft = useCallback(async (isAutosave = false) => {
        setSaving(true);
        try {
        const draftData = {
            data: cv,
            title: cv.personal.fullName || 'Mein Lebenslauf'
        };

        let draft;
        if ((params as any).id === 'new') {
            draft = await draftsApi.create(draftData);
            router.replace(`/builder/${draft.id}`);
        } else {
            draft = await draftsApi.update((params as any).id, draftData);
        }

        if (!isAutosave) {
            // Also create a snapshot for manual saves
            await draftsApi.createSnapshot(draft.id, cv);
        }

        setLastSaved(new Date());
        setDirty(false);

        if (!isAutosave) {
            toast({
            title: 'Gespeichert',
            description: 'Ihr Lebenslauf wurde erfolgreich gespeichert',
            });
        }
        } catch (error) {
        toast({
            title: 'Fehler',
            description: 'Speichern fehlgeschlagen',
            variant: 'destructive',
        });
        } finally {
        setSaving(false);
        }
    }, [cv, (params as any).id, router, setDirty, setLastSaved, toast]);
    
    const handleEvaluate = async () => {
        setEvaluating(true);
        try {
        // Note: /api/evaluate endpoint needs to be added to backend server
        const response = await fetch('/api/evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cv),
        });

        if (!response.ok) throw new Error('Bewertung fehlgeschlagen');

        const result = await response.json();
        setEvaluation(result);

        // Save evaluation to draft
        if ((params as any).id !== 'new') {
            await draftsApi.patch((params as any).id, {
                lastEvaluation: result,
                overallScore: result.overallScore,
                atsScore: result.atsScore,
            });
        }

        toast({
            title: 'Bewertung abgeschlossen',
            description: `Gesamtpunktzahl: ${result.overallScore}/100`,
        });
        } catch (error) {
        toast({
            title: 'Fehler',
            description: 'Bewertung fehlgeschlagen',
            variant: 'destructive',
        });
        } finally {
        setEvaluating(false);
        }
    };
    
    const handleExport = async () => {
        try {
        const blob = await pdfApi.export(cv);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cv.personal.fullName || 'Lebenslauf'}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);

        toast({
            title: 'Exportiert',
            description: 'Ihr Lebenslauf wurde als PDF heruntergeladen',
        });
        } catch (error) {
        toast({
            title: 'Fehler',
            description: 'Export fehlgeschlagen',
            variant: 'destructive',
        });
        }
    };
    
    if (loading) {
        return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-lg">Laden...</div>
        </div>
        );
    }
    
    return (
        <div className="flex h-screen flex-col">
        <Toolbar
            onSave={() => saveDraft(false)}
            onEvaluate={handleEvaluate}
            onExport={handleExport}
            saving={saving}
            evaluating={evaluating}
            isDirty={isDirty}
            evaluation={evaluation}
        />
        
        <div className="flex flex-1 overflow-hidden">
            <div className="w-1/2 overflow-y-auto border-r p-6">
            <CVForm evaluation={evaluation} />
            </div>
            <div className="w-1/2 overflow-y-auto bg-gray-50 p-6">
            <CVPreview cv={cv} sectionVisibility={sectionVisibility} />
            </div>
        </div>
        </div>
    );
}

