"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Camera } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterSocial {
  label: string;
  href: string;
  icon: "facebook" | "twitter" | "instagram" | "linkedin";
}

const defaultColumns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "Integrations", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Partners", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "Community", href: "#" },
    ],
  },
];

const defaultLegalLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Community Guidelines", href: "#" },
];

const defaultSocials: FooterSocial[] = [
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "Twitter", href: "#", icon: "twitter" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
  { label: "Facebook", href: "#", icon: "facebook" },
];

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const wordmarkVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", duration: 1.1, bounce: 0 },
  },
};

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", duration: 0.65, bounce: 0 },
  },
};

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.045 },
  },
};

const linkVariants: Variants = {
  hidden: { opacity: 0, y: 7 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", duration: 0.42, bounce: 0 },
  },
};

const socialIcons = {
  facebook: FaFacebookF,
  twitter: FaXTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
};

export default function FooterLanding({
  brandName = "INSTANTS",
  tagline = "Designing the future of web applications,\none component at a time.",
  columns = defaultColumns,
  legalLinks = defaultLegalLinks,
  socials = defaultSocials,
  copyright = "© 2026 Instants App. All rights reserved.",
  backgroundImage = "https://assets.watermelon.sh/footer-16-bg.avif",
}) {
  return (
    <footer className="relative w-full overflow-hidden font-sans text-zinc-100 antialiased border-t border-white/5">

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10 mx-auto flex min-h-[580px] flex-col justify-end pt-16 sm:min-h-[640px] lg:min-h-[740px]"
      >


        {/* Content Container */}
        <div className="relative z-10 px-6 pt-10 pb-8 sm:px-12 sm:pt-12 sm:pb-10 lg:pt-14">
          <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-[minmax(220px,1.2fr)_minmax(500px,1fr)] lg:gap-x-20">
            <motion.div variants={riseVariants} className="max-w-xl">
              <Link className="group inline-flex items-center gap-2.5 text-white transition-opacity hover:opacity-80" href="/feed">
                <span className="text-xl font-bold tracking-tight font-sans">Instants</span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400 whitespace-pre-line">
                {tagline}
              </p>
            </motion.div>

            <motion.nav
              variants={sectionVariants}
              className="grid grid-cols-2 gap-8 sm:grid-cols-3"
            >
              {columns.map((column) => (
                <motion.div variants={riseVariants} key={column.title}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                    {column.title}
                  </h3>
                  <motion.ul variants={listVariants} className="mt-4 space-y-2.5">
                    {column.links.map((link) => (
                      <motion.li variants={linkVariants} key={link.label}>
                        <Link className="text-sm text-zinc-400 transition-colors hover:text-white" href={link.href}>
                          {link.label}
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              ))}
            </motion.nav>
          </div>

          <motion.div
            variants={riseVariants}
            className="mx-auto max-w-7xl mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-xs text-zinc-500">{copyright}</p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <motion.ul variants={listVariants} className="flex items-center gap-3">
                {socials.map((social) => {
                  const Icon = socialIcons[social.icon];
                  return (
                    <motion.li variants={linkVariants} key={social.label}>
                      <a
                        href={social.href}
                        aria-label={social.label}
                        className="flex size-8 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-zinc-400 transition-all hover:border-white/20 hover:text-white"
                      >
                        <Icon className="size-3.5"/>
                      </a>
                    </motion.li>
                  );
                })}
              </motion.ul>

              <motion.ul variants={listVariants} className="flex items-center gap-4">
                {legalLinks.map((link) => (
                  <motion.li variants={linkVariants} key={link.label}>
                    <Link className="text-xs text-zinc-500 hover:text-zinc-300" href={link.href}>
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
}
