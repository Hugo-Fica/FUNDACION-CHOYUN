import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/utils/calculate'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from './ui/button'
import { Clock } from 'lucide-react'

type TimePickerProps = {
  onTimeChange?: (time: string) => void
}

export const HourPicker = ({ onTimeChange }: TimePickerProps) => {
  const [openHour, setOpenHour] = useState(false)
  const [hour, setHour] = useState<string>('')
  const [minute, setMinute] = useState<string>('')
  const [period, setPeriod] = useState<string>('')

  const hours = Array.from({ length: 12 }, (_, i) => {
    const hourValue = (i + 1).toString()
    return hourValue.length === 1 ? `0${hourValue}` : hourValue
  })

  const minutes = Array.from({ length: 60 }, (_, i) => {
    const minuteValue = i.toString()
    return minuteValue.length === 1 ? `0${minuteValue}` : minuteValue
  })

  const handleTimeChange = (type: 'hour' | 'minute' | 'period', value: string) => {
    if (type === 'hour') {
      setHour(value)
    } else if (type === 'minute') {
      setMinute(value)
    } else {
      setPeriod(value)
    }
  }

  const handleHourChange = () => {
    if (onTimeChange) {
      onTimeChange(`${hour}:${minute} ${period}`)
      setOpenHour(false)
    }
  }

  return (
    <Popover
      open={openHour}
      onOpenChange={setOpenHour}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'w-full justify-start text-left font-normal',
            !hour && 'text-muted-foreground'
          )}>
          <Clock className='mr-2 h-4 w-4' />
          {hour && minute ? (
            <span>
              {hour}:{minute} {period}
            </span>
          ) : (
            <span>Seleccione un horario</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-auto p-4'
        align='start'>
        <div className='flex items-center space-x-2'>
          <div className='grid gap-1'>
            <div className='flex items-center'>
              <Select
                value={hour}
                onValueChange={(value) => handleTimeChange('hour', value)}>
                <SelectTrigger className='w-[80px]'>
                  <SelectValue placeholder='Hora' />
                </SelectTrigger>
                <SelectContent className='h-[15rem]'>
                  {hours.map((h) => (
                    <SelectItem
                      key={h}
                      value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className='mx-2'>:</span>
              <Select
                value={minute}
                onValueChange={(value) => handleTimeChange('minute', value)}>
                <SelectTrigger className='w-[80px]'>
                  <SelectValue placeholder='Minutos' />
                </SelectTrigger>
                <SelectContent className='h-[15rem]'>
                  {minutes.map((m) => (
                    <SelectItem
                      key={m}
                      value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={period}
                onValueChange={(value) => handleTimeChange('period', value)}>
                <SelectTrigger className='ml-2 w-[80px]'>
                  <SelectValue placeholder='AM/PM' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='AM'>AM</SelectItem>
                  <SelectItem value='PM'>PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className='mt-4 flex justify-end'>
          <Button
            size='sm'
            onClick={handleHourChange}>
            Listo
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
