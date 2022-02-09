import { useContext } from 'react'
import { Container, Stack, Button } from 'react-bootstrap'
import DateContext from '../DateContext'
import UserContext from '../UserContext'
import Greeting from './Greeting'

function Navbar() {
    const { username, setUsername } = useContext(UserContext)
    const { selectedDate, setDate } = useContext(DateContext)
    function handleLogout()
    {
        setUsername(undefined);
        setDate(new Date())
    }
    return (
        <div>
            <Container>
                <Stack className="justify-content-end" direction="horizontal" gap={3}>
                    <Greeting />
                    <Button variant="danger" onClick={handleLogout}> Log out</Button>
                </Stack>
            </Container>
        </div>
    )
}

export default Navbar