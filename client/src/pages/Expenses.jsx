const Expenses = ({array}) => {
  return (
    <>
      <h1>Expenses</h1>
      <ul>
        {array.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </>
  )
}

export default Expenses
