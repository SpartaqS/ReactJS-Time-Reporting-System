import { useContext } from "react"
import UserContext from "../UserContext"

function Greeting() {
    const { username } = useContext(UserContext)
    const currentHour = new Date().getHours()
    if (username === undefined || username.length < 1) {
        return (<div></div>);
    }
    if (currentHour >= 12 && currentHour < 17) {
        return (
            <p className="navbar-brand">Good afternoon {username}.</p>
        )
    }
    else if (currentHour >= 17 || currentHour < 5) {
        return (
            <p className="navbar-brand">Good evening {username}.</p>
        )
    }
    return (
        <p className="navbar-brand">Good morning {username}.</p>
    )
}
export default Greeting