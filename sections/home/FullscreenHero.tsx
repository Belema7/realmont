import React from 'react';
import Link from 'next/link';
import styles from './FullscreenHero.module.css';

interface FullscreenHeroProps {
    headline?: string;
    description?: string;
    primaryCtaLabel?: string;
    secondaryCtaLabel?: string;
    primaryCtaHref?: string;
    secondaryCtaHref?: string;
    trustText?: string;
}

export const FullscreenHero: React.FC<FullscreenHeroProps> = ({
    headline = "Discover Your Dream Home, Empower Your Journey.",
    description = "Connect with verified agents and browse thousands of premium properties. Whether you're buying your first home or selling your current one, we make the process transparent and seamless.",
    primaryCtaLabel = "Buy a Property",
    secondaryCtaLabel = "List Your Property",
    primaryCtaHref = "/properties",
    secondaryCtaHref = "/register",
    trustText = "Over 10,000+ Premium Listings | 24/7 Expert Support | Verified Agents Only"
}) => {
    return (
        <section className={styles.hero} id="hero-section">
            <div className={styles.overlay} />

            <div className={styles.content}>
                <div className={styles.trustBadge}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>{trustText}</span>
                </div>

                <h1 className={styles.headline}>
                    {headline}
                </h1>

                <p className={styles.description}>
                    {description}
                </p>

                <div className={styles.ctaContainer}>
                    <Link href={primaryCtaHref}>
                        <button className={styles.primaryButton}>
                            {primaryCtaLabel}
                        </button>
                    </Link>

                    <Link href={secondaryCtaHref}>
                        <button className={styles.secondaryButton}>
                            {secondaryCtaLabel}
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};
