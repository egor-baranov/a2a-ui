import { useRef, useState, useEffect, ClipboardEvent, FormEvent } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PinInputProps {
	length?: number
	onComplete?: (value: string) => void
}

export function PinInput({ length = 6, onComplete }: PinInputProps) {
	const [values, setValues] = useState<string[]>(Array(length).fill(""))
	const inputsRef = useRef<HTMLInputElement[]>([])

	const handleChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value.replace(/\D/g, "").slice(-1)
		const next = [...values]
		next[idx] = val
		setValues(next)
		if (val && idx < length - 1) {
			inputsRef.current[idx + 1]?.focus()
		}
	}

	const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Backspace") {
			e.preventDefault()
			const next = [...values]
			if (values[idx]) {
				next[idx] = ""
				setValues(next)
			} else if (idx > 0) {
				inputsRef.current[idx - 1]?.focus()
				next[idx - 1] = ""
				setValues(next)
			}
		}
	}

	const handlePaste = (e: ClipboardEvent) => {
		e.preventDefault()
		const paste = e.clipboardData.getData("text").replace(/\D/g, "")
		if (!paste) return
		const chars = paste.slice(0, length).split("")
		const next = [...values]
		for (let i = 0; i < length; i++) {
			next[i] = chars[i] || ""
			if (chars[i]) {
				inputsRef.current[i]?.focus()
			}
		}
		setValues(next)
		// focus last pasted or next empty
		const firstEmpty = next.findIndex((v) => v === "")
		const focusIdx = firstEmpty === -1 ? length - 1 : firstEmpty
		inputsRef.current[focusIdx]?.focus()
	}

	useEffect(() => {
		if (values.every((v) => v !== "")) {
			onComplete?.(values.join(""))
		}
	}, [values, onComplete])

	return (
		<div className="flex space-x-2 items-center justify-center" onPaste={handlePaste}>
			{values.map((val, idx) => (
				<Input
					key={idx}
					ref={(el) => {
						if (el) inputsRef.current[idx] = el
					}}
					type="text"
					inputMode="numeric"
					maxLength={1}
					value={val}
					onChange={(e) => handleChange(idx, e)}
					onKeyDown={(e) => handleKeyDown(idx, e)}
					className="w-12 h-12 text-center text-lg font-medium border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300"
				/>
			))}
		</div>
	)
}