import {
  CatanEdgePosition,
  CatanTilePosition,
  Resource,
  CatanEdge,
  CatanVertexPosition,
  CatanTile,
  CatanVertex,
} from "@/lib/types";

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
  const tiles: CatanTilePosition[] = [];
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  // Define available tile types
  const tileTypes: Resource[] = ["TREE", "BRICK", "STONE", "WHEAT"];

  // Create a 3x3 grid of hexagons around center
  for (let q = -3; q <= 3; q++) {
    for (let r = -3; r <= 3; r++) {
      for (let s = -3; s <= 3; s++) {
        // q + r + s must equal 0 for valid hex coordinates
        if (q + r + s === 0) {
          const { x, y } = hexToPixel(q, r, s);
          tiles.push({
            data: {
              q,
              r,
              s,
              number: Math.floor(Math.random() * 11) + 2, // Random number token 2-12
              resource: tileTypes[Math.floor(Math.random() * tileTypes.length)], // Randomize tile type
            },
            x: centerX + x,
            y: centerY + y,
          });
        }
      }
    }
  }
  return tiles;
};

export const getCatanFacePositions = (
  dimensions: {
    width: number;
    height: number;
  },
  faces: CatanTile[]
) => {
  const tiles: CatanTilePosition[] = [];
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  faces.forEach((face) => {
    const { x, y } = hexToPixel(face.q, face.r, face.s);
    tiles.push({
      data: face,
      x: centerX + x,
      y: centerY + y,
    });
  });

  return tiles;
};

// Convert CatanEdge objects to CatanEdgePosition objects
export const getCatanEdgePositions = (
  dimensions: {
    width: number;
    height: number;
  },
  edges: CatanEdge[]
) => {
  const edgePositions: CatanEdgePosition[] = [];
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const size = 30; // Same size as used in hexToPixel

  edges.forEach((edge) => {
    // Calculate the center points of both hexagons connected by this edge
    const hex1Center = hexToPixel(edge.q1, edge.r1, edge.s1, size);
    const hex2Center = hexToPixel(edge.q2, edge.r2, edge.s2, size);

    // Calculate the edge direction (which side of the hexagon this edge represents)
    // We need to find which of the 6 directions this edge represents
    const directions = [
      { q: 1, r: -1, s: 0 }, // Top-Right
      { q: 1, r: 0, s: -1 }, // Right
      { q: 0, r: 1, s: -1 }, // Bottom-Right
      { q: -1, r: 1, s: 0 }, // Bottom-Left
      { q: -1, r: 0, s: 1 }, // Left
      { q: 0, r: -1, s: 1 }, // Top-Left
    ];

    // Find which direction this edge represents
    let direction = -1;
    for (let i = 0; i < directions.length; i++) {
      const dir = directions[i];
      if (
        edge.q2 - edge.q1 === dir.q &&
        edge.r2 - edge.r1 === dir.r &&
        edge.s2 - edge.s1 === dir.s
      ) {
        direction = i;
        break;
      }
    }

    if (direction !== -1) {
      // Calculate the two vertices of this edge
      const angle1 = ((direction * 60 - 90) * Math.PI) / 180;
      const angle2 = ((((direction + 1) % 6) * 60 - 90) * Math.PI) / 180;

      const startX = centerX + hex1Center.x + size * Math.cos(angle1);
      const startY = centerY + hex1Center.y + size * Math.sin(angle1);
      const endX = centerX + hex1Center.x + size * Math.cos(angle2);
      const endY = centerY + hex1Center.y + size * Math.sin(angle2);

      edgePositions.push({
        startX,
        startY,
        endX,
        endY,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`, // Random HSL color
        data: edge,
      });
    }
  });

  return edgePositions;
};

export const getCatanVertexPositions = (
  dimensions: { width: number; height: number },
  vertexData: CatanVertex[]
): CatanVertexPosition[] => {
  const result: CatanVertexPosition[] = [];
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const size = 30; // Same size as used in hexToPixel
  for (const vertex of vertexData) {
    const hexCenter = hexToPixel(vertex.q, vertex.r, vertex.s, size);
    const angle = (((vertex.direction - 1) * 60 - 90) * Math.PI) / 180;
    const vertexX = centerX + hexCenter.x + size * Math.cos(angle);
    const vertexY = centerY + hexCenter.y + size * Math.sin(angle);
    const roundedX = Math.round(vertexX * 100000) / 100000;
    const roundedY = Math.round(vertexY * 100000) / 100000;
    result.push({
      data: {
        direction: vertex.direction,
        q: vertex.q,
        r: vertex.r,
        s: vertex.s,
        hasHouse: vertex.hasHouse,
        hasSettlement: vertex.hasSettlement,
        owner: vertex.owner,
      },
      x: roundedX,
      y: roundedY,
    });
  }
  return result;
};

// Calculate all vertex coordinates for the hexagonal tiles
export const calculateVertices = (
  tiles: CatanTilePosition[]
): CatanVertexPosition[] => {
  const vertices = new Set<string>(); // Use Set to avoid duplicates
  const size = 30; // Same size as used in hexToPixel

  tiles.forEach((tile) => {
    // Calculate the 6 vertices of each hexagon
    for (let i = 0; i < 6; i++) {
      const angle = ((i * 60 - 90) * Math.PI) / 180; // 60 degrees per vertex
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
    return {
      x,
      y,
      data: {
        city: null,
        settlement: null,
      },
    };
  });
};

// Calculate all edges between vertices
export const calculateEdges = (
  tiles: CatanTilePosition[]
): CatanEdgePosition[] => {
  const edges = new Map<string, CatanEdgePosition>(); // Use Map to store edge data
  const size = 30; // Same size as used in hexToPixel

  // Helper function to get adjacent hexagon coordinates
  const getAdjacentHexes = (q: number, r: number, s: number) => {
    return [
      { q: q + 1, r: r - 1, s: s }, // Top-Right
      { q: q + 1, r: r, s: s - 1 }, // Right
      { q: q, r: r + 1, s: s - 1 }, // Bottom-Right
      { q: q - 1, r: r + 1, s: s }, // Bottom-Left
      { q: q - 1, r: r, s: s + 1 }, // left
      { q: q, r: r - 1, s: s + 1 }, // Top-left
    ];
  };

  // Helper function to create a consistent edge key between two faces
  const createEdgeKey = (
    face1: { q: number; r: number; s: number },
    face2: { q: number; r: number; s: number }
  ) => {
    // Sort the faces to ensure consistent key generation
    const sorted = [face1, face2].sort((a, b) => {
      if (a.q !== b.q) return a.q - b.q;
      if (a.r !== b.r) return a.r - b.r;
      return a.s - b.s;
    });
    return `${sorted[0].q},${sorted[0].r},${sorted[0].s}-${sorted[1].q},${sorted[1].r},${sorted[1].s}`;
  };

  tiles.forEach((tile) => {
    const { q, r, s } = tile.data;
    const adjacentHexes = getAdjacentHexes(q, r, s);

    // Check each adjacent position for a tile
    adjacentHexes.forEach((adjacent, direction) => {
      // Create edge key between these two faces
      const edgeKey = createEdgeKey(
        { q, r, s },
        { q: adjacent.q, r: adjacent.r, s: adjacent.s }
      );

      if (!edges.has(edgeKey)) {
        const vertices = calculateVertices([tile]);

        const startX = vertices[direction].x;
        const startY = vertices[direction].y;

        const endX = vertices[(direction + 1) % 6].x;
        const endY = vertices[(direction + 1) % 6].y;

        // Create the edge data
        const edgeData: CatanEdge = {
          q1: q,
          r1: r,
          s1: s,
          q2: adjacent.q,
          r2: adjacent.r,
          s2: adjacent.s,
          owner: null,
        };

        edges.set(edgeKey, {
          startX,
          startY,
          endX,
          endY,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`, // Random HSL color
          data: edgeData,
        });
      }
    });
  });

  return Array.from(edges.values());
};
