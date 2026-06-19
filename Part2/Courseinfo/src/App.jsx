const Course = ({ course }) => {
  const total_exercise = course.parts.reduce((sum, part) => {
    console.log('sum:', sum, 'part:', part)
    return sum + part.exercises
  }, 0)

  return (
    <div>
      <h1>{course.name}</h1>
      <div>
        {course.parts.map(core => (
          <p key={core.id}>
            {core.name} {core.exercises}
          </p>
        ))}
      </div>
      <div>Total of {total_exercise} exercises</div>
    </div>
  )
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      }
    ]
  }

  return <Course course={course} />
}

export default App