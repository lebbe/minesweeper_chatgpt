import { StrictMode } from 'react'
import * as ReactDOMClient from 'react-dom/client'

import Minesweeper from './Minesweeper/Minesweeper'

const rootElement = document.getElementById('root')
const root = ReactDOMClient.createRoot(rootElement as HTMLElement)

root.render(
  <StrictMode>
    <Minesweeper />
  </StrictMode>
)
