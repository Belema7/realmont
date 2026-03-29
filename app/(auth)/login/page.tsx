"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        };

        const validated = loginSchema.safeParse(data);
        if (!validated.success) {
            const fieldErrors: Record<string, string> = {};
            validated.error.issues.forEach((err) => {
                if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Welcome back!");
                router.push("/dashboard");
                router.refresh();
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 overflow-hidden">
            {/* Artistic background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-primary)_0%,transparent_40%)] opacity-[0.03]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--color-primary)_0%,transparent_40%)] opacity-[0.02]" />

            <Card className="w-full max-w-md border-border bg-card/80 backdrop-blur-2xl shadow-2xl rounded-[40px] p-2 relative z-10">
                <CardHeader className="text-center pt-8 pb-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20 mb-6 group transition-transform hover:scale-110">
                        <Building2 className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-3xl font-heading font-black tracking-tight">Executive Login</CardTitle>
                    <CardDescription className="text-sm font-medium pt-1">
                        Access your global real estate portfolio
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-8 pb-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Corporate Email</Label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@estatehub.com"
                                    className="pl-12 h-14 rounded-2xl border-border bg-muted/30 focus-visible:ring-primary/20 transition-all"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs font-bold text-destructive ml-1">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <Label htmlFor="password" title="Secure Key" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Secure Key</Label>
                                <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Lost access?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-12 h-14 rounded-2xl border-border bg-muted/30 focus-visible:ring-primary/20 transition-all"
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs font-bold text-destructive ml-1">{errors.password}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Authorize Access
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border/60 text-center">
                        <p className="text-sm font-medium text-muted-foreground">
                            New partner?{" "}
                            <Link
                                href="/register"
                                className="font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-widest text-[11px]"
                            >
                                Apply for account
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
