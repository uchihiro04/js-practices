const { DateTime } = require('luxon')
const argv = require('minimist')(process.argv.slice(2))

const year = (argv.y || DateTime.local().year)
const month = (argv.m || DateTime.local().month)

const date = DateTime.local(year, month)
const firstDay = date.startOf('month')
const lastDay = date.endOf('month')

const dayMargin = 3
const sunday = 7
const saturday = 6

console.log(date.toFormat('      M月 yyyy'))
console.log('日 月 火 水 木 金 土')

if (firstDay.weekday !== sunday) process.stdout.write(' '.repeat(dayMargin * firstDay.weekday))

for (let day = firstDay.day; day <= lastDay.day; day++) {
  const dayOfWeek = firstDay.plus({ days: day - 1 }).weekday
  process.stdout.write(day.toString().padStart(2) + ' ')
  if (dayOfWeek === saturday && day !== lastDay.day) process.stdout.write('\n')
  if (day === lastDay.day) process.stdout.write('\n\n')
}
