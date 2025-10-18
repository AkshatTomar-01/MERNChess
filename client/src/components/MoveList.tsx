import { Chess } from "chess.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MoveListProps {
  game: Chess;
}

export default function MoveList({ game }: MoveListProps) {
  const history = game.history({ verbose: true });
  
  const movePairs: Array<{ white?: any; black?: any; moveNumber: number }> = [];
  
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      white: history[i],
      black: history[i + 1],
      moveNumber: Math.floor(i / 2) + 1,
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Move History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="p-4 space-y-1">
            {movePairs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No moves yet
              </p>
            ) : (
              movePairs.map((pair, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[40px_1fr_1fr] gap-2 p-2 rounded hover-elevate text-sm font-mono"
                  data-testid={`move-pair-${index}`}
                >
                  <span className="text-muted-foreground font-semibold">
                    {pair.moveNumber}.
                  </span>
                  <span className="font-medium">
                    {pair.white?.san}
                  </span>
                  <span className="font-medium">
                    {pair.black?.san || ""}
                  </span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
