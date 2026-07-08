"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const signUpSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, hyphens, and underscores are allowed"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      displayName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    setIsLoading(true);
    try {
      // In local dev/mock phase, we automatically sign the user in with credentials
      toast.success("Account created! Logging in...");
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Auth session creation failed.");
      } else {
        router.push("/workspace/default");
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="border-slate-800/80 bg-slate-900/60 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Create an account
          </CardTitle>
          <CardDescription className="text-slate-400">
            Join timeslack and start collaborating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="displayName" className="text-slate-200">
                  Full Name
                </Label>
                <Input
                  id="displayName"
                  placeholder="John Doe"
                  className="border-slate-800 bg-slate-950/80 text-white placeholder-slate-500 focus-visible:ring-primary focus-visible:border-primary/50"
                  disabled={isLoading}
                  {...register("displayName")}
                />
                {errors.displayName && (
                  <p className="text-xs text-rose-500 font-medium mt-0.5">
                    {errors.displayName.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username" className="text-slate-200">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="johndoe"
                  className="border-slate-800 bg-slate-950/80 text-white placeholder-slate-500 focus-visible:ring-primary focus-visible:border-primary/50"
                  disabled={isLoading}
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-xs text-rose-500 font-medium mt-0.5">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-slate-200">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="border-slate-800 bg-slate-950/80 text-white placeholder-slate-500 focus-visible:ring-primary focus-visible:border-primary/50"
                disabled={isLoading}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-rose-500 font-medium mt-0.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-slate-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="border-slate-800 bg-slate-950/80 text-white placeholder-slate-500 focus-visible:ring-primary focus-visible:border-primary/50"
                disabled={isLoading}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-rose-500 font-medium mt-0.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword" className="text-slate-200">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="border-slate-800 bg-slate-950/80 text-white placeholder-slate-500 focus-visible:ring-primary focus-visible:border-primary/50"
                disabled={isLoading}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-rose-500 font-medium mt-0.5">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/95 hover:to-primary shadow-lg shadow-primary/20 font-semibold mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-800/80 bg-slate-950/20 py-4">
          <p className="text-xs text-slate-400">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
