import style from './Controls.module.css'
type Props = {
  width: number
  height: number
  mines: number
  setWidth: (width: number) => void
  setHeight: (height: number) => void
  setMines: (mines: number) => void
  startNewGame: () => void
}

export default function Controls({
  width,
  height,
  mines,
  setWidth,
  setHeight,
  setMines,
  startNewGame,
}: Props) {
  return (
    <div className={style.controls}>
      <button onClick={startNewGame}>New game</button>
      <InputContainer>
        Width
        <NumberInput value={width} setValue={setWidth} />
      </InputContainer>
      <InputContainer>
        Height
        <NumberInput value={height} setValue={setHeight} />
      </InputContainer>
      <InputContainer>
        Mines
        <NumberInput value={mines} setValue={setMines} />
      </InputContainer>
    </div>
  )
}

function InputContainer({ children }: { children: React.ReactNode }) {
  return <label className={style.inputContainer}>{children}</label>
}

function NumberInput({
  value,
  setValue,
}: {
  value: number
  setValue: (value: number) => void
}) {
  return (
    <input
      className={style.input}
      type="number"
      value={value}
      onChange={(e) => setValue(parseInt(e.target.value))}
    />
  )
}
