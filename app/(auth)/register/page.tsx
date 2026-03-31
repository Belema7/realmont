"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Mail, Lock, User, Shield, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { BrandLogo } from "@/components/shared/BrandLogo";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["buyer", "agent"]),
});

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<"buyer" | "agent">("buyer");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            role,
        };

        const validated = registerSchema.safeParse(data);
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
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(validated.data),
            });

            const result = await res.json();

            if (!result.success) {
                toast.error(result.error);
                return;
            }

            // Auto-login after registration
            const signInResult = await signIn("credentials", {
                email: validated.data.email,
                password: validated.data.password,
                redirect: false,
            });

            if (signInResult?.error) {
                toast.error("Registration successful, but auto-login failed. Please log in manually.");
                router.push("/login");
            } else {
                toast.success("Welcome to EstateHub!");
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

            <Card className="w-full max-w-xl border-border bg-card/80 backdrop-blur-2xl shadow-2xl rounded-[40px] p-2 relative z-10">
                <CardHeader className="text-center pt-8 pb-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20 mb-6 group transition-transform hover:scale-110">
                        <BrandLogo size={32} className="h-8 w-8 brightness-0 invert" />
                    </div>
                    <CardTitle className="text-3xl font-heading font-black tracking-tight">Create Partnership</CardTitle>
                    <CardDescription className="text-sm font-medium pt-1">
                        Join the world&apos;s most elite real estate network
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-8 pb-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Legal Name</Label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Alexander Hamilton"
                                        className="pl-12 h-14 rounded-2xl border-border bg-muted/30 focus-visible:ring-primary/20 transition-all"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-xs font-bold text-destructive ml-1">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Corporate Email</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="alex@estatehub.com"
                                        className="pl-12 h-14 rounded-2xl border-border bg-muted/30 focus-visible:ring-primary/20 transition-all"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs font-bold text-destructive ml-1">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="password" title="Secure Key" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Secure Key</Label>
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

                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Account Role</Label>
                                <Select
                                    value={role}
                                    onValueChange={(v) => setRole(v as "buyer" | "agent")}
                                >
                                    <SelectTrigger className="h-14 rounded-2xl border-border bg-muted/30 focus:ring-primary/20 transition-all">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-border shadow-xl">
                                        <SelectItem value="buyer">
                                            <span className="flex items-center gap-3 font-bold">
                                                <User className="h-4 w-4 text-primary" />
                                                Client Portfolio
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="agent">
                                            <span className="flex items-center gap-3 font-bold">
                                                <Shield className="h-4 w-4 text-primary" />
                                                Certified Director
                                            </span>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                {loading ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Register Credentials
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border/60 text-center">
                        <p className="text-sm font-medium text-muted-foreground">
                            Already verified?{" "}
                            <Link
                                href="/login"
                                className="font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-widest text-[11px]"
                            >
                                Executive Login
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
