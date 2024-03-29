import { Check } from "phosphor-react";
import { FormEvent, useState } from "react";
import * as Checkbox from '@radix-ui/react-checkbox';

const availableWeekDays = [
	'Domingo',
	'Segunda-feira',
	'Terça-feira',
	'Quarta-feira',
	'Quinta-feira',
	'Sexta-feira',
	'Sabado'
]

export function NewHabitForm() {
	
	const [title, setTitle] = useState('');
	const [weekDays, setWeekDays ] = useState<number[]>([])

	function createNewHabit(event: FormEvent){
		event.preventDefault()
	}
	
	function handleToggleWeekDay(weekDay: number){
		if (weekDays.includes(weekDay)){
			const weekDaysWithRemovedOne = weekDays.filter(day => day === weekDay)

			setWeekDays(weekDaysWithRemovedOne)

		} else {
			const weekDaysWithAddedOne = [...weekDays, weekDay]

			setWeekDays(weekDaysWithAddedOne)
		}
	}


	return (
		<form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
			<label htmlFor="title" className="font-semibold leading-tight">
				Qual seu compromentimento
			</label>

			<input
				type="text"
				id="title"
				placeholder="ex.: Exercícios, dormir bem, etc..."
				className="p-4 rounded-lg mt-3 mb-3 bg-zinc-800 text-white placeholder:text-zinc-400"
				autoFocus
				onChange={event => setTitle(event.target.value)}
			/>

			<label htmlFor="">
				Qual a recorrência?
			</label>

			<div className="flex flex-col gap-2 mt-3">
				{availableWeekDays.map((weeDays, index) => {
					return (
						<Checkbox.Root 
						  key={weeDays}
							className="flex items-center gap-3 group"
							onCheckedChange={() => {
								handleToggleWeekDay(index)
							}}
						>

							<div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500">

								<Checkbox.CheckboxIndicator>
									<Check size={20} className="text-white" />
								</Checkbox.CheckboxIndicator>
							</div>

							<span className="text-white leading-tight">
								{weeDays}
							</span>
						</Checkbox.Root>
					)
				})}


			</div>

			<button type="submit" className="mt-4 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500">
				<Check size={20} weight="bold" />
				Confirmar
			</button>
		</form>
	)
}