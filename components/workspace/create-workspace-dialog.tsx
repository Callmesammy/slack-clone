"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useLayoutStore } from "@/hooks/use-layout-store";
import { useWorkspaceStore } from "@/hooks/use-workspace-store";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(3, "Workspace name must be at least 3 characters")
    .max(30, "Workspace name must be less than 30 characters"),
  description: z.string().max(120, "Description must be under 120 characters").optional(),
});

type CreateWorkspaceValues = z.infer<typeof createWorkspaceSchema>;

const COLOR_OPTIONS = [
  { label: "Slack Forest", class: "from-[#0F2A1D] to-[#375534]", bg: "bg-gradient-to-tr from-[#0F2A1D] to-[#375534]" },
  { label: "Rose Flare", class: "from-rose-500 to-orange-500", bg: "bg-gradient-to-tr from-rose-500 to-orange-500" },
  { label: "Forest Depth", class: "from-emerald-500 to-teal-500", bg: "bg-gradient-to-tr from-emerald-500 to-teal-500" },
  { label: "Sunny Glow", class: "from-amber-400 to-rose-500", bg: "bg-gradient-to-tr from-amber-400 to-rose-500" },
];

export function CreateWorkspaceDialog() {
  const router = useRouter();
  const { activeModal, setActiveModal } = useLayoutStore();
  const { addWorkspace } = useWorkspaceStore();
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);

  const isOpen = activeModal === "create-workspace";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateWorkspaceValues>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleClose = () => {
    reset();
    setSelectedColor(COLOR_OPTIONS[0]);
    setActiveModal(null);
  };

  const onSubmit = async (values: CreateWorkspaceValues) => {
    try {
      const generatedId = values.name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const initialLetter = values.name.charAt(0).toUpperCase();

      addWorkspace({
        id: generatedId,
        name: values.name,
        initial: initialLetter,
        color: selectedColor.class,
      });

      toast.success(`Created workspace: ${values.name}`);
      handleClose();
      router.push(`/workspace/${generatedId}`);
    } catch {
      toast.error("Failed to create workspace. Try another name.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md select-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create a Workspace</DialogTitle>
          <DialogDescription>
            Workspaces host channels and DMs. Invite your teammates to start coding!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Workspace Name */}
          <div className="space-y-1">
            <Label htmlFor="workspace-name" className="text-sm font-semibold">
              Workspace Name
            </Label>
            <Input
              id="workspace-name"
              placeholder="e.g. Next Devs, marketing-corp"
              className="border-border bg-background text-foreground focus-visible:ring-primary focus-visible:border-primary"
              {...register("name")}
            />
            {errors.name && <p className="text-xs text-rose-500 mt-0.5">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="workspace-desc" className="text-sm font-semibold">
              Description (Optional)
            </Label>
            <Textarea
              id="workspace-desc"
              placeholder="Brief summary of projects, topics discussed..."
              className="border-border bg-background text-foreground min-h-[60px] max-h-[120px] focus-visible:ring-primary focus-visible:border-primary"
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-rose-500 mt-0.5">{errors.description.message}</p>}
          </div>

          {/* Color Gradient Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Workspace Accent Theme</Label>
            <div className="grid grid-cols-4 gap-2.5">
              {COLOR_OPTIONS.map((option) => {
                const isSelected = option.class === selectedColor.class;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setSelectedColor(option)}
                    className={cn(
                      "flex h-12 w-full items-center justify-center rounded-lg border cursor-pointer hover:scale-105 transition-all",
                      isSelected ? "border-primary ring-2 ring-primary/45" : "border-border"
                    )}
                  >
                    <div className={cn("h-8 w-8 rounded-md shadow-inner", option.bg)} />
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-muted-foreground italic mt-1">Preview accent: {selectedColor.label}</p>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold"
            >
              {isSubmitting ? "Creating..." : "Create Workspace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
