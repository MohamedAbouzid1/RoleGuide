'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCVStore } from '@/lib/store';
import { CVForm } from '@/components/builder/CVForm';
import { CVPreview } from '@/components/builder/CVPreview';
import { Toolbar } from '@/components/builder/Toolbar';
import { useToast } from '@/components/ui/use-toast';
import { CV, Evaluation } from '@/lib/types';

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
            const response = await fetch(`/api/drafts/${(params as any).id}`);
            if (!response.ok) throw new Error('Draft not found');
            
            const draft = await response.json();
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
        const url = (params as any).id === 'new' ? '/api/drafts' : `/api/drafts/${(params as any).id}`;
        const method = (params as any).id === 'new' ? 'POST' : 'PUT';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
            data: cv,
            title: cv.personal.fullName || 'Mein Lebenslauf'
            }),
        });
    
        if (!response.ok) throw new Error('Speichern fehlgeschlagen');
        
        const draft = await response.json();
        
        if ((params as any).id === 'new') {
            router.replace(`/builder/${draft.id}`);
        }
        
        if (!isAutosave) {
            // Also create a snapshot for manual saves
            await fetch(`/api/drafts/${draft.id}/snapshot`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: cv }),
            });
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
            await fetch(`/api/drafts/${(params as any).id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                lastEvaluation: result,
                overallScore: result.overallScore,
                atsScore: result.atsScore,
            }),
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
        const response = await fetch('/api/export/pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cv),
        });
    
        if (!response.ok) throw new Error('Export fehlgeschlagen');
        
        const blob = await response.blob();
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

