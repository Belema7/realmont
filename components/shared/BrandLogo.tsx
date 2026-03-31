import Image from "next/image";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
    className?: string;
    size?: number;
    alt?: string;
    priority?: boolean;
};

export function BrandLogo({
    className,
    size = 24,
    alt = "EstateHub logo",
    priority = false,
}: BrandLogoProps) {
    return (
        <Image
            src="/icons/real-estate.svg"
            alt={alt}
            width={size}
            height={size}
            priority={priority}
            className={cn("shrink-0", className)}
        />
    );
}

