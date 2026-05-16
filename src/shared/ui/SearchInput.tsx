import { Input } from '@/components/ui/input'
import { useDebounce } from '@/shared/hooks/use-debounce'
import { useEffect, useState } from 'react'

interface SearchInputProps {
  placeholder?: string
  onDebouncedChange: (value: string) => void
}

export function SearchInput({ placeholder = 'Rechercher...', onDebouncedChange }: SearchInputProps) {
  const [value, setValue] = useState('')
  const debounced = useDebounce(value)

  useEffect(() => {
    onDebouncedChange(debounced)
  }, [debounced, onDebouncedChange])

  return <Input value={value} onChange={(event) => setValue(event.target.value)} placeholder={placeholder} />
}

