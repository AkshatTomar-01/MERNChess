import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Crown, Zap, Shield, Users, Bot, Swords, ChevronRight, Star, Globe, BarChart3, MessageSquare } from "lucide-react";

const FLOATING_PIECES = [
  { piece: "♔", x: "8%",  y: "15%", size: "5rem", delay: 0,    duration: 7  },
  { piece: "♛", x: "88%", y: "10%", size: "4rem", delay: 1,    duration: 9  },
  { piece: "♜", x: "5%",  y: "70%", size: "3.5rem",delay: 2,   duration: 8  },
  { piece: "♝", x: "92%", y: "65%", size: "4rem", delay: 0.5,  duration: 10 },
  { piece: "♞", x: "15%", y: "88%", size: "3rem", delay: 1.5,  duration: 7  },
  { piece: "♟", x: "80%", y: "85%", size: "3rem", delay: 3,    duration: 9  },
  { piece: "♚", x: "50%", y: "5%",  size: "3.5rem",delay: 2.5, duration: 11 },
  { piece: "♞", x: "72%", y: "40%", size: "2.5rem",delay: 1,   duration: 8  },
];

function FloatingPiece({ piece, x, y, size, delay, duration }: typeof FLOATING_PIECES[0]) {
  return (
    <motion.div
      className="absolute select-none pointer-events-none opacity-10 text-foreground"
      style={{ left: x, top: y, fontSize: size }}
      animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {piece}
    </motion.div>
  );
}

function AnimatedBoard() {
  const files = ["a","b","c","d","e","f","g","h"];
  const ranks = [8,7,6,5,4,3,2,1];
  const pieces: Record<string,string> = {
    a8:"♜",b8:"♞",c8:"♝",d8:"♛",e8:"♚",f8:"♝",g8:"♞",h8:"♜",
    a7:"♟",b7:"♟",c7:"♟",d7:"♟",e7:"♟",f7:"♟",g7:"♟",h7:"♟",
    a2:"♙",b2:"♙",c2:"♙",d2:"♙",e2:"♙",f2:"♙",g2:"♙",h2:"♙",
    a1:"♖",b1:"♘",c1:"♗",d1:"♕",e1:"♔",f1:"♗",g1:"♘",h1:"♖",
    e4:"♙",d5:"♟",c3:"♘",f6:"♞",
  };
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
      <motion.div
        initial={{ opacity: 0, rotateY: 15, scale: 0.9 }}
        animate={{ opacity: 1, rotateY: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative grid grid-cols-8 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{ width: "min(360px,85vw)", height: "min(360px,85vw)" }}
      >
        {ranks.map((rank,ri) => files.map((file,fi) => {
          const sq = `${file}${rank}`;
          const isLight = (ri+fi)%2===0;
          const piece = pieces[sq];
          const isWhite = piece && ["♔","♕","♖","♗","♘","♙"].includes(piece);
          return (
            <div key={sq} className={`flex items-center justify-center text-2xl ${isLight?"bg-[hsl(39,40%,82%)]":"bg-[hsl(173,25%,38%)]"}`}>
              {piece && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: (ri*8+fi)*0.008, duration: 0.25 }}
                  className={isWhite ? "drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]" : "drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)]"}
                >
                  {piece}
                </motion.span>
              )}
            </div>
          );
        }))}
      </motion.div>
    </div>
  );
}

const features = [
  { icon: Bot,          title: "AI Opponent",       desc: "Easy, Medium, Hard — train against a smart engine at your own pace.",          color: "text-primary",  bg: "bg-primary/10",  border: "border-primary/20"  },
  { icon: Globe,        title: "Online Multiplayer", desc: "Instant matchmaking with real players worldwide. Zero lag via WebSocket.",      color: "text-chart-2",  bg: "bg-chart-2/10",  border: "border-chart-2/20"  },
  { icon: Swords,       title: "Friendly Match",     desc: "Share a 6-char code with a friend and start a private game instantly.",        color: "text-chart-3",  bg: "bg-chart-3/10",  border: "border-chart-3/20"  },
  { icon: BarChart3,    title: "Match History",      desc: "Every game saved. Track wins, losses, draws and review your progress.",        color: "text-chart-5",  bg: "bg-chart-5/10",  border: "border-chart-5/20"  },
  { icon: MessageSquare,title: "In-Game Chat",       desc: "WhatsApp-style chat panel during multiplayer games. Talk trash, be nice.",     color: "text-chart-4",  bg: "bg-chart-4/10",  border: "border-chart-4/20"  },
  { icon: Shield,       title: "Secure & Fast",      desc: "JWT auth, bcrypt hashing, PostgreSQL. Your account is locked down tight.",     color: "text-primary",  bg: "bg-primary/10",  border: "border-primary/20"  },
];

const steps = [
  { num: "01", title: "Create Account",  desc: "Sign up in seconds — just a username and password." },
  { num: "02", title: "Pick Your Mode",  desc: "AI, Online matchmaking, or Friendly with a code."   },
  { num: "03", title: "Play Chess",      desc: "Make moves on a beautiful interactive board."        },
  { num: "04", title: "Track Progress",  desc: "See stats and match history on your profile."        },
];

const testimonials = [
  { name: "Arjun S.",  rating: 5, text: "The AI difficulty is spot on. Hard mode actually challenges me. Best free chess platform I've used."              },
  { name: "Priya M.",  rating: 5, text: "Played a friendly match with my brother across cities. The game code feature worked flawlessly."                  },
  { name: "Rahul K.",  rating: 5, text: "Clean UI, fast moves, no ads. The chat feature makes online games feel personal. Highly recommend."               },
];

const gameModes = [
  { icon: Bot,   title: "vs Computer",  subtitle: "Solo Practice",   desc: "Train against our AI engine. Easy, Medium, or Hard.",                                  color: "text-primary",  border: "border-primary/30",  grad: "from-primary/15 to-primary/5",   cta: "Play AI",     featured: false },
  { icon: Globe, title: "Online Match", subtitle: "Ranked Play",     desc: "Get matched with a real player instantly. Real-time WebSocket sync.",                  color: "text-chart-2",  border: "border-chart-2/40",  grad: "from-chart-2/15 to-chart-2/5",   cta: "Find Match",  featured: true  },
  { icon: Users, title: "Friendly",     subtitle: "Play with Friends",desc: "Generate a code, share it, and play a private game with anyone.",                     color: "text-chart-3",  border: "border-chart-3/30",  grad: "from-chart-3/15 to-chart-3/5",   cta: "Create Game", featured: false },
];

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/75 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">ChessMaster</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link href="/signup"><Button size="sm" className="gap-1.5">Get Started <ChevronRight className="w-3.5 h-3.5" /></Button></Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* ambient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ scale: [1,1.1,1], opacity: [0.4,0.6,0.4] }} transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
          <motion.div animate={{ scale: [1,1.15,1], opacity: [0.3,0.5,0.3] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-chart-2/10 rounded-full blur-3xl" />
        </div>

        {/* floating pieces */}
        {FLOATING_PIECES.map((p, i) => <FloatingPiece key={i} {...p} />)}

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center gap-12">

            {/* text */}
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6 max-w-3xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">Free to play · No credit card needed</span>
              </motion.div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.0] tracking-tight">
                Play Chess
                <br />
                <span className="text-primary relative">
                  Like a Pro
                  <motion.span
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/40 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                Challenge AI, compete worldwide, or invite friends.<br className="hidden md:block" />
                One platform. Infinite games.
              </p>

              <div className="flex flex-wrap gap-4 justify-center pt-2">
                <Link href="/signup">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Button size="lg" className="gap-2 text-base px-10 h-12 shadow-lg shadow-primary/25">
                      <Zap className="w-5 h-5" /> Start Playing Free
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/login">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Button size="lg" variant="outline" className="text-base px-10 h-12">Sign In</Button>
                  </motion.div>
                </Link>
              </div>

              {/* mini stats */}
              <div className="flex items-center justify-center gap-8 pt-4">
                {[["10K+","Players"],["50K+","Games"],["99.9%","Uptime"]].map(([v,l],i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i*0.1 }} className="text-center">
                    <div className="text-2xl font-bold">{v}</div>
                    <div className="text-xs text-muted-foreground">{l}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* board */}
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }}>
              <AnimatedBoard />
            </motion.div>
          </div>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-muted-foreground to-transparent" />
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="py-28">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Built for Chess Players</h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">Every feature designed to give you the best chess experience.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.07 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`p-6 rounded-2xl border ${f.border} bg-card transition-shadow hover:shadow-xl`}
              >
                <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="text-base font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-card/30 border-y border-border">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Up and Running in Minutes</h2>
            <p className="text-xl text-muted-foreground">No downloads. No setup. Just chess.</p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            {steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.12 }} className="text-center relative z-10">
                <motion.div whileHover={{ scale: 1.1, rotate: 3 }} className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-5 shadow-lg shadow-primary/30">
                  {step.num}
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GAME MODES */}
      <section className="py-28">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Game Modes</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Three Ways to Play</h2>
            <p className="text-xl text-muted-foreground">Pick your battle.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {gameModes.map((mode, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`relative p-8 rounded-2xl border ${mode.border} bg-gradient-to-b ${mode.grad} ${mode.featured ? "ring-2 ring-chart-2/50 scale-105" : ""}`}
              >
                {mode.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-chart-2 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}
                <mode.icon className={`w-10 h-10 ${mode.color} mb-4`} />
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{mode.subtitle}</div>
                <h3 className="text-xl font-bold mb-3">{mode.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{mode.desc}</p>
                <Link href="/signup">
                  <Button className="w-full" variant={mode.featured ? "default" : "outline"}>{mode.cta}</Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-card/30 border-y border-border">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Players Love It</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl border border-border bg-card"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_,j) => <Star key={j} className="w-4 h-4 fill-chart-3 text-chart-3" />)}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary">{t.name[0]}</div>
                  <span className="font-medium text-sm">{t.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-chart-2/10 p-16 text-center overflow-hidden max-w-3xl mx-auto"
          >
            <div className="absolute inset-0 pointer-events-none">
              <motion.div animate={{ scale: [1,1.2,1], opacity: [0.3,0.5,0.3] }} transition={{ duration: 6, repeat: Infinity }}
                className="absolute top-0 left-1/4 w-64 h-64 bg-primary/15 rounded-full blur-3xl" />
              <motion.div animate={{ scale: [1,1.15,1], opacity: [0.2,0.4,0.2] }} transition={{ duration: 8, repeat: Infinity, delay: 2 }}
                className="absolute bottom-0 right-1/4 w-64 h-64 bg-chart-2/15 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 space-y-6">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="text-7xl">♟</motion.div>
              <h2 className="text-5xl md:text-6xl font-bold">Your Move.</h2>
              <p className="text-xl text-muted-foreground">Join thousands of players. Free forever.</p>
              <div className="flex flex-wrap gap-4 justify-center pt-2">
                <Link href="/signup">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                    <Button size="lg" className="gap-2 text-base px-10 h-12 shadow-lg shadow-primary/25">
                      <Zap className="w-5 h-5" /> Create Free Account
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="text-base px-10 h-12">Sign In</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            <span className="font-bold">ChessMaster</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 ChessMaster. Built with React, Node.js & PostgreSQL.</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/signup"><span className="hover:text-foreground transition-colors cursor-pointer">Sign Up</span></Link>
            <Link href="/login"><span className="hover:text-foreground transition-colors cursor-pointer">Login</span></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
