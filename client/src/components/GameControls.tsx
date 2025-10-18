import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flag, Handshake, Trophy, Target } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface GameControlsProps {
  gameStatus: string;
  onResign: () => void;
  onOfferDraw: () => void;
  gameResult: string | null;
}

export default function GameControls({
  gameStatus,
  onResign,
  onOfferDraw,
  gameResult,
}: GameControlsProps) {
  const isFinished = gameStatus === "finished";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Game Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isFinished ? (
          <div className="text-center py-6">
            {gameResult === "draw" ? (
              <>
                <Handshake className="w-12 h-12 mx-auto mb-3 text-chart-3" />
                <h3 className="text-xl font-bold mb-2">Game Drawn</h3>
                <p className="text-sm text-muted-foreground">The game ended in a draw</p>
              </>
            ) : (
              <>
                <Trophy className="w-12 h-12 mx-auto mb-3 text-chart-2" />
                <h3 className="text-xl font-bold mb-2">Game Over</h3>
                <p className="text-sm text-muted-foreground">
                  {gameResult === "white" ? "White" : "Black"} wins!
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full gap-2" data-testid="button-resign">
                  <Flag className="w-4 h-4" />
                  Resign
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Resign Game?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to resign? This will count as a loss.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onResign} className="bg-destructive text-destructive-foreground">
                    Resign
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={onOfferDraw}
              data-testid="button-offer-draw"
            >
              <Handshake className="w-4 h-4" />
              Offer Draw
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
