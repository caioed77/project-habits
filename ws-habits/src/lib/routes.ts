import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from './prisma'
import dayjs from 'dayjs'


export async function appRoutes(app: FastifyInstance) {

  app.post('/habits', async (request) => {

    const createHabitBody = z.object({
      tittle: z.string(),
      WeekDays: z.array(
        z.number().min(0).max(6)
      )
    })

    const { tittle, WeekDays } = createHabitBody.parse(request.body)

    const today = dayjs().startOf('day').toDate()

    await prisma.habit.create({
      data: {
        tittle,
        created_at: today,
        WeekDays: {
          create: WeekDays.map(WeekDays => {
            return {
              week_day: WeekDays,
            }
          })
        }
      }
    })
  })

  app.get('/day', async (request) => {
    const getDaysParams = z.object({
      date: z.coerce.date()
    })

    const { date } = getDaysParams.parse(request.query)

    const parsedDate = dayjs(date).startOf('day')
    const weekDay = parsedDate.get('day')

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date,
        },
        WeekDays: {
          some: {
            week_day: weekDay,
          }
        }
      }
    })

    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate(),
      },

      include: {
        dayHabits: true
      }

    })

    const completeHabits = day?.dayHabits.map(dayHabit => {
      return dayHabit.habit_id
    })

    return {
      possibleHabits,
      completeHabits,
    }
  })

  app.patch('/habits/:id/toggle', async (request) => {
    const toggleHabitsParams = z.object({
      id: z.string().uuid(),
    })

    const { id } = toggleHabitsParams.parse(request.params)
    const today = dayjs().startOf('day').toDate()

    let day = await prisma.day.findUnique({
      where: {
        date: today,
      }
    })

    if (!day) {
      day = await prisma.day.create({
        data: {
          date: today,
        }
      })
    }

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id,
        }
      }
    })

    if (dayHabit) {
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id,
        }
      })
    } else {
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id,
        }
      })
    }
  })

  app.get('/summary', async () => {
    const summary = await prisma.$queryRaw`    
      select 
        d.id, 
        d.date,
        (select cast(count(*) as float) from days_habits dh where dh.day_id = d.id) as completed,        
        (select cast(count(*) as float) from habit_week_days hwd join habits H on H.id = hwd.habit_id where hwd.week_day = cast(strftime('%w', d.date/1000.0, 'unixepoch') as int) and H.created_at = d.date) as amount  
      from days d  
    `
    return summary

  })

}
