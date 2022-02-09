import React, { useState, useEffect, useContext } from 'react';
import { Button, Form, Card, Container, Stack } from 'react-bootstrap';

import { useNavigate, useParams } from "react-router-dom";
import FormatDate from '../FormatDate'
import DateContext from '../DateContext';
import UserContext from '../UserContext';

function EntryDetails(props) {   // in props pass entry related data
    let navigate = useNavigate();
    const {username, setUsername} = useContext(UserContext);
    const [localUsername, setLocalUsername] = useState({});
    const {selectedDate} = useContext(DateContext);
    const [errors, setErrors] = useState({});
    setUsername("");
    function handleChange(value)
    {
        setLocalUsername(value);
    }

    function handleLogin() { // set username
        const currentErrors = validateLogin();
        if (Object.keys(currentErrors).length > 0) {// something not correct, do not send to server
            setErrors(currentErrors);
        }
        else {// all correct, login
            setUsername(localUsername);
            navigate(["/DailyView/", FormatDate(selectedDate)].join(''));
        }
    }

    function validateLogin() {
        let currentErrors = {};
        if (!localUsername || localUsername.length < 0) {
            currentErrors['Username'] = 'Username must not be empty';
        }
        return (currentErrors);
    }

    return (
        <div className="text-center">
            <h1> Please log in </h1>
            <div>
                <Container>
                    <Card>
                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-3 col-sm-10 mx-auto"> {/* choose bottom margin, be a column and be horizontally centered */}
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="Text" onChange={(result) => handleChange(result.target.value)} isInvalid={!!errors['Username']} />
                                <Form.Control.Feedback type='invalid'> {errors['Username']} </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3 col-sm-10 mx-auto">
                                <Stack direction="horizontal" className="justify-content-center" gap={3}>
                                    <Button variant="success" type="submit"> Log in </Button>
                                </Stack>
                            </Form.Group>
                        </Form>
                    </Card>
                </Container>
            </div>
        </div>
    );
}

export default EntryDetails;