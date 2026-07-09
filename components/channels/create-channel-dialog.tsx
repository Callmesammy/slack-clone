"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useParams } from "next/navigation";
import { useLayoutStore } from "@/hooks/use-layout-store";
import { useWorkspaceStore } from "@/hooks/use-workspace-store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const createChannelSchema = z.object({
  name: z.string()
    .min(3, "Channel name must be at least 3 characters")
    .max(80, "Channel name cannot exceed 80 characters")
    .regex(/^[a-z0-9-_]+$/, "Only lowercase letters, numbers, hyphens, and underscores are allowed"),
  description: z.string().max(250, "Description cannot exceed 250 characters").optional(),
  isPrivate: z.boolean(),
});

type CreateChannelFormValues = z.infer<typeof createChannelSchema>;

export function CreateChannelDialog() {
  const router = useRouter();
  const params = useParams();
  const { activeModal, setActiveModal } = useLayoutStore();
  const { addChannel } = useWorkspaceStore();

  const isOpen = activeModal === "create-channel";
  const activeWorkspaceId = params?.workspaceId as string || "default";

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateChannelFormValues>({
    resolver: zodResolver(createChannelSchema),
    defaultValues: {
      name: "",
      description: "",
      isPrivate: false,
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = e.target.value
      .toLowerCase()
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .replace(/[^a-z0-9-_]/g, ""); // remove invalid characters
    setValue("name", cleanedValue, { shouldValidate: true });
  };

  const handleClose = () => {
    reset();
    setActiveModal(null);
  };

  const onSubmit = (values: CreateChannelFormValues) => {
    addChannel({
      id: values.name,
      name: values.name,
      isPrivate: values.isPrivate,
      description: values.description,
    });
    
    toast.success(`Channel #${values.name} created successfully!`);
    handleClose();
    router.push(`/workspace/${activeWorkspaceId}/channel/${values.name}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create a channel</DialogTitle>
          <DialogDescription>
            Channels are where your team communicates. They’re best when organized around a topic — like #marketing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Channel Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">
              Name
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground/60 font-semibold select-none">#</span>
              <Input
                id="name"
                placeholder="e.g. plan-launch"
                className="pl-7 border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary focus-visible:border-primary/50"
                {...register("name")}
                onChange={handleNameChange}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-rose-500 font-medium mt-0.5">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Channel Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">
              Description <span className="text-muted-foreground/60 text-xs">(optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="What is this channel about?"
              className="border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary focus-visible:border-primary/50 min-h-[80px]"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-rose-500 font-medium mt-0.5">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Channel Private/Public switch */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-4 mt-2">
            <div className="space-y-0.5 pr-2">
              <Label className="text-sm font-semibold">Make private</Label>
              <p className="text-xs text-muted-foreground">
                When a channel is private, it can only be viewed or joined by invitation.
              </p>
            </div>
            <Controller
              name="isPrivate"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
