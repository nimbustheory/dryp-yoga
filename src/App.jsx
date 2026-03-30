import { useState, useEffect, useCallback, createContext, useContext, useRef, useMemo } from "react";
import {
  Home, Calendar, TrendingUp, Users, CreditCard, CalendarDays,
  Menu, X, Bell, Settings, Shield, ChevronRight, ChevronDown, Clock,
  ArrowUpRight, ArrowDownRight, Award, DollarSign, LayoutDashboard,
  UserCheck, Megaphone, LogOut, Plus, Send, Check, Search, Info,
  CircleCheck, UserPlus, Heart, Flame, Star, Sun, Moon, Wind, Sparkles,
  MapPin, Zap, Eye, Waves, Droplets
} from "lucide-react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

// ═══════════════════════════════════════════════════════════════
//  STUDIO_CONFIG — DRYP Yoga, South Lake Union, Seattle
// ═══════════════════════════════════════════════════════════════
const STUDIO_CONFIG = {
  name: "DRYP",
  subtitle: "YOGA",
  tagline: "Step into the flow.",
  logoMark: "D✺",
  logoImage: "/images/logo.png",
  description: "Seattle's first immersive yoga studio — where LED visuals meet ancient practice. Transform your mind, body, and soul in South Lake Union.",
  heroLine1: "STEP INTO",
  heroLine2: "THE FLOW",

  address: { street: "900 Lenora St, Suite 128", city: "Seattle", state: "WA", zip: "98121" },
  phone: "(206) 682-9642",
  email: "info@drypyoga.com",
  neighborhood: "South Lake Union, Seattle",
  website: "https://drypyoga.com",
  social: { instagram: "@drypyogaseattle" },

  theme: {
    accent:     { h: 270, s: 65, l: 58 },   // Electric violet
    accentAlt:  { h: 175, s: 70, l: 50 },    // Cyan/teal
    warning:    { h: 35,  s: 90, l: 55 },    // Amber
    primary:    { h: 250, s: 20, l: 8 },     // Deep indigo-black
    surface:    { h: 250, s: 10, l: 98 },    // Cool white
    surfaceDim: { h: 250, s: 8,  l: 94 },    // Cool off-white
  },

  features: {
    workshops: true,
    retreats: false,
    soundBaths: false,
    teacherTrainings: true,
    practiceTracking: true,
    communityFeed: true,
    guestPasses: true,
    milestones: true,
  },

  classCapacity: 28,
  specialtyCapacity: 20,
};

// ═══════════════════════════════════════════════════════════════
//  THEME SYSTEM
// ═══════════════════════════════════════════════════════════════
const hsl = (c, a) => a !== undefined ? `hsla(${c.h},${c.s}%,${c.l}%,${a})` : `hsl(${c.h},${c.s}%,${c.l}%)`;
const hslShift = (c, lShift) => `hsl(${c.h},${c.s}%,${Math.max(0, Math.min(100, c.l + lShift))}%)`;

const T = {
  accent: hsl(STUDIO_CONFIG.theme.accent),
  accentDark: hslShift(STUDIO_CONFIG.theme.accent, -12),
  accentLight: hslShift(STUDIO_CONFIG.theme.accent, 30),
  accentGhost: hsl(STUDIO_CONFIG.theme.accent, 0.08),
  accentBorder: hsl(STUDIO_CONFIG.theme.accent, 0.18),
  success: hsl(STUDIO_CONFIG.theme.accentAlt),
  successGhost: hsl(STUDIO_CONFIG.theme.accentAlt, 0.08),
  successBorder: hsl(STUDIO_CONFIG.theme.accentAlt, 0.18),
  warning: hsl(STUDIO_CONFIG.theme.warning),
  warningGhost: hsl(STUDIO_CONFIG.theme.warning, 0.08),
  warningBorder: hsl(STUDIO_CONFIG.theme.warning, 0.2),
  bg: hsl(STUDIO_CONFIG.theme.primary),
  bgCard: hsl(STUDIO_CONFIG.theme.surface),
  bgDim: hsl(STUDIO_CONFIG.theme.surfaceDim),
  text: "#1a1630",
  textMuted: "#6b6580",
  textFaint: "#a09aad",
  border: "#e4e0ec",
  borderLight: "#f0edf5",
};

// ═══════════════════════════════════════════════════════════════
//  DATE HELPERS
// ═══════════════════════════════════════════════════════════════
const today = new Date().toISOString().split("T")[0];
const offsetDate = (d) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split("T")[0]; };
const formatDateShort = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); };
const formatDateLong = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }); };
const fmtTime = (t) => { const [h, m] = t.split(":"); const hr = +h; return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`; };

// ═══════════════════════════════════════════════════════════════
//  MOCK DATA — DRYP Yoga content
// ═══════════════════════════════════════════════════════════════
const TEACHERS = [
  { id: "t1", firstName: "Avian", lastName: "King", role: "Lead Teacher", certs: ["RYT-500", "Vinyasa Specialist"], specialties: ["Power Vinyasa", "DRYP Immersion", "Flow"], yearsTeaching: 8, bio: "Avian brings an intentional, deeply embodied teaching style that goes beyond moving through motions. Her classes are known for deepening physical postures with every sequence and creating space to truly disconnect from outside life. Hands-on assists are a hallmark of her practice.", photo: "" },
  { id: "t2", firstName: "Thita", lastName: "Tun", role: "Senior Teacher", certs: ["E-RYT-500", "Meditation Certified"], specialties: ["Hatha", "Slow Flow", "Yin"], yearsTeaching: 12, bio: "Thita masterfully adapts each class to the energy of the room. Her flows are thoughtfully planned and beautifully sequenced, drawing from deep expertise in both movement and stillness. She's known for creating classes that feel simultaneously challenging and nourishing.", photo: "" },
  { id: "t3", firstName: "Natalie", lastName: "Wong", role: "Teacher", certs: ["RYT-200", "Pilates Certified"], specialties: ["DRYP Immersion", "Pilates", "Power"], yearsTeaching: 5, bio: "Natalie blends the precision of Pilates with the flow of yoga, creating classes that strengthen and stretch in equal measure. Her DRYP Immersion sessions are fan favorites, perfectly synced with the LED visuals.", photo: "" },
  { id: "t4", firstName: "Brianna", lastName: "Snyder", role: "Teacher & Events Lead", certs: ["RYT-200", "Sound Healing"], specialties: ["Restorative", "Yinyasa", "Breathwork"], yearsTeaching: 6, bio: "Brianna's teaching is rooted in the belief that stillness is just as powerful as movement. Her restorative and Yinyasa classes invite deep release, often accompanied by gentle soundscapes that complement the studio's immersive environment.", photo: "" },
  { id: "t5", firstName: "Kristine", lastName: "Manuel", role: "Teacher & Training Faculty", certs: ["RYT-200", "Pranayama Specialist"], specialties: ["Breathwork", "Slow Flow", "Meditation"], yearsTeaching: 7, bio: "Kristine illuminates the subtle body through breath and slow meditative flows rooted in classical tantric philosophy. Her specialty is guiding students through pranayama and resonance practices that honor ancestral healing arts.", photo: "" },
  { id: "t6", firstName: "Hannah", lastName: "Smith", role: "Teacher", certs: ["RYT-200", "Fitness Specialist"], specialties: ["Power", "R3BAR", "Flow"], yearsTeaching: 5, bio: "Hannah brings strong focus on form with classes that are accessible for beginners and engaging for advanced practitioners alike. From LA to Texas to Seattle, she's taught in studios, breweries, and parks — bringing energy wherever she goes.", photo: "" },
];

const TODAYS_FOCUS = {
  id: "focus-today", date: today, name: "Neon Cascade", type: "IMMERSION",
  style: "DRYP Immersion", temp: "Heated Floor", duration: 60,
  description: "Our signature immersive experience — a dynamic vinyasa flow synchronized with cascading LED visuals. The room transforms around you as you move through peak poses and expansive breathwork.",
  intention: "Let the light guide your movement. Every breath is a new color.",
  teacherTip: "Don't watch the visuals — let them wash over you. Stay in your body, not your eyes.",
  playlist: "Neon Dreams — DRYP Curated",
};

const PAST_PRACTICES = [
  { id: "p-y1", date: offsetDate(-1), name: "Deep Current", type: "YIN", style: "Yin", temp: "Room Temp", duration: 75, description: "Long-held yin poses with ambient LED gradients shifting through ocean blues. A nervous system reset.", intention: "Depth is not force — it's patience.", teacherTip: "Let gravity do the work. If you're muscling through, soften." },
  { id: "p-y2", date: offsetDate(-2), name: "Ignite", type: "POWER", style: "Power", temp: "Heated Floor", duration: 60, description: "High-intensity power vinyasa building heat and strength. Challenging sequences with upbeat soundtrack.", intention: "The fire you build on the mat is the fire you carry into life." },
  { id: "p-y3", date: offsetDate(-3), name: "Liquid Gold", type: "FLOW", style: "Flow", temp: "Heated Floor", duration: 60, description: "Breath-driven flow with warm amber LED projections. Fluid transitions that build stamina and grace.", intention: "Through repetition, we find freedom.", teacherTip: "Follow your breath, not the person next to you." },
];

const UPCOMING_PRACTICE = { id: "p-tmrw", date: offsetDate(1), name: "Moonlight Restore", type: "RESTORATIVE", style: "Restorative", temp: "Room Temp", duration: 75, description: "A deeply healing restorative session under soft lunar LED projections. Supported poses, gentle breathwork, and full-body release.", intention: "Rest is not the absence of doing — it's the presence of being.", teacherTip: "Bring an extra layer. You'll cool down. That's the point." };

const CLASSES_TODAY = [
  { id: "cl1", time: "06:30", type: "Power (Heated)", coach: "Hannah Smith", capacity: 28, registered: 24, waitlist: 0 },
  { id: "cl2", time: "08:00", type: "DRYP Immersion", coach: "Avian King", capacity: 28, registered: 28, waitlist: 5 },
  { id: "cl3", time: "09:30", type: "Flow (Heated)", coach: "Thita Tun", capacity: 28, registered: 20, waitlist: 0 },
  { id: "cl4", time: "12:00", type: "Hatha", coach: "Kristine Manuel", capacity: 24, registered: 12, waitlist: 0 },
  { id: "cl5", time: "16:30", type: "Power (Heated)", coach: "Natalie Wong", capacity: 28, registered: 26, waitlist: 0 },
  { id: "cl6", time: "17:45", type: "DRYP Immersion", coach: "Avian King", capacity: 28, registered: 28, waitlist: 6 },
  { id: "cl7", time: "19:00", type: "Yin", coach: "Brianna Snyder", capacity: 24, registered: 16, waitlist: 0 },
];

const WEEKLY_SCHEDULE = [
  { day: "Monday", classes: [{ time: "06:30", type: "Power (Heated)", coach: "Hannah" }, { time: "08:00", type: "DRYP Immersion", coach: "Avian" }, { time: "09:30", type: "Flow", coach: "Thita" }, { time: "12:00", type: "Hatha", coach: "Kristine" }, { time: "16:30", type: "Power (Heated)", coach: "Natalie" }, { time: "17:45", type: "DRYP Immersion", coach: "Avian" }, { time: "19:00", type: "Yin", coach: "Brianna" }] },
  { day: "Tuesday", classes: [{ time: "06:30", type: "Flow (Heated)", coach: "Thita" }, { time: "08:00", type: "Power (Heated)", coach: "Hannah" }, { time: "09:30", type: "Slow Flow", coach: "Kristine" }, { time: "12:00", type: "DRYP Immersion", coach: "Natalie" }, { time: "16:30", type: "R3BAR", coach: "Hannah" }, { time: "17:45", type: "Yinyasa", coach: "Brianna" }] },
  { day: "Wednesday", classes: [{ time: "06:30", type: "Power (Heated)", coach: "Avian" }, { time: "08:00", type: "DRYP Immersion", coach: "Thita" }, { time: "09:30", type: "Pilates", coach: "Natalie" }, { time: "12:00", type: "Breathwork", coach: "Kristine" }, { time: "16:30", type: "Flow (Heated)", coach: "Hannah" }, { time: "17:45", type: "DRYP Immersion", coach: "Avian" }] },
  { day: "Thursday", classes: [{ time: "06:30", type: "Flow (Heated)", coach: "Thita" }, { time: "08:00", type: "Power (Heated)", coach: "Hannah" }, { time: "09:30", type: "DRYP Immersion", coach: "Avian" }, { time: "12:00", type: "Slow Flow", coach: "Kristine" }, { time: "16:30", type: "R3BAR", coach: "Natalie" }, { time: "17:45", type: "Restorative", coach: "Brianna" }] },
  { day: "Friday", classes: [{ time: "06:30", type: "Power (Heated)", coach: "Avian" }, { time: "08:00", type: "DRYP Immersion", coach: "Thita" }, { time: "09:30", type: "Flow", coach: "Hannah" }, { time: "12:00", type: "Hatha", coach: "Kristine" }, { time: "16:30", type: "DRYP Immersion", coach: "Natalie" }, { time: "19:00", type: "Restorative", coach: "Brianna" }] },
  { day: "Saturday", classes: [{ time: "08:00", type: "DRYP Immersion", coach: "Avian" }, { time: "09:30", type: "Power (Heated)", coach: "Hannah" }, { time: "11:00", type: "Flow", coach: "Thita" }, { time: "12:30", type: "Yin", coach: "Brianna" }, { time: "14:00", type: "Pilates", coach: "Natalie" }] },
  { day: "Sunday", classes: [{ time: "08:00", type: "Slow Flow", coach: "Kristine" }, { time: "09:30", type: "DRYP Immersion", coach: "Avian" }, { time: "11:00", type: "Hatha", coach: "Thita" }, { time: "16:00", type: "Restorative", coach: "Brianna" }] },
];

const COMMUNITY_FEED = [
  { id: "cf1", user: "Sasha R.", milestone: "100 Classes", message: "100 classes at DRYP. The immersive sessions changed how I relate to my body entirely.", date: today, celebrations: 31, photo: "/images/studio-hires.jpg" },
  { id: "cf2", user: "Dev P.", milestone: "30-Day Streak", message: "30 days straight. The heated floor is calling my name every morning now.", date: today, celebrations: 22, photo: "/images/testimonial1.jpg" },
  { id: "cf3", user: "Nina C.", milestone: "First Headstand!", message: "Finally inverted! Thank you Avian for believing in me before I did!", date: offsetDate(-1), celebrations: 45, photo: null },
  { id: "cf4", user: "Marcus T.", milestone: "1 Year Member", message: "One year in the flow. DRYP is home.", date: offsetDate(-1), celebrations: 38, photo: "/images/testimonial2.jpg" },
];

const MILESTONE_BADGES = {
  "First Class": { icon: Droplets, color: T.accent },
  "10 Classes": { icon: Waves, color: T.accent },
  "50 Classes": { icon: Zap, color: T.accent },
  "100 Classes": { icon: Sun, color: T.success },
  "7-Day Streak": { icon: Flame, color: T.warning },
  "30-Day Streak": { icon: Sparkles, color: T.warning },
  "First Inversion": { icon: ArrowUpRight, color: "#8b5cf6" },
  "First Headstand": { icon: Star, color: "#3b82f6" },
  "1 Year Member": { icon: Award, color: T.success },
};

const EVENTS = [
  { id: "ev1", name: "DRYP After Dark: Full Moon Flow", date: "2026-04-12", startTime: "20:00", type: "Special Event", description: "A candlelit immersive session under full moon LED projections. Slow flow, breathwork, and deep ambient soundscapes. An experience for all the senses.", fee: 45, maxParticipants: 28, registered: 24, status: "Almost Full" },
  { id: "ev2", name: "Breathwork Journey with Kristine", date: "2026-04-18", startTime: "18:00", type: "Workshop", description: "A 90-minute conscious connected breathwork journey exploring pranayama techniques from classical yogic tradition. Release, reset, reconnect.", fee: 55, maxParticipants: 20, registered: 14, status: "Registration Open" },
  { id: "ev3", name: "200hr Teacher Training with Pulse Yoga Collective", date: "2026-05-10", startTime: "12:00", type: "Training", description: "A comprehensive 200-hour training hosted at DRYP Seattle. Five months of in-depth study blending in-studio sessions with live virtual participation.", fee: 3500, maxParticipants: 18, registered: 11, status: "Registration Open" },
  { id: "ev4", name: "R3BAR Challenge: 6-Week Series", date: "2026-04-25", startTime: "17:30", type: "Series", description: "Six weeks of progressive R3BAR training — building strength, endurance, and stability. Track your progress and compete with your past self.", fee: 120, maxParticipants: 24, registered: 18, status: "Open" },
];

const MEMBERSHIP_TIERS = [
  { id: "m1", name: "2-Week Intro", type: "intro", price: 35, period: "2 weeks", features: ["Unlimited classes for 2 weeks", "New students only", "Access to all class types", "Complimentary mat & towel"], popular: false },
  { id: "m2", name: "4-Class Monthly", type: "limited", price: 80, period: "/month", features: ["4 classes per month", "Access to all class types", "Roll-over unused classes", "Cancel anytime"], popular: false },
  { id: "m3", name: "10-Class Pack", type: "pack", price: 230, period: "10 classes", features: ["10 class credits", "Valid for 6 months", "Share with a friend", "Best per-class value"], popular: false },
  { id: "m4", name: "12-Class Monthly", type: "monthly", price: 150, period: "/month", features: ["12 classes per month", "Priority booking", "10% off workshops", "Guest passes (2/month)"], popular: false },
  { id: "m5", name: "Unlimited", type: "unlimited", price: 189, period: "/month", features: ["Unlimited classes", "Priority booking window", "20% off workshops & events", "3 guest passes per month", "Cancel anytime"], popular: true },
  { id: "m6", name: "Annual Unlimited", type: "annual", price: 1588, period: "/year", features: ["Unlimited classes all year", "Maximum savings ($44/mo)", "Priority booking", "25% off all events", "5 guest passes per month"], popular: false },
];

const ANNOUNCEMENTS = [
  { id: "a1", title: "DRYP After Dark Returns!", message: "Our monthly full-moon candlelit immersive session. April 12th at 8 PM. Limited spots — reserve now.", type: "celebration", pinned: true },
  { id: "a2", title: "New Class: R3BAR", message: "Resistance band training meets yoga flow. High-energy, full-body sculpting. Tuesdays & Thursdays.", type: "info", pinned: false },
];

const MEMBERS_DATA = [
  { id: "mem1", name: "Sasha Rivera", email: "sasha@email.com", membership: "Unlimited", status: "active", joined: "2023-03-10", checkIns: 312, lastVisit: today },
  { id: "mem2", name: "Dev Patel", email: "dev@email.com", membership: "Unlimited", status: "active", joined: "2022-09-01", checkIns: 445, lastVisit: offsetDate(-1) },
  { id: "mem3", name: "Nina Chen", email: "nina@email.com", membership: "12-Class Monthly", status: "active", joined: "2025-08-01", checkIns: 64, lastVisit: offsetDate(-2) },
  { id: "mem4", name: "Marcus Torres", email: "marcus@email.com", membership: "Unlimited", status: "active", joined: "2025-03-24", checkIns: 178, lastVisit: today },
  { id: "mem5", name: "Jenna Park", email: "jenna@email.com", membership: "Unlimited", status: "frozen", joined: "2024-06-01", checkIns: 112, lastVisit: offsetDate(-28) },
  { id: "mem6", name: "Kai Wilson", email: "kai@email.com", membership: "10-Class Pack", status: "active", joined: "2026-01-15", checkIns: 7, lastVisit: offsetDate(-4) },
  { id: "mem7", name: "Elena Ruiz", email: "elena@email.com", membership: "Annual Unlimited", status: "active", joined: "2023-07-01", checkIns: 389, lastVisit: today },
  { id: "mem8", name: "James Okafor", email: "james@email.com", membership: "Unlimited", status: "active", joined: "2024-02-10", checkIns: 267, lastVisit: offsetDate(-1) },
];

const ADMIN_METRICS = {
  activeMembers: 186, memberChange: 14,
  todayCheckIns: 72, weekCheckIns: 426,
  monthlyRevenue: 28400, revenueChange: 11.2,
  renewalRate: 89.5, workshopRevenue: 3800,
};

const ADMIN_CHARTS = {
  attendance: [
    { day: "Mon", total: 78, avg: 13 }, { day: "Tue", total: 65, avg: 11 },
    { day: "Wed", total: 72, avg: 12 }, { day: "Thu", total: 68, avg: 11 },
    { day: "Fri", total: 70, avg: 12 }, { day: "Sat", total: 88, avg: 18 },
    { day: "Sun", total: 42, avg: 11 },
  ],
  revenue: [
    { month: "Sep", revenue: 22500 }, { month: "Oct", revenue: 23800 },
    { month: "Nov", revenue: 24200 }, { month: "Dec", revenue: 23100 },
    { month: "Jan", revenue: 26200 }, { month: "Feb", revenue: 27400 },
    { month: "Mar", revenue: 28400 },
  ],
  classPopularity: [
    { name: "6:30 AM", pct: 86 }, { name: "8:00 AM", pct: 98 },
    { name: "9:30 AM", pct: 74 }, { name: "12:00 PM", pct: 52 },
    { name: "4:30 PM", pct: 94 }, { name: "5:45 PM", pct: 100 },
    { name: "7:00 PM", pct: 68 },
  ],
  membershipBreakdown: [
    { name: "Unlimited Monthly", value: 82, color: T.accent },
    { name: "Annual Unlimited", value: 36, color: T.success },
    { name: "12-Class Monthly", value: 34, color: T.warning },
    { name: "Class Packs & Intro", value: 34, color: T.textMuted },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  APP CONTEXT
// ═══════════════════════════════════════════════════════════════
const AppContext = createContext(null);

// ═══════════════════════════════════════════════════════════════
//  CONSUMER PAGES
// ═══════════════════════════════════════════════════════════════

function HomePage() {
  const { classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed } = useContext(AppContext);
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  const upcoming = CLASSES_TODAY.filter(c => c.time >= currentTime).slice(0, 4);

  return (
    <div className="pb-6">
      {/* Hero */}
      <section style={{ color: "#fff", position: "relative", overflow: "hidden" }}>
        <img src="/images/hero-home.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${T.bg}88 0%, ${T.bg}aa 30%, ${T.bg}dd 55%, ${T.bg}f5 80%, ${T.bg} 100%)` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "20%", background: `linear-gradient(180deg, transparent, ${T.bgDim})` }} />
        <div style={{ position: "relative", padding: "48px 22px 40px" }}>
          <p style={{ color: T.accent, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 12, textShadow: "0 1px 6px rgba(0,0,0,.6)" }}>
            {formatDateLong(today)}
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 48, lineHeight: 0.95, letterSpacing: "-0.02em", margin: 0, fontWeight: 400, textShadow: "0 2px 16px rgba(0,0,0,.7), 0 4px 32px rgba(0,0,0,.4)" }}>
            {STUDIO_CONFIG.heroLine1}<br/>
            <span style={{ color: T.accent, fontStyle: "italic" }}>{STUDIO_CONFIG.heroLine2}</span>
          </h1>
          <p style={{ color: "#fff", fontSize: 14, maxWidth: 300, marginTop: 14, lineHeight: 1.5, textShadow: "0 1px 8px rgba(0,0,0,.7), 0 2px 16px rgba(0,0,0,.4)" }}>{STUDIO_CONFIG.description}</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section style={{ padding: "0 16px", marginTop: -16, position: "relative", zIndex: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {[
            { icon: Calendar, label: "Reserve", page: "schedule", color: T.accent },
            { icon: Flame, label: "Practice", page: "practice", color: T.success },
            { icon: Heart, label: "Community", page: "community", color: T.warning },
            { icon: Users, label: "Teachers", page: "teachers", color: T.textMuted },
          ].map(a => (
            <QuickAction key={a.label} {...a} />
          ))}
        </div>
      </section>

      {/* Today's Practice Focus */}
      <section style={{ padding: "0 16px", marginTop: 24 }}>
        <SectionHeader title="Today's Session" linkText="All Classes" linkPage="classes" />
        <PracticeCardFull practice={TODAYS_FOCUS} variant="featured" />
      </section>

      {/* Upcoming Classes */}
      <section style={{ padding: "0 16px", marginTop: 28 }}>
        <SectionHeader title="Upcoming Classes" linkText="Full Schedule" linkPage="schedule" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {upcoming.length > 0 ? upcoming.map(c => {
            const regs = (classRegistrations[c.id] || 0);
            const totalReg = c.registered + regs;
            const isFull = totalReg >= c.capacity;
            return (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ textAlign: "center", minWidth: 44 }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: T.text, fontWeight: 600 }}>{fmtTime(c.time).split(":")[0]}</span>
                  <span style={{ display: "block", fontSize: 11, color: T.textMuted }}>{fmtTime(c.time).slice(-5)}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: T.text, fontSize: 14, margin: 0 }}>{c.type}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{c.coach.split(" ")[0]}</p>
                </div>
                <div style={{ textAlign: "right", marginRight: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isFull ? T.warning : totalReg >= c.capacity * 0.8 ? T.success : T.accent }}>{totalReg}/{c.capacity}</span>
                  {c.waitlist > 0 && <span style={{ display: "block", fontSize: 11, color: T.textFaint }}>+{c.waitlist} waitlist</span>}
                </div>
                <button onClick={() => openReservation({ ...c, date: today })} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: isFull ? T.bgDim : T.accent, color: isFull ? T.textMuted : "#fff", transition: "all 0.15s" }}>
                  {isFull ? "Waitlist" : "Reserve"}
                </button>
              </div>
            );
          }) : (
            <EmptyState icon={Moon} message="No more classes today" sub="See tomorrow's schedule" />
          )}
        </div>
      </section>

      {/* Community Feed */}
      {STUDIO_CONFIG.features.communityFeed && (
        <section style={{ padding: "0 16px", marginTop: 28 }}>
          <SectionHeader title="Community" linkText="View All" linkPage="community" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {COMMUNITY_FEED.slice(0, 3).map(item => {
              const myC = feedCelebrations[item.id] || 0;
              return (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: `linear-gradient(135deg, ${T.successGhost}, transparent)`, border: `1px solid ${T.successBorder}`, borderRadius: 12 }}>
                  {item.photo ? (
                    <img src={item.photo} alt={item.user} loading="lazy" width={40} height={40} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.success, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Sparkles size={18} color="#fff" />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>
                      {item.user} <span style={{ color: T.success }}>{item.milestone}</span>
                    </p>
                    <p style={{ fontSize: 12, color: "#6b5f80", margin: "2px 0 0", lineHeight: 1.4 }}>
                      {item.message.length > 60 ? item.message.slice(0, 60) + "…" : item.message}
                    </p>
                  </div>
                  <button onClick={() => celebrateFeed(item.id)} style={{ padding: 8, borderRadius: 8, border: "none", background: myC > 0 ? T.successGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s" }}>
                    <Heart size={18} color={T.success} fill={myC > 0 ? T.success : "none"} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.success }}>{item.celebrations + myC}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Announcements */}
      {ANNOUNCEMENTS.length > 0 && (
        <section style={{ padding: "0 16px", marginTop: 28 }}>
          <SectionHeader title="Announcements" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ANNOUNCEMENTS.map(a => (
              <div key={a.id} style={{ padding: "14px 16px", borderRadius: 12, borderLeft: `4px solid ${a.type === "celebration" ? T.accent : a.type === "alert" ? T.warning : T.textMuted}`, background: a.type === "celebration" ? T.accentGhost : a.type === "alert" ? T.warningGhost : T.bgDim }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: 0 }}>{a.title}</h3>
                    <p style={{ fontSize: 13, color: "#6b5f80", margin: "4px 0 0" }}>{a.message}</p>
                  </div>
                  {a.pinned && <span style={{ fontSize: 11, fontWeight: 600, color: T.accent, background: T.accentGhost, padding: "2px 8px", borderRadius: 99 }}>Pinned</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: "0 16px", marginTop: 28 }}>
        <CTACard />
      </section>
    </div>
  );
}

// ——— CLASSES PAGE ———
function ClassesPage() {
  const [expandedPractice, setExpandedPractice] = useState(null);
  const allPractices = [TODAYS_FOCUS, ...PAST_PRACTICES, UPCOMING_PRACTICE].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <PageHero image="/images/hero-classes.jpg" title="Classes" subtitle="Past, present, and upcoming sessions" />
      <div style={{ padding: "0 16px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {allPractices.map(p => (
          <PracticeCardFull key={p.id} practice={p} expanded={expandedPractice === p.id} onToggle={() => setExpandedPractice(expandedPractice === p.id ? null : p.id)} />
        ))}
      </div>
      </div>
    </div>
  );
}

// ——— SCHEDULE PAGE ———
function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const { classRegistrations, registerForClass, openReservation } = useContext(AppContext);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const scheduleRegistered = useMemo(() => {
    const result = {};
    WEEKLY_SCHEDULE.forEach((day, dayIdx) => {
      day.classes.forEach((_, clsIdx) => {
        result[`${dayIdx}-${clsIdx}`] = Math.floor(Math.random() * 10) + 15;
      });
    });
    return result;
  }, []);

  return (
    <div>
      <PageHero image="/images/hero-schedule.jpg" title="Schedule" subtitle="Reserve your spot — sessions fill fast" />
      <div style={{ padding: "0 16px" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {days.map((d, i) => (
          <button key={d} onClick={() => setSelectedDay(i)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", background: selectedDay === i ? T.accent : T.bgDim, color: selectedDay === i ? "#fff" : T.textMuted, transition: "all 0.15s" }}>
            {d}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {WEEKLY_SCHEDULE[selectedDay]?.classes.map((cls, i) => {
          const isSpecial = cls.type.includes("Yin") || cls.type.includes("Restorative") || cls.type.includes("Breathwork");
          const isImmersion = cls.type.includes("Immersion");
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${isImmersion ? T.accentBorder : T.border}`, borderRadius: 12 }}>
              <div style={{ textAlign: "center", minWidth: 56 }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: T.text, fontWeight: 600 }}>{fmtTime(cls.time)}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>{cls.type}</p>
                  {isImmersion && <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "1px 6px", borderRadius: 4, background: T.accentGhost, color: T.accent }}>LED</span>}
                  {isSpecial && <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "1px 6px", borderRadius: 4, background: T.warningGhost, color: T.warning }}>Special</span>}
                </div>
                {cls.coach && <p style={{ fontSize: 12, color: T.textMuted, margin: "3px 0 0" }}>{cls.coach}</p>}
              </div>
              <button onClick={() => openReservation({ id: `sched-${selectedDay}-${i}`, time: cls.time, type: cls.type, coach: cls.coach || "TBD", capacity: isSpecial ? STUDIO_CONFIG.specialtyCapacity : STUDIO_CONFIG.classCapacity, registered: scheduleRegistered[`${selectedDay}-${i}`], waitlist: 0, dayLabel: dayNames[selectedDay] })} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: T.accent, color: "#fff" }}>
                Reserve
              </button>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

// ——— PRACTICE TRACKING PAGE ———
function PracticePage() {
  const [activeTab, setActiveTab] = useState("log");
  const [reflection, setReflection] = useState({ energy: 4, focus: 4, notes: "" });
  const [saved, setSaved] = useState(null);

  const handleSave = () => {
    setSaved("log");
    setTimeout(() => setSaved(null), 2000);
    setReflection({ energy: 4, focus: 4, notes: "" });
  };

  const streakDays = 14;
  const totalClasses = 92;

  return (
    <div>
      <PageHero image="/images/hero-practice.jpg" title="My Practice" subtitle="Track your journey and celebrate growth" />
      <div style={{ padding: "0 16px" }}>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
        <div style={{ background: T.accentGhost, border: `1px solid ${T.accentBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Flame size={20} color={T.accent} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: T.text }}>{streakDays}</div>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Day Streak</div>
        </div>
        <div style={{ background: T.successGhost, border: `1px solid ${T.successBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Star size={20} color={T.success} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: T.text }}>{totalClasses}</div>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Classes</div>
        </div>
        <div style={{ background: T.warningGhost, border: `1px solid ${T.warningBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Zap size={20} color={T.warning} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: T.text }}>7</div>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Milestones</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: T.bgDim, borderRadius: 10, padding: 4 }}>
        {[{ id: "log", label: "Reflection" }, { id: "milestones", label: "Milestones" }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: activeTab === tab.id ? T.bgCard : "transparent", color: activeTab === tab.id ? T.text : T.textMuted, boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,.06)" : "none", transition: "all 0.15s" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reflection Form */}
      {activeTab === "log" && (
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Droplets size={18} color={T.accent} />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Post-Session Reflection</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Energy Level</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setReflection({...reflection, energy: n})} style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${reflection.energy >= n ? T.accent : T.border}`, background: reflection.energy >= n ? T.accentGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {n <= 2 ? <Moon size={18} color={reflection.energy >= n ? T.accent : T.textFaint} /> : n <= 4 ? <Sun size={18} color={reflection.energy >= n ? T.accent : T.textFaint} /> : <Zap size={18} color={reflection.energy >= n ? T.accent : T.textFaint} />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Focus & Presence</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setReflection({...reflection, focus: n})} style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${reflection.focus >= n ? T.success : T.border}`, background: reflection.focus >= n ? T.successGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {n <= 2 ? <Wind size={18} color={reflection.focus >= n ? T.success : T.textFaint} /> : n <= 4 ? <Eye size={18} color={reflection.focus >= n ? T.success : T.textFaint} /> : <Sparkles size={18} color={reflection.focus >= n ? T.success : T.textFaint} />}
                  </button>
                ))}
              </div>
            </div>
            <InputField label="Notes / Gratitude" value={reflection.notes} onChange={v => setReflection({...reflection, notes: v})} placeholder="What came up for you on the mat today?" multiline />
            <button onClick={handleSave} style={{ padding: "12px 0", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", background: T.accent, color: "#fff", fontFamily: "'Playfair Display', serif", letterSpacing: "0.03em", fontSize: 17 }}>
              {saved === "log" ? <><Check size={16} style={{ display: "inline", verticalAlign: "middle" }} /> Saved</> : "Save Reflection"}
            </button>
          </div>
        </div>
      )}

      {/* Milestones */}
      {activeTab === "milestones" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {Object.entries(MILESTONE_BADGES).map(([name, badge]) => {
            const earned = ["First Class", "10 Classes", "50 Classes", "7-Day Streak", "30-Day Streak", "First Inversion", "First Headstand"].includes(name);
            const BadgeIcon = badge.icon;
            return (
              <div key={name} style={{ background: earned ? T.bgCard : T.bgDim, border: `1px solid ${earned ? T.border : T.borderLight}`, borderRadius: 12, padding: "16px 14px", textAlign: "center", opacity: earned ? 1 : 0.45 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: earned ? `${badge.color}18` : T.bgDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                  <BadgeIcon size={22} color={earned ? badge.color : T.textFaint} />
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: earned ? T.text : T.textFaint, margin: 0 }}>{name}</p>
                <p style={{ fontSize: 11, color: T.textMuted, margin: "2px 0 0" }}>{earned ? "Earned ✓" : "Keep going"}</p>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}

// ——— COMMUNITY PAGE ———
function CommunityPage() {
  const { feedCelebrations, celebrateFeed } = useContext(AppContext);

  return (
    <div>
      <PageHero image="/images/hero-community.jpg" title="Community" subtitle="Celebrate each other's practice" />
      <div style={{ padding: "0 16px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {COMMUNITY_FEED.map(item => {
          const myC = feedCelebrations[item.id] || 0;
          return (
            <div key={item.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                {item.photo ? (
                  <img src={item.photo} alt={item.user} loading="lazy" width={40} height={40} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 16, color: "#fff", fontWeight: 700, flexShrink: 0 }}>
                    {item.user[0]}
                  </div>
                )}
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: T.text }}>{item.user}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "1px 0 0" }}>{formatDateShort(item.date)}</p>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: T.successGhost, color: T.success }}>{item.milestone}</span>
              </div>
              <p style={{ fontSize: 14, color: "#4a4060", lineHeight: 1.5, margin: "0 0 12px" }}>{item.message}</p>
              <button onClick={() => celebrateFeed(item.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: `1px solid ${myC > 0 ? T.successBorder : T.border}`, background: myC > 0 ? T.successGhost : "transparent", cursor: "pointer" }}>
                <Heart size={16} color={T.success} fill={myC > 0 ? T.success : "none"} />
                <span style={{ fontSize: 13, fontWeight: 600, color: T.success }}>{item.celebrations + myC}</span>
              </button>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

// ——— TEACHERS PAGE ———
function TeachersPage() {
  const [expandedTeacher, setExpandedTeacher] = useState(null);

  return (
    <div>
      <PageHero image="/images/hero-teachers.jpg" title="Teachers" subtitle="Meet the DRYP teaching team" />
      <div style={{ padding: "0 16px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {TEACHERS.map(teacher => {
          const expanded = expandedTeacher === teacher.id;
          return (
            <div key={teacher.id} onClick={() => setExpandedTeacher(expanded ? null : teacher.id)} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", flexShrink: 0, fontWeight: 600 }}>
                  {teacher.firstName[0]}{teacher.lastName[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: T.text }}>
                    {teacher.firstName} {teacher.lastName}
                  </h3>
                  <p style={{ fontSize: 13, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{teacher.role}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{teacher.yearsTeaching} years teaching</p>
                </div>
                <ChevronDown size={18} color={T.textFaint} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </div>
              {expanded && (
                <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${T.borderLight}`, paddingTop: 14 }}>
                  <p style={{ fontSize: 13, color: "#5a5070", lineHeight: 1.6, margin: "0 0 12px" }}>{teacher.bio}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                    {teacher.specialties.map(s => (
                      <span key={s} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.accentGhost, color: T.accent }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {teacher.certs.map(c => (
                      <span key={c} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.bgDim, color: T.textMuted }}>{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

// ——— MEMBERSHIP PAGE ———
function MembershipPage() {
  return (
    <div>
      <PageHero image="/images/hero-membership.jpg" title="Membership" subtitle="Find your flow" />
      <div style={{ padding: "0 16px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {MEMBERSHIP_TIERS.map(tier => (
          <div key={tier.id} style={{ background: T.bgCard, border: `1px solid ${tier.popular ? T.accent : T.border}`, borderRadius: 14, padding: "20px 18px", position: "relative", overflow: "hidden" }}>
            {tier.popular && (
              <div style={{ position: "absolute", top: 12, right: -28, background: T.accent, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 32px", transform: "rotate(45deg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Popular
              </div>
            )}
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: "0 0 4px", color: T.text }}>{tier.name}</h3>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, color: T.accent, fontWeight: 700 }}>${tier.price}</span>
              <span style={{ fontSize: 13, color: T.textMuted }}>{tier.period}</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
              {tier.features.map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13, color: "#5a5070" }}>
                  <CircleCheck size={14} color={T.accent} style={{ flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
            <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', serif", letterSpacing: "0.03em", background: tier.popular ? T.accent : T.bg, color: "#fff" }}>
              Get Started
            </button>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

// ——— EVENTS PAGE ———
function EventsPage() {
  return (
    <div>
      <PageHero image="/images/hero-events.jpg" title="Events" subtitle="Workshops, trainings, and special experiences" />
      <div style={{ padding: "0 16px" }}>
      {EVENTS.map(ev => (
        <div key={ev.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(270,25%,12%))`, padding: "20px 18px", color: "#fff", position: "relative", overflow: "hidden" }}>
            <img src="/images/events-bg.png" alt="" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.15, mixBlendMode: "lighten" }} />
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.accent, position: "relative" }}>{ev.type}</span>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: "6px 0 4px", fontWeight: 600, position: "relative" }}>{ev.name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#b0a8c8", position: "relative" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={14} /> {formatDateShort(ev.date)}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> {fmtTime(ev.startTime)}</span>
            </div>
          </div>
          <div style={{ padding: "16px 18px" }}>
            <p style={{ fontSize: 13, color: "#5a5070", lineHeight: 1.6, margin: "0 0 14px" }}>{ev.description}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <StatBox label="Price" value={ev.fee >= 1000 ? `$${(ev.fee/1000).toFixed(1)}k` : `$${ev.fee}`} />
              <StatBox label="Spots" value={`${ev.registered}/${ev.maxParticipants}`} />
            </div>
            <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', serif", letterSpacing: "0.03em", background: T.accent, color: "#fff" }}>
              Register Now
            </button>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ADMIN PAGES
// ═══════════════════════════════════════════════════════════════

function AdminDashboard() {
  const metrics = [
    { label: "Active Members", value: ADMIN_METRICS.activeMembers, change: `+${ADMIN_METRICS.memberChange}`, positive: true, icon: Users, color: T.accent },
    { label: "Today's Check-ins", value: ADMIN_METRICS.todayCheckIns, change: `${ADMIN_METRICS.weekCheckIns} this week`, positive: true, icon: Calendar, color: T.success },
    { label: "Monthly Revenue", value: `$${ADMIN_METRICS.monthlyRevenue.toLocaleString()}`, change: `+${ADMIN_METRICS.revenueChange}%`, positive: true, icon: DollarSign, color: T.warning },
    { label: "Workshop Revenue", value: `$${ADMIN_METRICS.workshopRevenue.toLocaleString()}`, change: "+14 registrations", positive: true, icon: Award, color: "#8b5cf6" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: "#9ca3af", margin: "4px 0 0" }}>Welcome back. Here's what's happening at {STUDIO_CONFIG.name}.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: "#1a1530", border: "1px solid #2d2845", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${m.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <m.icon size={18} color={m.color} />
              </div>
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: "#fff", fontWeight: 700 }}>{m.value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <span style={{ display: "flex", alignItems: "center", fontSize: 12, fontWeight: 600, color: m.positive ? "#4ade80" : "#f87171" }}>
                {m.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {m.change}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "6px 0 0" }}>{m.label}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
        <AdminCard title="Weekly Attendance">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_CHARTS.attendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2845" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#1a1530", border: "1px solid #2d2845", borderRadius: 8, color: "#fff" }} />
                <Bar dataKey="total" fill={T.accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
        <AdminCard title="Revenue Trend">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADMIN_CHARTS.revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2845" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: "#1a1530", border: "1px solid #2d2845", borderRadius: 8, color: "#fff" }} formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} />
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.accent} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={T.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="revenue" stroke={T.accent} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        <AdminCard title="Membership Breakdown">
          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ADMIN_CHARTS.membershipBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {ADMIN_CHARTS.membershipBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1a1530", border: "1px solid #2d2845", borderRadius: 8, color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {ADMIN_CHARTS.membershipBreakdown.map((entry, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color }} />
                <span style={{ fontSize: 11, color: "#9ca3af" }}>{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </AdminCard>
        <AdminCard title="Class Fill Rate">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ADMIN_CHARTS.classPopularity.map((cp, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "#9ca3af", minWidth: 60 }}>{cp.name}</span>
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#2d2845" }}>
                  <div style={{ width: `${cp.pct}%`, height: "100%", borderRadius: 4, background: cp.pct >= 90 ? T.warning : cp.pct >= 70 ? T.accent : T.success }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: cp.pct >= 90 ? T.warning : "#d1d5db", minWidth: 32, textAlign: "right" }}>{cp.pct}%</span>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

function AdminMembersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = MEMBERS_DATA.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || m.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Members</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <UserPlus size={16} /> Add Member
        </button>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7280" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." style={{ width: "100%", padding: "10px 12px 10px 36px", background: "#1a1530", border: "1px solid #2d2845", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["all", "active", "frozen"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", background: filter === f ? T.accent : "#1a1530", color: filter === f ? "#fff" : "#9ca3af" }}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background: "#1a1530", border: "1px solid #2d2845", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2d2845" }}>
              {["Member", "Membership", "Status", "Classes", "Last Visit"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#9ca3af", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} style={{ borderBottom: "1px solid #2d2845" }}>
                <td style={{ padding: "12px 16px" }}>
                  <p style={{ color: "#fff", fontWeight: 600, margin: 0 }}>{m.name}</p>
                  <p style={{ color: "#6b7280", fontSize: 12, margin: "2px 0 0" }}>{m.email}</p>
                </td>
                <td style={{ padding: "12px 16px", color: "#d1d5db" }}>{m.membership}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, textTransform: "capitalize", background: m.status === "active" ? `${T.accent}20` : `${T.warning}20`, color: m.status === "active" ? T.accent : T.warning }}>
                    {m.status}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", color: "#d1d5db", fontFamily: "monospace" }}>{m.checkIns}</td>
                <td style={{ padding: "12px 16px", color: "#9ca3af", fontSize: 12 }}>{formatDateShort(m.lastVisit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminSchedulePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Schedule Management</h1>
      <div style={{ background: "#1a1530", border: "1px solid #2d2845", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2d2845" }}>
              {["Time", "Class", "Teacher", "Capacity", "Registered", "Status"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#9ca3af", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CLASSES_TODAY.map(c => (
              <tr key={c.id} style={{ borderBottom: "1px solid #2d2845" }}>
                <td style={{ padding: "12px 16px", color: "#fff", fontFamily: "monospace" }}>{fmtTime(c.time)}</td>
                <td style={{ padding: "12px 16px", color: "#d1d5db", fontWeight: 600 }}>{c.type}</td>
                <td style={{ padding: "12px 16px", color: "#d1d5db" }}>{c.coach}</td>
                <td style={{ padding: "12px 16px", color: "#9ca3af" }}>{c.capacity}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontFamily: "monospace", fontWeight: 600, color: c.registered >= c.capacity ? T.warning : T.accent }}>{c.registered}/{c.capacity}</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: c.registered >= c.capacity ? `${T.warning}20` : `${T.accent}20`, color: c.registered >= c.capacity ? T.warning : T.accent }}>
                    {c.registered >= c.capacity ? "Full" : "Open"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminTeachersPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Teachers</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <UserPlus size={16} /> Add Teacher
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {TEACHERS.map(teacher => (
          <div key={teacher.id} style={{ background: "#1a1530", border: "1px solid #2d2845", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#fff", fontWeight: 600 }}>
                {teacher.firstName[0]}{teacher.lastName[0]}
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>{teacher.firstName} {teacher.lastName}</h3>
                <p style={{ fontSize: 12, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{teacher.role}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
              {teacher.certs.map(c => (
                <span key={c} style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "#2d2845", color: "#9ca3af" }}>{c}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #2d2845", background: "transparent", color: "#d1d5db", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #2d2845", background: "transparent", color: "#d1d5db", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Schedule</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminEventsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Events & Workshops</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <Plus size={16} /> New Event
        </button>
      </div>
      {EVENTS.map(ev => (
        <div key={ev.id} style={{ background: "#1a1530", border: "1px solid #2d2845", borderRadius: 12, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: `${T.accent}20`, color: T.accent }}>{ev.status}</span>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "8px 0 4px" }}>{ev.name}</h3>
              <p style={{ fontSize: 13, color: "#9ca3af" }}>{formatDateShort(ev.date)} · {ev.type} · ${ev.fee}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: T.accent, fontWeight: 700 }}>{ev.registered}</div>
              <p style={{ fontSize: 11, color: "#9ca3af" }}>of {ev.maxParticipants} spots</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminPricingPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Pricing & Memberships</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {MEMBERSHIP_TIERS.map(tier => (
          <div key={tier.id} style={{ background: "#1a1530", border: `1px solid ${tier.popular ? T.accent : "#2d2845"}`, borderRadius: 12, padding: 18 }}>
            {tier.popular && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: T.accentGhost, color: T.accent, marginBottom: 8, display: "inline-block" }}>MOST POPULAR</span>}
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", margin: "0 0 4px" }}>{tier.name}</h3>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, color: T.accent, fontWeight: 700 }}>${tier.price}<span style={{ fontSize: 14, color: "#9ca3af", fontWeight: 400 }}> {tier.period}</span></div>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "8px 0" }}>{tier.features.length} features</p>
            <button style={{ width: "100%", padding: "8px 0", borderRadius: 6, border: "1px solid #2d2845", background: "transparent", color: "#d1d5db", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit Tier</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminBroadcastPage() {
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#fff", margin: 0 }}>Broadcast & Notifications</h1>
      <div style={{ background: "#1a1530", border: "1px solid #2d2845", borderRadius: 12, padding: 18 }}>
        <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>New Broadcast</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input placeholder="Title" style={{ padding: "10px 14px", background: "#0f0d1a", border: "1px solid #2d2845", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" }} />
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message..." rows={4} style={{ padding: "10px 14px", background: "#0f0d1a", border: "1px solid #2d2845", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit" }} />
          <div style={{ display: "flex", gap: 6 }}>
            {["all", "unlimited", "class packs", "teachers"].map(a => (
              <button key={a} onClick={() => setAudience(a)} style={{ padding: "6px 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", background: audience === a ? T.accent : "#2d2845", color: audience === a ? "#fff" : "#9ca3af" }}>{a}</button>
            ))}
          </div>
          <button style={{ padding: "10px 0", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Send size={16} /> Send Broadcast
          </button>
        </div>
      </div>
      <div>
        <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>Sent Broadcasts</h3>
        {ANNOUNCEMENTS.map(a => (
          <div key={a.id} style={{ background: "#1a1530", border: "1px solid #2d2845", borderRadius: 10, padding: 14, marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4 style={{ color: "#fff", margin: 0, fontSize: 14, fontWeight: 600 }}>{a.title}</h4>
              {a.pinned && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: T.accentGhost, color: T.accent }}>PINNED</span>}
            </div>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "4px 0 0" }}>{a.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════

function SectionHeader({ title, linkText, linkPage }) {
  const { setPage } = useContext(AppContext);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, margin: 0 }}>{title}</h2>
      {linkText && (
        <button onClick={() => setPage(linkPage)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: T.accent, background: "none", border: "none", cursor: "pointer" }}>
          {linkText} <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

function PageTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 34, margin: 0 }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 13, color: T.textMuted, margin: "4px 0 0" }}>{subtitle}</p>}
    </div>
  );
}

function PageHero({ image, title, subtitle }) {
  return (
    <section style={{ position: "relative", height: 200, overflow: "hidden", marginBottom: 20 }}>
      <img src={image} alt="" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${T.bg}66 0%, ${T.bg}cc 60%, ${T.bg}f2 85%, ${T.bg} 100%)` }} />
      <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 22px 20px" }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, margin: 0, color: "#fff", letterSpacing: "-0.01em", textShadow: "0 2px 12px rgba(0,0,0,.5)" }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 14, color: "#fff", margin: "5px 0 0", textShadow: "0 1px 8px rgba(0,0,0,.6)", lineHeight: 1.4 }}>{subtitle}</p>}
      </div>
    </section>
  );
}

function QuickAction({ icon: Icon, label, page, color }) {
  const { setPage } = useContext(AppContext);
  return (
    <button onClick={() => setPage(page)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", background: T.bgCard, borderRadius: 12, border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={20} color="#fff" />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{label}</span>
    </button>
  );
}

function PracticeCardFull({ practice, variant, expanded, onToggle }) {
  const isFeatured = variant === "featured";
  const isExpanded = expanded !== undefined ? expanded : isFeatured;

  const typeColors = {
    IMMERSION: T.accent, POWER: T.warning, YIN: "#8b5cf6", FLOW: T.success, RESTORATIVE: T.success,
  };

  return (
    <div onClick={onToggle} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderLeft: `4px solid ${typeColors[practice.type] || T.accent}`, borderRadius: 12, padding: isFeatured ? "18px 18px" : "14px 16px", cursor: onToggle ? "pointer" : "default", transition: "all 0.2s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isExpanded ? 10 : 0 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            {practice.date === today ? (
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: T.accentGhost, color: T.accent }}>TODAY</span>
            ) : (
              <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>{formatDateShort(practice.date)}</span>
            )}
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: `${typeColors[practice.type] || T.accent}12`, color: typeColors[practice.type] || T.accent }}>{practice.style}</span>
            {practice.duration && <span style={{ fontSize: 11, color: T.textFaint }}>{practice.duration} min</span>}
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: isFeatured ? 26 : 20, margin: 0, color: T.text }}>{practice.name}</h3>
        </div>
        {onToggle && <ChevronDown size={18} color={T.textFaint} style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />}
      </div>
      {isExpanded && (
        <div>
          {practice.temp && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <Zap size={14} color={T.success} />
              <span style={{ fontSize: 12, fontWeight: 600, color: T.success }}>{practice.temp}</span>
            </div>
          )}
          <p style={{ fontSize: 14, color: "#5a5070", lineHeight: 1.6, margin: "0 0 12px" }}>{practice.description}</p>
          {practice.intention && (
            <div style={{ padding: "10px 12px", background: T.accentGhost, borderRadius: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: "0.05em" }}>Intention</span>
              <p style={{ fontSize: 13, color: "#5a5070", margin: "4px 0 0", lineHeight: 1.5, fontStyle: "italic" }}>{practice.intention}</p>
            </div>
          )}
          {practice.teacherTip && (
            <div style={{ padding: "10px 12px", background: T.successGhost, borderRadius: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.success, textTransform: "uppercase", letterSpacing: "0.05em" }}>Teacher's Note</span>
              <p style={{ fontSize: 13, color: "#5a5070", margin: "4px 0 0", lineHeight: 1.5 }}>{practice.teacherTip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, multiline }) {
  const style = { width: "100%", padding: "10px 12px", background: T.bgDim, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 14, color: T.text, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...style, resize: "vertical" }} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style} />
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, message, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
      <Icon size={36} color={T.textFaint} style={{ margin: "0 auto 8px" }} />
      <p style={{ color: T.textMuted, margin: 0 }}>{message}</p>
      {sub && <p style={{ fontSize: 13, color: T.accent, margin: "6px 0 0" }}>{sub}</p>}
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div style={{ background: T.bgDim, borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px" }}>{label}</p>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: T.text, margin: 0, fontWeight: 700 }}>{value}</p>
    </div>
  );
}

function CTACard() {
  const { setPage } = useContext(AppContext);
  return (
    <div style={{ background: `linear-gradient(165deg, ${T.bg}, hsl(270,25%,12%))`, borderRadius: 16, padding: "24px 20px", color: "#fff", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.05, background: "radial-gradient(circle at 80% 30%, rgba(139,92,246,.6) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(6,182,212,.3) 0%, transparent 50%)" }} />
      <img src={STUDIO_CONFIG.logoImage} alt="" style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, opacity: 0.08, borderRadius: 16 }} />
      <div style={{ position: "relative" }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin: "0 0 6px", fontWeight: 600 }}>New to DRYP?</h3>
        <p style={{ fontSize: 13, color: "#b0a8c8", margin: "0 0 16px", lineHeight: 1.5 }}>One of the few studios on earth blending LED visuals with movement. Start with our 2-week intro for $35.</p>
        <button onClick={() => setPage("membership")} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 15, cursor: "pointer" }}>
          View Memberships <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function AdminCard({ title, children }) {
  return (
    <div style={{ background: "#1a1530", border: "1px solid #2d2845", borderRadius: 12, padding: 18 }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#fff", margin: "0 0 14px" }}>{title}</h3>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SETTINGS MODAL
// ═══════════════════════════════════════════════════════════════
function SettingsModal({ onClose }) {
  const [notifClass, setNotifClass] = useState(true);
  const [notifCommunity, setNotifCommunity] = useState(true);
  const [notifEvents, setNotifEvents] = useState(true);
  const [notifReminders, setNotifReminders] = useState(false);

  const ToggleButton = ({ active, onClick }) => (
    <button onClick={onClick} style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: active ? T.accent : T.border, position: "relative", transition: "background 0.2s" }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: active ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,.15)" }} />
    </button>
  );

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 390, maxHeight: "85vh", overflow: "auto", padding: "20px 20px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, margin: 0 }}>Settings</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
        </div>
        <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>Profile</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#fff", fontWeight: 700 }}>SR</div>
            <div>
              <p style={{ fontWeight: 700, margin: 0, fontSize: 15 }}>Sasha Rivera</p>
              <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>Unlimited Member · Since Mar 2023</p>
            </div>
          </div>
        </div>
        <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>Notifications</h3>
          {[
            { label: "Class Reminders", active: notifClass, toggle: () => setNotifClass(!notifClass) },
            { label: "Community Milestones", active: notifCommunity, toggle: () => setNotifCommunity(!notifCommunity) },
            { label: "Events & Workshops", active: notifEvents, toggle: () => setNotifEvents(!notifEvents) },
            { label: "Practice Streak Reminders", active: notifReminders, toggle: () => setNotifReminders(!notifReminders) },
          ].map(n => (
            <div key={n.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
              <span style={{ fontSize: 14, color: T.text }}>{n.label}</span>
              <ToggleButton active={n.active} onClick={n.toggle} />
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 0" }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>About</h3>
          <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>{STUDIO_CONFIG.name} {STUDIO_CONFIG.subtitle} App v1.0</p>
          <p style={{ fontSize: 12, color: T.textFaint, margin: "4px 0 0" }}>Powered by Studio Platform</p>
        </div>
        <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", color: T.accent, fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 8 }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  NOTIFICATIONS MODAL
// ═══════════════════════════════════════════════════════════════
function NotificationsModal({ onClose }) {
  const notifications = [
    { id: "n1", type: "class", title: "Class Reminder", message: "DRYP Immersion with Avian starts in 1 hour", time: "30 min ago", read: false },
    { id: "n2", type: "community", title: "Nina C. hit a milestone!", message: "First Headstand! Celebrate with the community.", time: "2 hours ago", read: false },
    { id: "n3", type: "event", title: "DRYP After Dark", message: "Only 4 spots left for the Full Moon Flow on Apr 12.", time: "Yesterday", read: true },
    { id: "n4", type: "class", title: "Streak Alert", message: "14 days strong! Keep your streak alive tomorrow.", time: "Yesterday", read: true },
  ];

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 390, maxHeight: "80vh", overflow: "auto", padding: "20px 20px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, margin: 0 }}>Notifications</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notifications.map(n => (
            <div key={n.id} style={{ display: "flex", gap: 12, padding: "12px 14px", background: n.read ? "transparent" : T.accentGhost, border: `1px solid ${n.read ? T.borderLight : T.accentBorder}`, borderRadius: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: n.type === "class" ? T.accentGhost : n.type === "community" ? T.successGhost : T.warningGhost, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {n.type === "class" ? <Calendar size={16} color={T.accent} /> : n.type === "community" ? <Heart size={16} color={T.success} /> : <CalendarDays size={16} color={T.warning} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: n.read ? 500 : 700, color: T.text, margin: 0 }}>{n.title}</p>
                <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{n.message}</p>
                <p style={{ fontSize: 11, color: T.textFaint, margin: "4px 0 0" }}>{n.time}</p>
              </div>
              {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent, marginTop: 4, flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  RESERVATION CONFIRMATION MODAL
// ═══════════════════════════════════════════════════════════════
function ReservationModal({ classData, onConfirm, onClose }) {
  const [confirmed, setConfirmed] = useState(false);
  const [addedToCalendar, setAddedToCalendar] = useState(false);

  const totalReg = classData.registered + (classData.waitlist || 0);
  const isFull = totalReg >= classData.capacity;
  const spotsLeft = classData.capacity - classData.registered;
  const dateLabel = classData.date ? formatDateShort(classData.date) : classData.dayLabel || "This week";

  const handleConfirm = () => {
    setConfirmed(true);
    onConfirm(classData.id);
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 390, padding: "24px 20px 36px", animation: "slideUp 0.25s ease-out" }}>

        {!confirmed ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin: 0, color: T.text }}>Confirm Reservation</h2>
              <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} color={T.textMuted} /></button>
            </div>

            <div style={{ background: T.bgDim, borderRadius: 14, padding: "18px 16px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Calendar size={24} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: T.text, margin: "0 0 3px" }}>{classData.type}</h3>
                  <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>{classData.coach}</p>
                </div>
              </div>
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Clock size={16} color={T.textMuted} />
                  <span style={{ fontSize: 14, color: T.text }}>{fmtTime(classData.time)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CalendarDays size={16} color={T.textMuted} />
                  <span style={{ fontSize: 14, color: T.text }}>{dateLabel}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Users size={16} color={T.textMuted} />
                  <span style={{ fontSize: 14, color: isFull ? T.warning : spotsLeft <= 5 ? T.success : T.text }}>
                    {isFull ? `Full — you'll be added to the waitlist` : `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} remaining`}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <MapPin size={16} color={T.textMuted} />
                  <span style={{ fontSize: 14, color: T.text }}>900 Lenora St #128, Seattle</span>
                </div>
              </div>
            </div>

            <div style={{ background: T.accentGhost, border: `1px solid ${T.accentBorder}`, borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Info size={16} color={T.accent} />
                <span style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>Reminders</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <p style={{ fontSize: 12, color: "#5a5070", margin: 0, lineHeight: 1.4 }}>Arrive 10–15 minutes early. Complimentary mats provided.</p>
                <p style={{ fontSize: 12, color: "#5a5070", margin: 0, lineHeight: 1.4 }}>Cancel at least 2 hours before to avoid the late-cancel fee.</p>
                <p style={{ fontSize: 12, color: "#5a5070", margin: 0, lineHeight: 1.4 }}>The immersive studio is a phone-free space.</p>
              </div>
            </div>

            <button onClick={handleConfirm} style={{ width: "100%", padding: "14px 0", borderRadius: 10, border: "none", fontSize: 17, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', serif", letterSpacing: "0.03em", background: isFull ? T.success : T.accent, color: "#fff", marginBottom: 8 }}>
              {isFull ? "Join Waitlist" : "Confirm Reservation"}
            </button>
            <button onClick={onClose} style={{ width: "100%", padding: "12px 0", borderRadius: 10, border: `1px solid ${T.border}`, background: "transparent", fontSize: 14, fontWeight: 600, cursor: "pointer", color: T.textMuted }}>
              Cancel
            </button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Check size={32} color={T.accent} />
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin: "0 0 4px", color: T.text }}>
              {isFull ? "Added to Waitlist" : "You're In!"}
            </h2>
            <p style={{ fontSize: 14, color: T.textMuted, margin: "0 0 20px" }}>
              {isFull
                ? `We'll notify you if a spot opens for ${classData.type} at ${fmtTime(classData.time)}.`
                : `${classData.type} with ${classData.coach.split(" ")[0]} at ${fmtTime(classData.time)}. See you in the flow.`
              }
            </p>
            <div style={{ background: T.bgDim, borderRadius: 12, padding: "14px 16px", marginBottom: 16, textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: T.textMuted }}>Class</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{classData.type}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: T.textMuted }}>Teacher</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{classData.coach}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: T.textMuted }}>Time</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{fmtTime(classData.time)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: T.textMuted }}>Date</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{dateLabel}</span>
              </div>
            </div>
            <button onClick={() => setAddedToCalendar(true)} style={{ width: "100%", padding: "12px 0", borderRadius: 10, border: `1px solid ${addedToCalendar ? T.accentBorder : T.border}`, background: addedToCalendar ? T.accentGhost : "transparent", fontSize: 14, fontWeight: 600, cursor: "pointer", color: addedToCalendar ? T.accent : T.textMuted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
              {addedToCalendar ? <Check size={16} /> : <CalendarDays size={16} />}
              {addedToCalendar ? "Added to Calendar" : "Add to Calendar"}
            </button>
            <button onClick={onClose} style={{ width: "100%", padding: "14px 0", borderRadius: 10, border: "none", fontSize: 17, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', serif", letterSpacing: "0.03em", background: T.accent, color: "#fff" }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [showAdminToggle, setShowAdminToggle] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [classRegistrations, setClassRegistrations] = useState({});
  const [feedCelebrations, setFeedCelebrations] = useState({});
  const [reservationClass, setReservationClass] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const registerForClass = useCallback((classId) => {
    setClassRegistrations(prev => ({ ...prev, [classId]: (prev[classId] || 0) + 1 }));
    setReservationClass(null);
  }, []);

  const openReservation = useCallback((classData) => {
    setReservationClass(classData);
  }, []);

  const celebrateFeed = useCallback((feedId) => {
    setFeedCelebrations(prev => ({ ...prev, [feedId]: prev[feedId] ? 0 : 1 }));
  }, []);

  const handleLogoClick = useCallback(() => {
    const n = logoClicks + 1;
    setLogoClicks(n);
    if (n >= 5 && !showAdminToggle) setShowAdminToggle(true);
    setTimeout(() => setLogoClicks(0), 2000);
  }, [logoClicks, showAdminToggle]);

  const mainTabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "classes", label: "Classes", icon: Waves },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "practice", label: "Practice", icon: TrendingUp },
    { id: "more", label: "More", icon: Menu },
  ];

  const moreItems = [
    { id: "community", label: "Community", icon: Heart },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "membership", label: "Membership", icon: CreditCard },
    { id: "events", label: "Events", icon: CalendarDays },
  ];

  const adminTabs = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "admin-schedule", label: "Schedule", icon: Calendar },
    { id: "admin-members", label: "Members", icon: Users },
    { id: "admin-teachers", label: "Teachers", icon: UserCheck },
    { id: "admin-events", label: "Events", icon: CalendarDays },
    { id: "admin-pricing", label: "Pricing", icon: DollarSign },
    { id: "admin-broadcast", label: "Broadcast", icon: Megaphone },
  ];

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage />;
      case "classes": return <ClassesPage />;
      case "schedule": return <SchedulePage />;
      case "practice": return <PracticePage />;
      case "community": return <CommunityPage />;
      case "teachers": return <TeachersPage />;
      case "membership": return <MembershipPage />;
      case "events": return <EventsPage />;
      case "admin-dashboard": return <AdminDashboard />;
      case "admin-schedule": return <AdminSchedulePage />;
      case "admin-members": return <AdminMembersPage />;
      case "admin-teachers": return <AdminTeachersPage />;
      case "admin-events": return <AdminEventsPage />;
      case "admin-pricing": return <AdminPricingPage />;
      case "admin-broadcast": return <AdminBroadcastPage />;
      default: return <HomePage />;
    }
  };

  const isMoreActive = moreItems.some(item => item.id === page);
  const unreadCount = 2;

  // ——— ADMIN LAYOUT ———
  if (isAdmin) {
    return (
      <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", background: "#0f0d1a" }}>
          <aside style={{ width: 240, background: T.bg, color: "#fff", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 40 }}>
            <div style={{ padding: "20px 18px", borderBottom: "1px solid #2d2845" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img src={STUDIO_CONFIG.logoImage} alt={STUDIO_CONFIG.name} style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover" }} />
                <div>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, letterSpacing: "0.02em", display: "block", lineHeight: 1 }}>{STUDIO_CONFIG.name}</span>
                  <span style={{ fontSize: 10, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.15em" }}>Admin Portal</span>
                </div>
              </div>
            </div>
            <nav style={{ flex: 1, padding: "12px 8px", overflow: "auto" }}>
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#71717a", padding: "0 10px", margin: "0 0 8px" }}>Management</p>
              {adminTabs.map(tab => {
                const active = page === tab.id;
                return (
                  <button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: active ? T.accent : "transparent", color: active ? "#fff" : "#a1a1aa", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", marginBottom: 2, textAlign: "left" }}>
                    <tab.icon size={18} />
                    <span>{tab.label}</span>
                    {active && <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.6 }} />}
                  </button>
                );
              })}
            </nav>
            <div style={{ borderTop: "1px solid #2d2845", padding: "10px 8px" }}>
              <button onClick={() => { setIsAdmin(false); setPage("home"); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent", color: "#a1a1aa", fontSize: 13, cursor: "pointer", textAlign: "left" }}>
                <LogOut size={18} />
                <span>Exit Admin</span>
              </button>
            </div>
          </aside>
          <main style={{ flex: 1, marginLeft: 240, padding: 24, overflow: "auto" }}>
            {renderPage()}
          </main>
        </div>
      </AppContext.Provider>
    );
  }

  // ——— CONSUMER LAYOUT ———
  const mobileApp = (
    <div style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: T.bgDim, fontFamily: "'DM Sans', system-ui, sans-serif", position: "relative" }}>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 30, background: T.bg, color: "#fff", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={handleLogoClick} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
          <img src={STUDIO_CONFIG.logoImage} alt={STUDIO_CONFIG.name} style={{ width: 38, height: 38, borderRadius: 10, objectFit: "cover" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, lineHeight: 1, letterSpacing: "0.04em" }}>{STUDIO_CONFIG.name}</span>
            <span style={{ fontSize: 10, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.15em" }}>{STUDIO_CONFIG.subtitle}</span>
          </div>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <button aria-label="Admin panel" onClick={() => { setIsAdmin(true); setPage("admin-dashboard"); }} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: T.accent }}>
              <Shield size={20} />
            </button>
          <button aria-label="Notifications" onClick={() => setShowNotifications(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff", position: "relative" }}>
            <Bell size={20} />
            {unreadCount > 0 && <span style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: T.accent, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>{unreadCount}</span>}
          </button>
          <button aria-label="Settings" onClick={() => setShowSettings(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff" }}>
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Content */}
      <main style={{ paddingBottom: 80 }}>
        {renderPage()}
      </main>

      {/* More Menu */}
      {showMore && (
        <div onClick={() => setShowMore(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 40 }}>
          <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 68, left: 16, right: 16, maxWidth: 358, margin: "0 auto", background: T.bgCard, borderRadius: 16, padding: "14px 12px", boxShadow: "0 8px 32px rgba(0,0,0,.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 8px" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20 }}>More</span>
              <button onClick={() => setShowMore(false)} style={{ padding: 4, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}><X size={18} color={T.textMuted} /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {moreItems.map(item => {
                const active = page === item.id;
                return (
                  <button key={item.id} onClick={() => { setPage(item.id); setShowMore(false); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", borderRadius: 10, border: "none", cursor: "pointer", background: active ? T.accentGhost : T.bgDim, color: active ? T.accent : T.textMuted }}>
                    <item.icon size={22} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 30, background: T.bgCard, borderTop: `1px solid ${T.border}`, maxWidth: 390, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-around", padding: "6px 4px 10px" }}>
          {mainTabs.map(tab => {
            const active = tab.id === "more" ? (isMoreActive || showMore) : page === tab.id;
            if (tab.id === "more") {
              return (
                <button key={tab.id} onClick={() => setShowMore(true)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}>
                  <tab.icon size={20} strokeWidth={active ? 2.5 : 2} />
                  <span style={{ fontSize: 11, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
                </button>
              );
            }
            return (
              <button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}>
                <tab.icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span style={{ fontSize: 11, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Modals */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
      {reservationClass && <ReservationModal classData={reservationClass} onConfirm={registerForClass} onClose={() => setReservationClass(null)} />}
    </div>
  );

  return (
    <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
      {/* Presentation wrapper — visible on wide screens */}
      <div style={{ minHeight: "100vh", background: "#0c0a14", fontFamily: "'DM Sans', system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 48, padding: "40px 48px" }}>

        {/* Left — Sales Info */}
        <div className="demo-sidebar" style={{ width: 300, flexShrink: 0, color: "#fff" }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: T.accent, marginBottom: 16 }}>Prototype Demo</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <img src={STUDIO_CONFIG.logoImage} alt="" style={{ width: 48, height: 48, borderRadius: 12 }} />
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, margin: 0, letterSpacing: "0.02em" }}>{STUDIO_CONFIG.name}</h1>
              <p style={{ fontSize: 14, color: "#9ca3af", margin: 0 }}>Yoga Studio App</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 32 }}>
            {[
              { icon: Calendar, label: "Class Scheduling", desc: "Weekly schedule with real-time reservations" },
              { icon: Flame, label: "Practice Tracking", desc: "Reflections, streaks, and milestone badges" },
              { icon: Heart, label: "Community Feed", desc: "Member milestones and celebrations" },
              { icon: Users, label: "Teacher Profiles", desc: "Bios, certifications, and specialties" },
              { icon: CreditCard, label: "Membership Tiers", desc: "6 plans from intro to annual unlimited" },
              { icon: CalendarDays, label: "Events & Workshops", desc: "Special sessions and teacher training" },
              { icon: Bell, label: "Smart Notifications", desc: "Class reminders and streak alerts" },
              { icon: LayoutDashboard, label: "Admin Dashboard", desc: "Full analytics, CRM, and broadcast tools" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <item.icon size={16} color={T.accent} style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "#e5e7eb" }}>{item.label}</p>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: "#4b5563", marginTop: 32 }}>Built by Nimbus Theory</p>
        </div>

        {/* Center — Phone Frame */}
        <div className="demo-phone" style={{ width: 390, flexShrink: 0, height: "min(86vh, 780px)", borderRadius: 32, overflow: "hidden", boxShadow: "0 0 0 2px rgba(139,92,246,.3), 0 0 40px rgba(139,92,246,.3), 0 0 100px rgba(139,92,246,.2), 0 0 200px rgba(139,92,246,.12), 0 0 350px rgba(139,92,246,.06)", position: "relative" }}>
          <div style={{ width: "100%", height: "100%", overflow: "auto", borderRadius: 32 }}>
            {mobileApp}
          </div>
        </div>

        {/* Right — Feature Cards */}
        <div className="demo-sidebar" style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#1a1530", border: "1px solid #2d2845", borderRadius: 16, padding: "22px 20px" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${T.accent}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Shield size={18} color={T.accent} />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>Admin Dashboard</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: 0, lineHeight: 1.5 }}>Tap the shield icon in the app header to access the full admin suite — analytics, member CRM, scheduling, and broadcast tools.</p>
          </div>
          <div style={{ background: "#1a1530", border: "1px solid #2d2845", borderRadius: 16, padding: "22px 20px" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${T.success}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Sparkles size={18} color={T.success} />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>Built for DRYP</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: 0, lineHeight: 1.5 }}>Custom-designed around your brand, class types, teachers, and the immersive studio experience your members already love.</p>
          </div>
          <div style={{ background: "#1a1530", border: "1px solid #2d2845", borderRadius: 16, padding: "22px 20px" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${T.warning}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Zap size={18} color={T.warning} />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>MindBody Integration</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: 0, lineHeight: 1.5 }}>Connects directly with your existing MindBody setup for booking, payments, and member management — no workflow changes needed.</p>
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
}
