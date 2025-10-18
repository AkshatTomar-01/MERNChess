import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, LogIn } from "lucide-react";
import { motion } from "framer-motion";

interface GameCodeModalProps {
  onSubmit: (code?: string) => void;
  onCancel: () => void;
}

export default function GameCodeModal({ onSubmit, onCancel }: GameCodeModalProps) {
  const [joinCode, setJoinCode] = useState("");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Friendly Match</h1>
          <p className="text-muted-foreground">Create or join a game with friends</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="create" data-testid="tab-create">Create Game</TabsTrigger>
                <TabsTrigger value="join" data-testid="tab-join">Join Game</TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-4">
                <div className="text-center py-6">
                  <Plus className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Create New Game</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    A unique game code will be generated for you to share with your friend
                  </p>
                  <Button
                    className="w-full"
                    onClick={() => onSubmit()}
                    data-testid="button-create-game"
                  >
                    Create Game
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="join" className="space-y-4">
                <div className="py-4">
                  <LogIn className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2 text-center">Join Existing Game</h3>
                  <p className="text-sm text-muted-foreground mb-6 text-center">
                    Enter the game code shared by your friend
                  </p>
                  <Input
                    placeholder="Enter game code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="mb-4 font-mono text-center text-lg"
                    maxLength={6}
                    data-testid="input-game-code"
                  />
                  <Button
                    className="w-full"
                    onClick={() => onSubmit(joinCode)}
                    disabled={joinCode.length !== 6}
                    data-testid="button-join-game"
                  >
                    Join Game
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button variant="ghost" onClick={onCancel} data-testid="button-cancel">
            Cancel
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
