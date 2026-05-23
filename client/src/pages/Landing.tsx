import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Users, BarChart3, Crown, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80 z-10" />
        </div>

        <div className="container mx-auto px-6 relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2">
                <Crown className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Premium Chess Experience</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight text-foreground">
                Master Chess
                <br />
                <span className="text-primary">Online</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-xl">
                Challenge powerful AI opponents, compete in real-time multiplayer matches, or play friendly games with your friends. Experience chess like never before.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/signup">
                  <Button size="lg" className="gap-2" data-testid="button-signup-hero">
                    <Zap className="w-5 h-5" />
                    Start Playing Free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" data-testid="button-login-hero">
                    Sign In
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-foreground">10K+</div>
                  <div className="text-sm text-muted-foreground">Active Players</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div>
                  <div className="text-3xl font-bold text-foreground">50K+</div>
                  <div className="text-sm text-muted-foreground">Games Played</div>
                </div>
              </div>
            </motion.div>

            <div className="hidden lg:block" />
          </div>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground">Everything you need to master chess</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="hover-elevate cursor-default">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">AI Opponent</h3>
                  <p className="text-muted-foreground">
                    Challenge Stockfish engine with adjustable difficulty. Perfect for practice and improving your skills.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="hover-elevate cursor-default">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center mb-6">
                    <Users className="w-6 h-6 text-chart-2" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Real-time Multiplayer</h3>
                  <p className="text-muted-foreground">
                    Play against opponents worldwide with instant move synchronization and integrated chat.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="hover-elevate cursor-default">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center mb-6">
                    <BarChart3 className="w-6 h-6 text-chart-3" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Match Analysis</h3>
                  <p className="text-muted-foreground">
                    Review your games, track your progress, and analyze every move to improve your gameplay.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Start playing in minutes</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-border z-0" style={{ width: '75%', left: '12.5%' }} />

            {[
              { num: 1, title: "Create Account", desc: "Sign up with username and password" },
              { num: 2, title: "Choose Mode", desc: "AI, Online, or Friendly match" },
              { num: 3, title: "Play Game", desc: "Make moves and enjoy the game" },
              { num: 4, title: "Review & Improve", desc: "Analyze matches and track stats" },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center relative z-10"
              >
                <div className="w-24 h-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-5xl font-bold">Ready to Play?</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of players worldwide and start your chess journey today
            </p>
            <Link href="/signup">
              <Button size="lg" className="gap-2 mt-6" data-testid="button-signup-cta">
                <Shield className="w-5 h-5" />
                Start Playing Free
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground pt-2">
              No credit card required • Free forever
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
