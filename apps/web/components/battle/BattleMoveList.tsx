import { Button } from "@/components/ui/Button";

interface Move {
  id: string;
  name: string;
}

export function BattleMoveList({
  moves,
  onSelect,
  disabled,
}: {
  moves: Move[];
  onSelect: (moveId: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {moves.map((m) => (
        <Button
          key={m.id}
          variant="secondary"
          disabled={disabled}
          onClick={() => onSelect(m.id)}
        >
          {m.name}
        </Button>
      ))}
    </div>
  );
}
