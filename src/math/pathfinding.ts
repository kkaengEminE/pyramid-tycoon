export interface GridNode {
  x: number;
  y: number;
  walkable: boolean;
}

interface AStarNode {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent: AStarNode | null;
}

export function aStar(
  grid: GridNode[][],
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): { x: number; y: number }[] | null {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  if (rows === 0 || cols === 0) return null;

  const open: AStarNode[] = [];
  const closed = new Set<string>();
  const key = (x: number, y: number) => `${x},${y}`;

  const heuristic = (x: number, y: number) => Math.abs(x - endX) + Math.abs(y - endY);

  const start: AStarNode = { x: startX, y: startY, g: 0, h: heuristic(startX, startY), f: 0, parent: null };
  start.f = start.h;
  open.push(start);

  const dirs = [
    [0, -1], [0, 1], [-1, 0], [1, 0],
  ];

  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift()!;
    const ck = key(current.x, current.y);

    if (current.x === endX && current.y === endY) {
      const path: { x: number; y: number }[] = [];
      let node: AStarNode | null = current;
      while (node) {
        path.unshift({ x: node.x, y: node.y });
        node = node.parent;
      }
      return path;
    }

    closed.add(ck);

    for (const [dx, dy] of dirs) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      if (!grid[ny][nx].walkable) continue;
      const nk = key(nx, ny);
      if (closed.has(nk)) continue;

      const g = current.g + 1;
      const existing = open.find(n => n.x === nx && n.y === ny);
      if (existing) {
        if (g < existing.g) {
          existing.g = g;
          existing.f = g + existing.h;
          existing.parent = current;
        }
      } else {
        const h = heuristic(nx, ny);
        open.push({ x: nx, y: ny, g, h, f: g + h, parent: current });
      }
    }
  }

  return null;
}
