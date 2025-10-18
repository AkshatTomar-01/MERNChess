import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Target, Handshake, Calendar } from "lucide-react";
import { getCurrentUsername } from "@/lib/auth";
import type { UserProfile, GameWithPlayers } from "@shared/schema";

export default function Profile() {
  const [, setLocation] = useLocation();
  const currentUsername = getCurrentUsername();

  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: ["/api/auth/profile"],
  });

  const { data: allGames, isLoading: gamesLoading } = useQuery<GameWithPlayers[]>({
    queryKey: ["/api/game/history"],
  });

  const getInitials = (username?: string) => {
    if (!username) return "?";
    return username.substring(0, 2).toUpperCase();
  };

  const totalGames = (profile?.wins || 0) + (profile?.losses || 0) + (profile?.draws || 0);
  const winRate = totalGames > 0 ? Math.round(((profile?.wins || 0) / totalGames) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/dashboard")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {profileLoading ? (
              <div className="flex items-center gap-8">
                <Skeleton className="w-32 h-32 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-10 w-64" />
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <Avatar className="w-32 h-32 border-4 border-primary/20">
                  <AvatarFallback className="text-5xl font-bold bg-primary/10 text-primary">
                    {getInitials(profile?.username || currentUsername || undefined)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl font-bold mb-3" data-testid="text-username">
                    {profile?.username || currentUsername}
                  </h1>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
                    <Badge variant="secondary" className="gap-1">
                      <Calendar className="w-3 h-3" />
                      Joined {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Recently"}
                    </Badge>
                    <Badge variant="secondary">
                      {totalGames} Total Games
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Chess enthusiast • {winRate}% win rate
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Games</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-total-games">{totalGames}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Wins</CardTitle>
              <Trophy className="w-4 h-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-2" data-testid="text-wins">{profile?.wins || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Losses</CardTitle>
              <Target className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive" data-testid="text-losses">{profile?.losses || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Draws</CardTitle>
              <Handshake className="w-4 h-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-3" data-testid="text-draws">{profile?.draws || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Win Rate Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Performance</span>
                <span className="text-2xl font-bold text-primary">{winRate}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-500 rounded-full"
                  style={{ width: `${winRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game History */}
        <Card>
          <CardHeader>
            <CardTitle>Match History</CardTitle>
          </CardHeader>
          <CardContent>
            {gamesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : allGames && allGames.length > 0 ? (
              <div className="space-y-3">
                {allGames.slice(0, 10).map((game) => {
                  const isWinner = game.winnerId === profile?.id;
                  const isDraw = game.result === "draw";
                  
                  return (
                    <div
                      key={game.id}
                      className="flex items-center justify-between p-4 rounded-lg hover-elevate cursor-pointer border"
                      onClick={() => setLocation(`/game/${game.id}`)}
                      data-testid={`game-${game.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${isDraw ? 'bg-chart-3' : isWinner ? 'bg-chart-2' : 'bg-destructive'}`} />
                        <div>
                          <div className="font-medium capitalize">{game.mode} Game</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(game.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant={isDraw ? "secondary" : isWinner ? "default" : "destructive"}>
                        {isDraw ? "Draw" : isWinner ? "Won" : "Lost"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No games in history yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
