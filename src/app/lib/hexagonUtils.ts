// CatanTile interface
export interface CatanTile {
  q: number;
  r: number;
  s: number;
  x: number;
  y: number;
  type: string;
  number: number | null;
}

// Convert q,r,s coordinates to x,y coordinates
export const hexToPixel = (
  q: number,
  r: number,
  s: number,
  size: number = 30
) => {
  const x = size * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
  const y = size * ((3 / 2) * r);
  return { x, y };
};

// Generate Catan map tiles in q,r,s coordinate system
export const generateCatanMap = (dimensions: {
  width: number;
  height: number;
}) => {
  const tiles: CatanTile[] = [];
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  // Define available tile types
  const tileTypes = ["forest", "brick", "stone", "wheat"];

  // Create a 3x3 grid of hexagons around center
  for (let q = -3; q <= 3; q++) {
    for (let r = -3; r <= 3; r++) {
      for (let s = -3; s <= 3; s++) {
        // q + r + s must equal 0 for valid hex coordinates
        if (q + r + s === 0) {
          const { x, y } = hexToPixel(q, r, s);
          tiles.push({
            q,
            r,
            s,
            x: centerX + x,
            y: centerY + y,
            type: tileTypes[Math.floor(Math.random() * tileTypes.length)], // Randomize tile type
            number: Math.floor(Math.random() * 6) + 2, // Random number token 2-7
          });
        }
      }
    }
  }
  return tiles;
};

// Calculate all vertex coordinates for the hexagonal tiles
export const calculateVertices = (tiles: CatanTile[]) => {
  const vertices = new Set<string>(); // Use Set to avoid duplicates
  const size = 30; // Same size as used in hexToPixel

  tiles.forEach((tile) => {
    // Calculate the 6 vertices of each hexagon
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 * Math.PI) / 180 + Math.PI / 6; // 60 degrees per vertex
      const vertexX = tile.x + size * Math.cos(angle);
      const vertexY = tile.y + size * Math.sin(angle);

      // Round to avoid floating point precision issues
      const roundedX = Math.round(vertexX * 100000) / 100000;
      const roundedY = Math.round(vertexY * 100000) / 100000;
      vertices.add(`${roundedX},${roundedY}`);
    }
  });

  // Convert back to array of coordinate objects
  return Array.from(vertices).map((coord) => {
    const [x, y] = coord.split(",").map(Number);
    return { x, y };
  });
};

// Calculate all edges between vertices
export const calculateEdges = (tiles: CatanTile[]) => {
  const edges = new Set<string>(); // Use Set to avoid duplicates
  const size = 30; // Same size as used in hexToPixel

  tiles.forEach((tile) => {
    // Calculate the 6 vertices of each hexagon
    for (let i = 0; i < 6; i++) {
      const angle1 = (i * 60 * Math.PI) / 180 + Math.PI / 6;
      const angle2 = (((i + 1) % 6) * 60 * Math.PI) / 180 + Math.PI / 6;

      const vertex1X = tile.x + size * Math.cos(angle1);
      const vertex1Y = tile.y + size * Math.sin(angle1);
      const vertex2X = tile.x + size * Math.cos(angle2);
      const vertex2Y = tile.y + size * Math.sin(angle2);

      // Round to avoid floating point precision issues
      const rounded1X = Math.round(vertex1X * 100000) / 100000;
      const rounded1Y = Math.round(vertex1Y * 100000) / 100000;
      const rounded2X = Math.round(vertex2X * 100000) / 100000;
      const rounded2Y = Math.round(vertex2Y * 100000) / 100000;

      // Create edge key ensuring consistent ordering
      const edgeKey =
        rounded1X < rounded2X ||
        (rounded1X === rounded2X && rounded1Y < rounded2Y)
          ? `${rounded1X},${rounded1Y}-${rounded2X},${rounded2Y}`
          : `${rounded2X},${rounded2Y}-${rounded1X},${rounded1Y}`;

      edges.add(edgeKey);
    }
  });

  // Convert back to array of edge objects
  return Array.from(edges).map((edge) => {
    const [start, end] = edge.split("-");
    const [startX, startY] = start.split(",").map(Number);
    const [endX, endY] = end.split(",").map(Number);
    return {
      startX,
      startY,
      endX,
      endY,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`, // Random HSL color
    };
  });
};
