"use client";

import { getQueryParamBoolean } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import type { XOR } from "ts-xor";

type Cell = {
  element: HTMLSpanElement;
  lastActivated: number;
  char?: string;
};

export type HiddenMessage = {
  message: string;
  length?: number;
} & XOR<
  { top: number },
  { bottom: number },
  { row: (rows: number) => number }
> &
  XOR<
    { left: number },
    { right: number },
    { col: (cols: number, length: number) => number }
  >;

export function AsciiBackground({ messages }: { messages: HiddenMessage[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const charactersRef = useRef<Cell[][]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const gridSizeRef = useRef({ cols: 0, rows: 0 });
  const cellSizeRef = useRef({ width: 10, height: 18 }); // Approximate size of monospace character
  const isInitializedRef = useRef(false);
  const isMouseMovingRef = useRef(false);
  const mouseMovementTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate a random ASCII character
  const getRandomChar = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()=[]{}|;:<>?/";
    return chars.charAt(Math.floor(Math.random() * chars.length));
  };

  // Initialize the grid
  useEffect(() => {
    if (!containerRef.current || isInitializedRef.current) return;
    isInitializedRef.current = true;

    const container = containerRef.current;
    const updateGridSize = () => {
      if (!container) return;

      // Clear previous grid
      container.innerHTML = "";

      // Calculate grid dimensions
      const cellWidth = cellSizeRef.current.width;
      const cellHeight = cellSizeRef.current.height;
      const cols = Math.ceil(window.innerWidth / cellWidth);
      const rows = Math.ceil(window.innerHeight / cellHeight);

      gridSizeRef.current = { cols, rows };

      // Create new grid
      const characters: Cell[][] = [];
      const fragment = document.createDocumentFragment();

      for (let y = 0; y < rows; y++) {
        const row: { element: HTMLSpanElement; lastActivated: number }[] = [];
        const rowElement = document.createElement("div");
        rowElement.style.height = `${cellHeight}px`;
        rowElement.className = "flex";

        for (let x = 0; x < cols; x++) {
          const span = document.createElement("span");
          span.textContent = " "; // Start with empty space
          span.style.width = `${cellWidth}px`;
          span.style.height = `${cellHeight}px`;
          span.style.display = "inline-block";
          span.className =
            "text-[12px] sm:text-xs opacity-0 transition-opacity duration-300";

          rowElement.appendChild(span);
          const cell: Cell = { element: span, lastActivated: 0 };
          row.push(cell);
        }

        fragment.appendChild(rowElement);
        characters.push(row);
      }

      const show = getQueryParamBoolean("s");

      // add hidden characters
      messages.forEach(({ message, row, col, length, ...position }) => {
        const len = length ?? message.length;

        const r = row
          ? row(rows)
          : position.top
          ? position.top
          : rows - 1 - (position.bottom ?? 0);

        const c = col
          ? col(cols, len)
          : position.left
          ? position.left
          : cols - len - (position.right ?? 0);

        for (let i = 0; i < message.length; i++) {
          const cell = characters[r]?.[c + i];
          if (cell && message[i] !== " ") {
            cell.char = message[i];
            if (show) {
              cell.element.textContent = message[i];
              cell.element.className = "text-[12px] sm:text-xs text-zinc-600";
            }
          }
        }
      });

      container.appendChild(fragment);
      charactersRef.current = characters;
    };

    // Initial setup
    updateGridSize();

    // Update on resize, but throttle it
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateGridSize, 300);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Handle mouse movement with throttling
  useEffect(() => {
    let lastUpdate = 0;
    const throttleTime = 10; // ms - reduced for faster response

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate > throttleTime) {
        setMousePosition({ x: e.clientX, y: e.clientY });
        lastUpdate = now;

        // Set mouse as moving
        isMouseMovingRef.current = true;

        // Clear any existing timer
        if (mouseMovementTimerRef.current) {
          clearTimeout(mouseMovementTimerRef.current);
        }

        // Set timer to mark mouse as stopped after a short delay
        mouseMovementTimerRef.current = setTimeout(() => {
          isMouseMovingRef.current = false;
        }, 100); // Short delay to detect when mouse stops
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (mouseMovementTimerRef.current) {
        clearTimeout(mouseMovementTimerRef.current);
      }
    };
  }, []);

  // Update characters based on mouse position
  useEffect(() => {
    if (charactersRef.current.length === 0) return;

    const updateCharacters = () => {
      // Only update if mouse is moving
      if (isMouseMovingRef.current) {
        const now = Date.now();
        const { x, y } = mousePosition;
        const { cols, rows } = gridSizeRef.current;
        const { width: cellWidth, height: cellHeight } = cellSizeRef.current;

        // Calculate grid position from mouse coordinates
        const gridX = Math.floor(x / cellWidth);
        const gridY = Math.floor(y / cellHeight);

        const sizeX = 8;
        const sizeY = 6;

        // Collect all cells in square area
        const cellsInArea: { row: number; col: number }[] = [];

        // Using a square area instead of circle (no Math.sqrt needed)
        for (
          let row = Math.max(0, gridY - sizeY);
          row < Math.min(rows, gridY + sizeY);
          row++
        ) {
          for (
            let col = Math.max(0, gridX - sizeX);
            col < Math.min(cols, gridX + sizeX);
            col++
          ) {
            cellsInArea.push({ row, col });
          }
        }

        // Randomly select 10% of cells in area
        const cellsToActivate = cellsInArea
          .sort(() => Math.random() - 0.5) // Shuffle
          .slice(0, Math.max(1, Math.floor(cellsInArea.length * 0.01))); // Take 10%

        if (charactersRef.current[gridY]?.[gridX].char) {
          cellsToActivate.push({ row: gridY, col: gridX });
        }

        // Update selected cells
        cellsToActivate.forEach(({ row, col }) => {
          const cell = charactersRef.current[row]?.[col];
          if (!cell) return;

          if (cell.char) {
            cell.element.textContent = cell.char;
            cell.element.className = "text-[12px] sm:text-xs text-zinc-200";

            setTimeout(() => {
              if (cell.element) {
                cell.element.className =
                  "text-[12px] sm:text-xs text-zinc-600 duration-1500";
              }
            }, 10000);

            return;
          }

          // Only activate if not recently activated
          if (now - cell.lastActivated > 100) {
            // Reduced cooldown
            cell.element.textContent = getRandomChar();
            cell.element.className = "text-[12px] sm:text-xs text-zinc-400";
            cell.lastActivated = now;

            // Change to dot after a shorter delay
            setTimeout(() => {
              if (cell.element) {
                cell.element.textContent = ".";
                cell.element.className = "text-[12px] sm:text-xs text-zinc-600";
              }
            }, 100); // Reduced delay

            setTimeout(() => {
              if (cell.element) {
                cell.element.className =
                  "text-[12px] sm:text-xs opacity-0 duration-1500";
              }
            }, 10000); // Reduced delay
          }
        });
      }

      animationFrameRef.current = requestAnimationFrame(updateCharacters);
    };

    animationFrameRef.current = requestAnimationFrame(updateCharacters);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePosition]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none font-mono text-center bg-black"
      aria-hidden="true"
    ></div>
  );
}
