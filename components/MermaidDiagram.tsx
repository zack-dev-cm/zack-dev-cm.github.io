import React, { useMemo } from 'react';

interface MermaidDiagramProps {
  chart: string;
}

interface DiagramNode {
  id: string;
  label: string;
  layer: number;
  x: number;
  y: number;
}

interface DiagramEdge {
  source: string;
  target: string;
  label?: string;
}

const NODE_WIDTH = 190;
const NODE_HEIGHT = 76;
const LAYER_GAP = 90;
const ROW_GAP = 34;
const MARGIN = 28;

const cleanLabel = (value: string) =>
  value
    .trim()
    .replace(/^["'`]+|["'`]+$/g, '')
    .replace(/\s+/g, ' ');

const parseNodeExpression = (expression: string) => {
  const trimmed = expression.trim();
  const idMatch = trimmed.match(/^([A-Za-z0-9_]+)/);
  if (!idMatch) return null;

  const id = idMatch[1];
  const rawShape = trimmed.slice(id.length).trim();
  let label = id;

  if (rawShape) {
    const quoted = rawShape.match(/["'`](.*?)["'`]/);
    if (quoted) {
      label = quoted[1];
    } else {
      label = rawShape.replace(/^[\[\(\{]+|[\]\)\}]+$/g, '');
    }
  }

  return { id, label: cleanLabel(label) || id };
};

const splitMermaidLine = (line: string) => {
  const normalized = line.trim();
  const labeled = normalized.match(/^(.+?)\s*-->\|([^|]+)\|\s*(.+)$/);
  if (labeled) {
    return { source: labeled[1], label: cleanLabel(labeled[2]), target: labeled[3] };
  }

  const plain = normalized.match(/^(.+?)\s*-->\s*(.+)$/);
  if (plain) {
    return { source: plain[1], target: plain[2] };
  }

  return null;
};

const wrapLabel = (label: string) => {
  const words = label.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > 20 && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) lines.push(current);
  return lines.slice(0, 3);
};

const parseDiagram = (chart: string) => {
  const nodes = new Map<string, DiagramNode>();
  const edges: DiagramEdge[] = [];
  const direction = /\bflowchart\s+TB\b/i.test(chart) ? 'TB' : 'LR';

  const addNode = (expression: string) => {
    const parsed = parseNodeExpression(expression);
    if (!parsed) return null;
    if (!nodes.has(parsed.id)) {
      nodes.set(parsed.id, { id: parsed.id, label: parsed.label, layer: 0, x: 0, y: 0 });
    } else if (parsed.label !== parsed.id) {
      nodes.get(parsed.id)!.label = parsed.label;
    }
    return parsed.id;
  };

  chart
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      if (/^(flowchart|graph|subgraph|end\b)/i.test(line)) return;

      const edge = splitMermaidLine(line);
      if (edge) {
        const source = addNode(edge.source);
        const target = addNode(edge.target);
        if (source && target) edges.push({ source, target, label: edge.label });
        return;
      }

      addNode(line);
    });

  const incoming = new Map<string, number>();
  nodes.forEach((_, id) => incoming.set(id, 0));
  edges.forEach((edge) => incoming.set(edge.target, (incoming.get(edge.target) ?? 0) + 1));
  nodes.forEach((node, id) => {
    node.layer = incoming.get(id) === 0 ? 0 : 1;
  });

  for (let i = 0; i < nodes.size; i += 1) {
    let changed = false;
    edges.forEach((edge) => {
      const source = nodes.get(edge.source);
      const target = nodes.get(edge.target);
      if (!source || !target) return;
      const nextLayer = source.layer + 1;
      if (target.layer < nextLayer) {
        target.layer = nextLayer;
        changed = true;
      }
    });
    if (!changed) break;
  }

  const layers = new Map<number, DiagramNode[]>();
  nodes.forEach((node) => {
    const layerNodes = layers.get(node.layer) ?? [];
    layerNodes.push(node);
    layers.set(node.layer, layerNodes);
  });

  const orderedLayers = [...layers.entries()].sort(([a], [b]) => a - b);
  const maxLayerSize = Math.max(1, ...orderedLayers.map(([, layerNodes]) => layerNodes.length));
  const layerCount = Math.max(1, orderedLayers.length);
  const width =
    direction === 'LR'
      ? MARGIN * 2 + layerCount * NODE_WIDTH + (layerCount - 1) * LAYER_GAP
      : MARGIN * 2 + maxLayerSize * NODE_WIDTH + (maxLayerSize - 1) * LAYER_GAP;
  const height =
    direction === 'LR'
      ? MARGIN * 2 + maxLayerSize * NODE_HEIGHT + (maxLayerSize - 1) * ROW_GAP
      : MARGIN * 2 + layerCount * NODE_HEIGHT + (layerCount - 1) * LAYER_GAP;

  orderedLayers.forEach(([, layerNodes], layerIndex) => {
    const crossOffset =
      (maxLayerSize - layerNodes.length) * (direction === 'LR' ? NODE_HEIGHT + ROW_GAP : NODE_WIDTH + LAYER_GAP) * 0.5;

    layerNodes.forEach((node, nodeIndex) => {
      if (direction === 'LR') {
        node.x = MARGIN + layerIndex * (NODE_WIDTH + LAYER_GAP);
        node.y = MARGIN + crossOffset + nodeIndex * (NODE_HEIGHT + ROW_GAP);
      } else {
        node.x = MARGIN + crossOffset + nodeIndex * (NODE_WIDTH + LAYER_GAP);
        node.y = MARGIN + layerIndex * (NODE_HEIGHT + LAYER_GAP);
      }
    });
  });

  return { direction, width, height, nodes: [...nodes.values()], edges };
};

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const diagram = useMemo(() => parseDiagram(chart), [chart]);
  const nodeById = useMemo(() => new Map(diagram.nodes.map((node) => [node.id, node])), [diagram.nodes]);

  if (diagram.nodes.length === 0) {
    return <pre className="code-block code-block--mermaid">{chart}</pre>;
  }

  return (
    <div className="mermaid-visual" data-testid="mermaid-visual">
      <svg
        width={diagram.width}
        height={diagram.height}
        viewBox={`0 0 ${diagram.width} ${diagram.height}`}
        role="img"
        aria-label="Rendered architecture flowchart"
      >
        <defs>
          <marker id="diagram-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>

        {diagram.edges.map((edge, index) => {
          const source = nodeById.get(edge.source);
          const target = nodeById.get(edge.target);
          if (!source || !target) return null;

          const isHorizontal = diagram.direction === 'LR';
          const startX = isHorizontal ? source.x + NODE_WIDTH : source.x + NODE_WIDTH / 2;
          const startY = isHorizontal ? source.y + NODE_HEIGHT / 2 : source.y + NODE_HEIGHT;
          const endX = isHorizontal ? target.x : target.x + NODE_WIDTH / 2;
          const endY = isHorizontal ? target.y + NODE_HEIGHT / 2 : target.y;
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;
          const path = isHorizontal
            ? `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`
            : `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;

          return (
            <g key={`${edge.source}-${edge.target}-${index}`} className="mermaid-edge">
              <path d={path} markerEnd="url(#diagram-arrow)" />
              {edge.label && (
                <text x={midX} y={midY - 8} textAnchor="middle">
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {diagram.nodes.map((node) => {
          const lines = wrapLabel(node.label);
          const textStart = node.y + NODE_HEIGHT / 2 - (lines.length - 1) * 8;
          return (
            <g key={node.id} className="mermaid-node">
              <rect x={node.x} y={node.y} width={NODE_WIDTH} height={NODE_HEIGHT} rx="10" />
              <text x={node.x + NODE_WIDTH / 2} y={textStart} textAnchor="middle">
                {lines.map((line, index) => (
                  <tspan key={`${line}-${index}`} x={node.x + NODE_WIDTH / 2} dy={index === 0 ? 0 : 18}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
