const Balances = () => {

  const test = () => {
    const storedData = localStorage.getItem("users");
    if (storedData) {
      console.log(JSON.parse(storedData));
    }
  }

  return (
    <>
    <button onClick={test}>localstorage</button>
    </>
  )
}

export default Balances
