"use client";

import { useEffect, useState } from "react";
import { UploadCloud } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DragDropZoneProps {
  onFileDropped: (files: FileList) => void;
  children: React.ReactNode;
}

export function DragDropZone({ onFileDropped, children }: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      setDragCounter((prev) => prev + 1);
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setDragCounter((prev) => {
        const next = prev - 1;
        if (next === 0) {
          setIsDragging(false);
        }
        return next;
      });
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      setDragCounter(0);

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        onFileDropped(e.dataTransfer.files);
        e.dataTransfer.clearData();
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [onFileDropped]);

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden w-full h-full">
      {children}

      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex flex-col items-center justify-center border-2 border-dashed border-primary bg-primary/10 rounded-xl p-12 text-center max-w-sm pointer-events-none select-none"
            >
              <UploadCloud className="h-12 w-12 text-primary animate-bounce mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">Upload files</h3>
              <p className="text-sm text-slate-400">
                Drop your images, documents, or files here to share them instantly in the conversation.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
