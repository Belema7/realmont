"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import type { PropertyFormData } from "@/types";

const propertySchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(200),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(5000),
    price: z.number().positive("Price must be a positive number"),
    location: z.string().min(2, "Location is required"),
    images: z.array(z.string()).default([]),
    propertyType: z.enum(["house", "apartment", "land"]),
    bedrooms: z.number().int().min(0, "Must be 0 or more"),
    bathrooms: z.number().int().min(0, "Must be 0 or more"),
    area: z.number().positive("Area must be positive"),
});

interface PropertyFormProps {
    initialData?: Partial<PropertyFormData>;
    onSubmit: (data: PropertyFormData) => Promise<void>;
    isSubmitting?: boolean;
    submitLabel?: string;
}

export function PropertyForm({
    initialData,
    onSubmit,
    isSubmitting = false,
    submitLabel = "Create Property",
}: PropertyFormProps) {
    const router = useRouter();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [uploadingImages, setUploadingImages] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        price: initialData?.price || 0,
        location: initialData?.location || "",
        propertyType: initialData?.propertyType || "house" as const,
        bedrooms: initialData?.bedrooms || 0,
        bathrooms: initialData?.bathrooms || 0,
        area: initialData?.area || 0,
    });

    const handleChange = useCallback(
        (field: string, value: string | number) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
            setErrors((prev) => ({ ...prev, [field]: "" }));
        },
        []
    );

    const handleImageUpload = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            setUploadingImages(true);

            try {
                const base64Images: string[] = [];

                for (const file of Array.from(files)) {
                    if (file.size > 5 * 1024 * 1024) {
                        toast.error(`${file.name} is too large. Max 5MB per image.`);
                        continue;
                    }

                    const reader = new FileReader();
                    const base64 = await new Promise<string>((resolve) => {
                        reader.onload = () => resolve(reader.result as string);
                        reader.readAsDataURL(file);
                    });
                    base64Images.push(base64);
                }

                if (base64Images.length === 0) return;

                const res = await fetch("/api/upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ images: base64Images }),
                });

                if (res.ok) {
                    const { data: urls } = await res.json();
                    setImages((prev) => [...prev, ...urls]);
                    toast.success(`${urls.length} image(s) uploaded`);
                } else {
                    setImages((prev) => [...prev, ...base64Images]);
                    toast.success(`${base64Images.length} image(s) added`);
                }
            } catch {
                toast.error("Failed to upload images");
            } finally {
                setUploadingImages(false);
            }
        },
        []
    );

    const removeImage = useCallback((index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data: PropertyFormData = {
            ...formData,
            images,
        };

        const validated = propertySchema.safeParse(data);

        if (!validated.success) {
            const fieldErrors: Record<string, string> = {};
            validated.error.issues.forEach((err) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0] as string] = err.message;
                }
            });
            setErrors(fieldErrors);
            toast.error("Please fix the form errors");
            return;
        }

        await onSubmit(validated.data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Basic info */}
                <Card className="rounded-2xl border-border bg-card shadow-sm transition-shadow hover:shadow-md">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-heading font-bold flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                            Basic Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-semibold text-muted-foreground">Title</Label>
                            <Input
                                id="title"
                                placeholder="Beautiful 3-bedroom home..."
                                value={formData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                className="rounded-xl h-11 border-border focus-visible:ring-primary/20"
                            />
                            {errors.title && (
                                <p className="text-xs font-semibold text-destructive">{errors.title}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-semibold text-muted-foreground">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the property in detail..."
                                rows={6}
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                className="rounded-xl border-border focus-visible:ring-primary/20 resize-none"
                            />
                            {errors.description && (
                                <p className="text-xs font-semibold text-destructive">{errors.description}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-sm font-semibold text-muted-foreground">Price ($)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="250,000"
                                    value={formData.price || ""}
                                    onChange={(e) =>
                                        handleChange("price", Number(e.target.value))
                                    }
                                    className="rounded-xl h-11 border-border focus-visible:ring-primary/20 font-mono"
                                />
                                {errors.price && (
                                    <p className="text-xs font-semibold text-destructive">{errors.price}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-sm font-semibold text-muted-foreground">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="New York, NY"
                                    value={formData.location}
                                    onChange={(e) => handleChange("location", e.target.value)}
                                    className="rounded-xl h-11 border-border focus-visible:ring-primary/20"
                                />
                                {errors.location && (
                                    <p className="text-xs font-semibold text-destructive">{errors.location}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Property details */}
                <Card className="rounded-2xl border-border bg-card shadow-sm transition-shadow hover:shadow-md">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-heading font-bold flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
                            Property Assets
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-muted-foreground">Property Type</Label>
                            <Select
                                value={formData.propertyType}
                                onValueChange={(v) => {
                                    if (v) handleChange("propertyType", v);
                                }}
                            >
                                <SelectTrigger className="rounded-xl h-11 border-border focus:ring-primary/20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="house">🏠 House</SelectItem>
                                    <SelectItem value="apartment">🏢 Apartment</SelectItem>
                                    <SelectItem value="land">🌍 Land</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="bedrooms" className="text-sm font-semibold text-muted-foreground">Beds</Label>
                                <Input
                                    id="bedrooms"
                                    type="number"
                                    min={0}
                                    value={formData.bedrooms}
                                    onChange={(e) =>
                                        handleChange("bedrooms", Number(e.target.value))
                                    }
                                    className="rounded-xl h-11 border-border focus-visible:ring-primary/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bathrooms" className="text-sm font-semibold text-muted-foreground">Baths</Label>
                                <Input
                                    id="bathrooms"
                                    type="number"
                                    min={0}
                                    value={formData.bathrooms}
                                    onChange={(e) =>
                                        handleChange("bathrooms", Number(e.target.value))
                                    }
                                    className="rounded-xl h-11 border-border focus-visible:ring-primary/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="area" className="text-sm font-semibold text-muted-foreground">Area (sqft)</Label>
                                <Input
                                    id="area"
                                    type="number"
                                    min={0}
                                    value={formData.area || ""}
                                    onChange={(e) =>
                                        handleChange("area", Number(e.target.value))
                                    }
                                    className="rounded-xl h-11 border-border focus-visible:ring-primary/20"
                                />
                            </div>
                        </div>

                        {/* Images */}
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-muted-foreground">Gallery</Label>
                            <div className="grid grid-cols-3 gap-3">
                                {images.map((img, i) => (
                                    <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-border group">
                                        <Image
                                            src={img}
                                            alt={`Property image ${i + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute top-1.5 right-1.5 rounded-full bg-destructive p-1.5 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}

                                <label className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageUpload}
                                        disabled={uploadingImages}
                                    />
                                    {uploadingImages ? (
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    ) : (
                                        <>
                                            <ImagePlus className="h-6 w-6 text-muted-foreground mb-1" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                Upload
                                            </span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pb-12">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    className="rounded-xl px-6"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl px-8 h-12 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95 min-w-[160px]"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        submitLabel
                    )}
                </Button>
            </div>
        </form>
    );
}
