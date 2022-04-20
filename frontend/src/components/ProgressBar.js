const ProgressBar = ({next_req, until_next, prev_req}) => {

  let percentage = null

  if (parseFloat(next_req) > parseFloat(until_next)) {
    percentage = (parseInt(next_req) - parseInt(until_next))/parseInt(next_req) * 100
  } else {
    percentage = 100
  }

  const progress = `${percentage}%`
  return (
    <div className="Bar-Container">
      <span className="label">Progress to Next Tier</span>
      <div className="Bar-Info">
        <span className="label">{`$${prev_req}`}</span>
        <span className="label">{`$${next_req}`}</span>
      </div>
      <div className="Bar-Base">
        <div className="Bar" style={{width: progress}}></div>
      </div>
      <div className="Bar-Info">
        <span className="label">Remaining: </span>
        {`$${until_next}`}
      </div>
    </div>
  )
}

export default ProgressBar
