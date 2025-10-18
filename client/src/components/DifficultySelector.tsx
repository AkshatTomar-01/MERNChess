import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Zap, Target, Crown } from "lucide-react";
import { motion } from "framer-motion";

interface DifficultySelectorProps {
  onSelect: (difficulty: "easy" | "medium" | "hard") => void;
  onCancel: () => void;
}

export default function DifficultySelector({ onSelect, onCancel }: DifficultySelectorProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Select Difficulty</h1>
          <p className="text-muted-foreground">Choose your AI opponent's strength</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover-elevate cursor-pointer" onClick={() => onSelect("easy")}>
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-chart-2" />
              </div>
              <CardTitle>Easy</CardTitle>
              <CardDescription>Perfect for beginners</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" data-testid="button-difficulty-easy">
                Select Easy
              </Button>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer border-primary" onClick={() => onSelect("medium")}>
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Medium</CardTitle>
              <CardDescription>Balanced challenge</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" data-testid="button-difficulty-medium">
                Select Medium
              </Button>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" onClick={() => onSelect("hard")}>
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle>Hard</CardTitle>
              <CardDescription>For experienced players</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" data-testid="button-difficulty-hard">
                Select Hard
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button variant="ghost" onClick={onCancel} data-testid="button-cancel">
            Cancel
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
