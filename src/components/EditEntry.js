import React, { useState, useEffect, useContext } from 'react';
import { Button, Form, Stack, Card, Container } from 'react-bootstrap';
import axios from 'axios';

import { useNavigate, useParams } from "react-router-dom";
import FormatDate from '../FormatDate'
import DateContext from '../DateContext';
import UserContext from '../UserContext';

function EditEntry(props) {   // in props pass entry related data
    let navigate = useNavigate();
    let { id } = useParams();
    const { username } = useContext(UserContext);
    const { selectedDate } = useContext(DateContext);
    const [projectList, setProjects] = useState([]);
    const [entry, setEntry] = useState({ProjectCode:"", Date: new Date(), Duration: "", Description:"", Id:-70}); // keep entry data as a state
    const setEntryField = (field, value) => {
        setEntry({ ...entry, [field]: value }) // set specified 'field' of the entry to 'value'
        if (!!errors[field]) {
            setErrors({ ...errors, [field]: null }) // logically remove the error from recently edited field
        }
    }

    const [errors, setErrors] = useState({});

    async function fetchProjectData() {
        let config =  // axios's configuration
        {
            method: 'get', // not needed since 'get' is the default one, but left it here for clarity
            url: '/projects', // ask server to return projects list
            // no params are needed to fetch list of projects
        }
        const result = await axios(config);
        setProjects(result.data);
    };

    async function fetchEditedEntryData() {
        let config =  // axios's configuration
        {
            method: 'get', // not needed since 'get' is the default one, but left it here for clarity
            url: '/getEntry', // ask server to return entry to edit
            params: {
                username: username,
                date: FormatDate(selectedDate),
                id: id
            }
        }
        const result = await axios(config);
        setEntry(result.data);
        setErrors({})
    };

    async function postEntry() {
        let config =  // axios's configuration
        {
            method: 'post', // this will post the entry
            url: '/entry', // ask server to save this entry
            params: {
                username: username, //give user that is posting the entry
                date: FormatDate(selectedDate),
                entry: JSON.stringify(entry) // pass over entry data
            }
        }
        const result = await axios(config,).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                alert(['Error:', error.response.status, ':\nFailed to ', (id === undefined) ? 'add' : 'edit', 'your entry. Please try again later'].join(' '))

            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                alert(['Error:','Timeout',':\nFailed to ', (id === undefined) ? 'add' : 'edit', 'your entry. Please try again later'].join(' '))
            } else {
                // Something happened in setting up the request that triggered an Error
                alert(['Error:', error.message, ':\nFailed to ', (id === undefined) ? 'add' : 'edit', 'your entry. Please try again later'].join(' '))
            }
            return;
        });
        if (result !== undefined) {
            const receivedId = result.data['Id'];
            if (receivedId < 0) {
                alert(['Failed to ', (id === undefined) ? 'add' : 'edit', 'your entry (entry no longer exists). Please try again later '].join(' '))
            }
            else {
                alert(['Successfully', (id === undefined) ? 'added' : 'edited', 'your entry.'].join(' '))
                navigate(["/DetailsEntry", FormatDate(selectedDate), receivedId].join('/')) // show details of created/edited entry
            }
        }
    };

    useEffect(() => {
        fetchProjectData();
        if (id !== undefined) {
            // load edited entry data
            fetchEditedEntryData();
        }
        else {
            setEntry({ ...entry, Date: selectedDate, Id: -1 }) // if editing multiple properties at once, we need to do so explicitly like this beacause calling 2 times setEntryField() only executes the last function
        }
    }, []); // empty dependency array: only perform useEffect once


    function handleBack() {
        navigate(-1) // move bavk to previous view
    }

    function handleEdit() {//if valid: send request to server to post the entry
        const currentErrors = validateEntry();
        if (Object.keys(currentErrors).length > 0) {// something not correct, do not send to server
            setErrors(currentErrors);
        }
        else {// all correct, send post to server
            postEntry();
        }
    }

    function validateEntry() {
        let currentErrors = {};
        if (!entry['Duration'] || entry['Duration'] < 0) {
            currentErrors['Duration'] = 'Duration must be a positive number!';
        }
        if (!entry['ProjectCode'] || entry['ProjectCode'] === "") {
            currentErrors['ProjectCode'] = 'Please select a project';
        }
        if (!entry['Description'] || entry['Description'] === "") {
            currentErrors['Description'] = 'Please describe your entry!';
        }
        return (currentErrors);
    }

    return (
        <div className="text-center">
            <h1> {(id === undefined) ? "Add" : "Edit"} entry</h1>
            <div >
                <Container>
                    <Card>
                        <Form className="m-3">
                            <Form.Group className="mb-3 col-sm-10 mx-auto"> {/* choose bottom margin, be a column and be horizontally centered */}
                                <Form.Label>Project</Form.Label>
                                <Form.Select type="Text" value={entry.ProjectCode} required onChange={result => setEntryField('ProjectCode', result.target.value)} isInvalid={!!errors['ProjectCode']}>
                                    <option key="" value=""> Select the project</option>
                                    {projectList.map(item =>
                                        <option key={item.ProjectCode} value={item.ProjectCode}>
                                            {item.ProjectName}
                                        </option>
                                    )}
                                </Form.Select>
                                <Form.Control.Feedback type='invalid'> {errors['ProjectCode']} </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3 col-sm-10 mx-auto">
                                <Form.Label> Date </Form.Label>
                                <Form.Control type="Date" readOnly required value={FormatDate(selectedDate)} />
                            </Form.Group>
                            <Form.Group className="mb-3 col-sm-10 mx-auto">
                                <Form.Label> Duration [minutes] </Form.Label>
                                <Form.Control type="Number" required value={entry.Duration} onChange={result => setEntryField('Duration', result.target.value)} isInvalid={!!errors['Duration']} />
                                <Form.Control.Feedback type='invalid'> {errors['Duration']} </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3 col-sm-10 mx-auto">
                                <Form.Label> Description </Form.Label>
                                <Form.Control as="textarea" required value={entry.Description} onChange={result => setEntryField('Description', result.target.value)} isInvalid={!!errors['Description']} />
                                <Form.Control.Feedback type='invalid'> {errors['Description']} </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3 col-sm-10 mx-auto">
                                <Stack direction="horizontal" className="justify-content-center" gap={3}>
                                    <Button variant="primary" onClick={handleEdit}> {(id === undefined) ? "Create entry" : "Save"}</Button>
                                    <Button variant="danger" onClick={handleBack}> Cancel </Button>
                                </Stack>
                            </Form.Group>
                        </Form>
                    </Card>
                </Container>
            </div>
        </div>
    );
}

export default EditEntry;