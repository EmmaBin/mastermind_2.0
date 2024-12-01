export default function Result({ correctNumber, correctLocation }) {
    return (
        <div>
            You have <span className="number">{correctNumber}</span> correct {correctNumber > 1 ? "numbers" : "number"}  and <span className="number">{correctLocation}</span> correct {correctLocation > 1 ? "locations" : "location"}.
        </div>
    )
}