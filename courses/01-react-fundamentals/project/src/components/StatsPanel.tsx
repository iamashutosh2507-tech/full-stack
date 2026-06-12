interface StatsPanelProps {
  total?: number
  completed?: number
  active?: number
  overdue?: number
  completedPercentage?: number
}

export default function StatsPanel({
  total = 0,
  completed = 0,
  active = 0,
  overdue = 0,
  completedPercentage = 0,
}: StatsPanelProps) {
  return (
    <section id="stats-panel">
      <p>Total: {total}</p>
      <p>Completed: {completed}</p>
      <p>Active: {active}</p>
      <p>Overdue: {overdue}</p>
      <p>Completed Percentage: {completedPercentage}%</p>
    </section>
  )
}