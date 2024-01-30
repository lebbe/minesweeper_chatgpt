import { useEffect, useState } from 'react'

import style from './Minesweeper.module.css'
import Controls from '../Controls/Controls'

type Cell = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  adjacentMines: number
}

type GameStatus = 'ongoing' | 'won' | 'lost' | 'not-started'

export default function Minesweeper() {
  const [grid, setGrid] = useState<Cell[][]>([])
  const [gameStatus, setGameStatus] = useState<GameStatus>('not-started')
  const [width, setWidth] = useState(10)
  const [height, setHeight] = useState(10)
  const [mines, setMines] = useState(10)

  useEffect(() => {
    startNewGame()
  }, [])

  function startNewGame() {
    initializeGrid()
    setGameStatus('ongoing')
  }

  function initializeGrid() {
    // Initialize grid with empty cells
    const newGrid: Cell[][] = Array(height)
      .fill(null)
      .map(() =>
        Array(width)
          .fill(null)
          .map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            adjacentMines: 0,
          }))
      )

    // Randomly plant mines
    let mineCount = 0
    while (mineCount < mines) {
      const randomRow = Math.floor(Math.random() * height)
      const randomCol = Math.floor(Math.random() * width)
      if (!newGrid[randomRow][randomCol].isMine) {
        newGrid[randomRow][randomCol].isMine = true
        mineCount++
      }
    }

    // Calculate adjacent mines for each cell
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        if (!newGrid[row][col].isMine) {
          newGrid[row][col].adjacentMines = getAdjacentMines(newGrid, row, col)
        }
      }
    }

    setGrid(newGrid)
  }

  function getAdjacentMines(grid: Cell[][], row: number, col: number): number {
    const adjacentCells = [
      [row - 1, col - 1],
      [row - 1, col],
      [row - 1, col + 1],
      [row, col - 1],
      [row, col + 1],
      [row + 1, col - 1],
      [row + 1, col],
      [row + 1, col + 1],
    ]

    return adjacentCells.reduce((count, [r, c]) => {
      if (r >= 0 && r < height && c >= 0 && c < width && grid[r][c].isMine) {
        count++
      }
      return count
    }, 0)
  }

  function handleCellClick(row: number, col: number) {
    if (gameStatus !== 'ongoing') return
    function revealCell(grid: Cell[][], row: number, col: number) {
      const cell = grid[row][col]
      if (cell.isRevealed || cell.isFlagged) {
        return
      }

      cell.isRevealed = true

      // If the cell has no adjacent mines, recursively reveal its neighbors
      if (cell.adjacentMines === 0) {
        const adjacentCells = [
          [row - 1, col - 1],
          [row - 1, col],
          [row - 1, col + 1],
          [row, col - 1],
          [row, col + 1],
          [row + 1, col - 1],
          [row + 1, col],
          [row + 1, col + 1],
        ]

        adjacentCells.forEach(([r, c]) => {
          if (
            r >= 0 &&
            r < height &&
            c >= 0 &&
            c < width &&
            !grid[r][c].isRevealed
          ) {
            revealCell(grid, r, c)
          }
        })
      }
    }

    const newGrid = [...grid]
    const cell = newGrid[row][col]

    if (cell.isFlagged || cell.isRevealed) {
      return
    }

    if (cell.isMine) {
      // Reveal all mines if a mine is clicked
      for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
          if (newGrid[r][c].isMine) {
            newGrid[r][c].isRevealed = true
          }
        }
      }
      // Game over logic can be implemented here
      setGameStatus('lost')
    } else {
      revealCell(newGrid, row, col)
      // Check if game is won here
      setGameStatus('ongoing')

      // Check if game is won here
      let win = true
      for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
          if (!newGrid[r][c].isMine && !newGrid[r][c].isRevealed) {
            win = false
          }
        }
      }
      if (win) {
        setGameStatus('won')
        // Flag all mines if the game is won
        for (let r = 0; r < height; r++) {
          for (let c = 0; c < width; c++) {
            if (newGrid[r][c].isMine) {
              newGrid[r][c].isFlagged = true
            }
          }
        }
      }
    }

    setGrid(newGrid)
  }

  function handleRightClick(row: number, col: number, event: React.MouseEvent) {
    if (gameStatus !== 'ongoing') return
    event.preventDefault()

    const newGrid = [...grid]
    const cell = newGrid[row][col]

    if (!cell.isRevealed) {
      cell.isFlagged = !cell.isFlagged
    }

    setGrid(newGrid)
  }

  return (
    <div>
      <GameStatus gameStatus={gameStatus} />
      {grid.map((row, rowIndex) => (
        <div style={{ display: 'flex' }} key={rowIndex}>
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onContextMenu={(e) => handleRightClick(rowIndex, colIndex, e)}
            >
              <CellComponent cell={cell} />
            </div>
          ))}
        </div>
      ))}

      <Controls
        width={width}
        height={height}
        mines={mines}
        setWidth={setWidth}
        setHeight={setHeight}
        setMines={setMines}
        startNewGame={startNewGame}
      />
    </div>
  )
}

type CellProps = {
  cell: Cell
}

function CellComponent({ cell }: CellProps) {
  let content = ''
  if (cell.isRevealed) {
    if (cell.isMine) {
      content = '💣'
    } else if (cell.adjacentMines > 0) {
      content = cell.adjacentMines.toString() || '0'
    } else {
      content = '0'
    }
  } else if (cell.isFlagged) {
    content = '🚩'
  } else {
    content = ' '
  }

  return (
    <span
      className={style.cell + (cell.isRevealed ? ' ' + style.revealed : '')}
    >
      {content || 'W'}
    </span>
  )
}

type GameStatusProps = {
  gameStatus: GameStatus
}

function GameStatus({ gameStatus }: GameStatusProps) {
  if (gameStatus === 'won') {
    return <div className={style.statusWon}>Hooray!</div>
  } else if (gameStatus === 'lost') {
    return <div className={style.statusLost}>Boo</div>
  } else {
    return <div className={style.statusOngoing}>Click a square</div>
  }
}
