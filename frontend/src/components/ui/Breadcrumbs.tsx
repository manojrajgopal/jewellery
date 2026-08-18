'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({
  items,
  className = '',
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      aria-label="Breadcrumb"
      className={`flex flex-wrap items-center gap-2 font-sans text-sm ${className}`}
    >
      <Link
        href="/"
        className="link-underline flex items-center gap-1.5 text-muted transition-colors duration-300 hover:text-accent"
      >
        <Home size={13} strokeWidth={1.8} />
        <span>Home</span>
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          <ChevronRight size={13} className="text-faint" aria-hidden="true" />
          {item.href ? (
            <Link
              href={item.href}
              className="link-underline text-muted transition-colors duration-300 hover:text-accent"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-accent" aria-current="page">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </motion.nav>
  );
}
