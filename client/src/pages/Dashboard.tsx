import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Target, Handshake, Bot, Users, Swords, LogOut, User } from "lucide-react";
import { getCurrentUserId, removeToken, getCurrentUsername } from "@/lib/auth";
import type { UserProfile, GameWithPlayers } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const currentUserId = getCurrentUserId();
  const currentUsername = getCurrentUsername();

  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: ["/api/auth/profile"],
  });

  const { data: recentGames, isLoading: gamesLoading } = useQuery<GameWithPlayers[]>({
    queryKey: ["/api/game/recent"],
  });

  const handleLogout = () => {
    removeToken();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    setLocation("/");
  };

  const getInitials = (username?: string) => {
    if (!username) return "?";
    return username.substring(0, 2).toUpperCase();
  };

  const getResultBadge = (game: GameWithPlayers) => {
    if (!game.result) return null;
    
    const isWinner = game.winnerId === currentUserId;
    const isDraw = game.result === "draw";
    
    if (isDraw) {
      return <Badge variant="secondary" className="bg-chart-3/20 text-chart-3 border-chart-3/30" data-testid={`badge-result-${game.id}`}>Draw</Badge>;
    }
    
    return isWinner ? (
      <Badge variant="secondary" className="bg-chart-2/20 text-chart-2 border-chart-2/30" data-testid={`badge-result-${game.id}`}>Won</Badge>
    ) : (
      <Badge variant="secondary" className="bg-destructive/20 text-destructive border-destructive/30" data-testid={`badge-result-${game.id}`}>Lost</Badge>
    );
  };

  const getOpponentName = (game: GameWithPlayers) => {
    if (game.mode === "ai") return "Stockfish AI";
    if (game.player1Id === currentUserId) return game.player2?.username || "Waiting...";
    return game.player1?.username || "Waiting...";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">ChessMaster</span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/profile")}
                data-testid="button-profile"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          {profileLoading ? (
            <div className="flex items-center gap-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                  {getInitials(profile?.username || currentUsername || undefined)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold mb-2" data-testid="text-username">
                  {profile?.username || currentUsername}
                </h1>
                <p className="text-muted-foreground">Ready to play your next game?</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {profileLoading ? (
            <>
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </>
          ) : (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Wins</span>
                    <Trophy className="w-5 h-5 text-chart-2" />
                  </div>
                  <div className="text-4xl font-bold text-chart-2" data-testid="text-wins">{profile?.wins || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Losses</span>
                    <Target className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="text-4xl font-bold text-destructive" data-testid="text-losses">{profile?.losses || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Draws</span>
                    <Handshake className="w-5 h-5 text-chart-3" />
                  </div>
                  <div className="text-4xl font-bold text-chart-3" data-testid="text-draws">{profile?.draws || 0}</div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Start New Game</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover-elevate cursor-pointer" onClick={() => setLocation("/game/ai")}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="mb-2">Play vs Computer</CardTitle>
                <CardDescription>Challenge Stockfish AI with adjustable difficulty</CardDescription>
                <Button className="w-full mt-4" data-testid="button-play-ai">
                  Play AI
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-elevate cursor-pointer" onClick={() => setLocation("/game/online")}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-chart-2" />
                </div>
                <CardTitle className="mb-2">Play vs Human</CardTitle>
                <CardDescription>Match with online players in real-time</CardDescription>
                <Button className="w-full mt-4" data-testid="button-play-online">
                  Find Match
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-elevate cursor-pointer" onClick={() => setLocation("/game/friendly")}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-chart-3/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Swords className="w-8 h-8 text-chart-3" />
                </div>
                <CardTitle className="mb-2">Friendly Match</CardTitle>
                <CardDescription>Create or join a game with a code</CardDescription>
                <Button className="w-full mt-4" data-testid="button-play-friendly">
                  Create/Join
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Matches</h2>
          <Card>
            <CardContent className="p-6">
              {gamesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-12 flex-1" />
                    </div>
                  ))}
                </div>
              ) : recentGames && recentGames.length > 0 ? (
                <div className="space-y-4">
                  {recentGames.map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between p-4 rounded-lg hover-elevate cursor-pointer border"
                      onClick={() => setLocation(`/game/${game.id}`)}
                      data-testid={`game-${game.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-muted text-muted-foreground">
                            {getInitials(getOpponentName(game))}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{getOpponentName(game)}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(game.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="capitalize">
                          {game.mode}
                        </Badge>
                        {getResultBadge(game)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No games played yet. Start your first match!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
