'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-sm font-sans ${className}`}
    >
      <Link
        href="/"
        className="text-ink-400 hover:text-gold-500 transition-colors duration-300 flex items-center gap-1"
      >
        <Home size={14} />
        <span>Home</span>
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={14} className="text-ink-600" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-ink-400 hover:text-gold-500 transition-colors duration-300"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gold-500">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </motion.nav>
  );
}
