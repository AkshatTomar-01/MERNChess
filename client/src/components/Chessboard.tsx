import { useState, useEffect } from "react";
import { Chess, Square, PieceSymbol, Color } from "chess.js";
import { motion, AnimatePresence } from "framer-motion";

interface ChessboardProps {
  game: Chess;
  onMove: (from: Square, to: Square, promotion?: string) => void;
  disabled?: boolean;
  orientation?: "white" | "black";
  highlightMoves?: boolean;
}

const pieceSymbols: Record<string, string> = {
  p: "♟",
  n: "♞",
  b: "♝",
  r: "♜",
  q: "♛",
  k: "♚",
  P: "♙",
  N: "♘",
  B: "♗",
  R: "♖",
  Q: "♕",
  K: "♔",
};

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

export default function Chessboard({
  game,
  onMove,
  disabled = false,
  orientation = "white",
  highlightMoves = true,
}: ChessboardProps) {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);

  const board = game.board();

  const handleSquareClick = (square: Square) => {
    if (disabled) return;

    if (selectedSquare) {
      const moves = game.moves({ square: selectedSquare, verbose: true });
      const move = moves.find((m) => m.to === square);

      if (move) {
        if (move.flags.includes("p")) {
          onMove(selectedSquare, square, "q");
        } else {
          onMove(selectedSquare, square);
        }
        setLastMove({ from: selectedSquare, to: square });
        setSelectedSquare(null);
        setLegalMoves([]);
      } else {
        const piece = game.get(square);
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(square);
          const moves = game.moves({ square, verbose: true });
          setLegalMoves(moves.map((m) => m.to as Square));
        } else {
          setSelectedSquare(null);
          setLegalMoves([]);
        }
      }
    } else {
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setLegalMoves(moves.map((m) => m.to as Square));
      }
    }
  };

  const getSquareColor = (file: number, rank: number) => {
    const isLight = (file + rank) % 2 === 0;
    return isLight ? "bg-[hsl(39,40%,85%)]" : "bg-[hsl(173,25%,45%)]";
  };

  const isHighlighted = (square: Square) => {
    return highlightMoves && legalMoves.includes(square);
  };

  const isSelected = (square: Square) => {
    return selectedSquare === square;
  };

  const isLastMove = (square: Square) => {
    return lastMove && (lastMove.from === square || lastMove.to === square);
  };

  const displayFiles = orientation === "white" ? files : [...files].reverse();
  const displayRanks = orientation === "white" ? ranks : [...ranks].reverse();

  return (
    <div className="relative">
      <div className="grid grid-cols-8 gap-0 border-2 border-border rounded-lg overflow-hidden shadow-xl relative">
        {displayRanks.map((rank, rankIndex) =>
          displayFiles.map((file, fileIndex) => {
            const square = `${file}${rank}` as Square;
            const piece = game.get(square);
            const isLight = (fileIndex + rankIndex) % 2 === 0;

            return (
              <motion.button
                key={square}
                onClick={() => handleSquareClick(square)}
                disabled={disabled}
                className={`
                  aspect-square relative flex items-center justify-center text-5xl md:text-6xl lg:text-7xl
                  transition-all duration-150
                  ${getSquareColor(fileIndex, rankIndex)}
                  ${isSelected(square) ? "ring-4 ring-primary ring-inset" : ""}
                  ${isLastMove(square) ? "bg-[hsl(38,92%,50%)]/20" : ""}
                  ${!disabled && piece && piece.color === game.turn() ? "cursor-pointer hover-elevate" : ""}
                  ${disabled ? "cursor-not-allowed" : ""}
                `}
                whileTap={!disabled ? { scale: 0.95 } : {}}
                data-testid={`square-${square}`}
              >
                {isHighlighted(square) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`absolute inset-0 flex items-center justify-center pointer-events-none`}
                  >
                    <div
                      className={`rounded-full ${
                        piece
                          ? "w-full h-full border-4 border-primary/40"
                          : "w-4 h-4 bg-primary/50"
                      }`}
                    />
                  </motion.div>
                )}

                <AnimatePresence mode="wait">
                  {piece && (
                    <motion.div
                      key={`${square}-${piece.type}-${piece.color}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className={`
                        select-none pointer-events-none
                        ${piece.color === "w" ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" : "text-gray-900 drop-shadow-[0_2px_4px_rgba(255,255,255,0.3)]"}
                      `}
                    >
                      {pieceSymbols[piece.type.toUpperCase()]}
                    </motion.div>
                  )}
                </AnimatePresence>

                {fileIndex === 0 && (
                  <span className="absolute left-1 top-1 text-xs font-mono font-semibold opacity-60 pointer-events-none select-none">
                    {rank}
                  </span>
                )}
                {rankIndex === displayRanks.length - 1 && (
                  <span className="absolute right-1 bottom-1 text-xs font-mono font-semibold opacity-60 pointer-events-none select-none">
                    {file}
                  </span>
                )}
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
}
