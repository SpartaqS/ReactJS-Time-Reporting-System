import React, { useState, useEffect, useContext } from 'react';
import { Button, Form , Card, Container, Stack} from 'react-bootstrap';
import axios from 'axios';

import { useNavigate, useParams } from "react-router-dom";
import FormatDate from '../FormatDate'
import DateContext from '../DateContext';
import UserContext from '../UserContext';

function EntryDetails(props) {   // in props pass entry related data
    let navigate = useNavigate();
    let { id } = useParams();
    const { username } = useContext(UserContext)
    const { selectedDate } = useContext(DateContext);
    const [entry, setEntry] = useState({}); // keep entry data as a state
    const [projectList, setProjects] = useState([]);

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
    async function fetchDisplayedEntryData() {
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
    };

    async function deleteEntry() {
        let config =  // axios's configuration
        {
            method: 'post', // this will post the entry
            url: '/deleteEntry', // ask server to save this entry
            params: {
                username: username, //give user that is posting the entry
                date: FormatDate(selectedDate),
                id: id // pass over entry data
            }
        }
        const result = await axios(config,).catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                alert(['Error:', error.response.status, ':\nFailed to ', 'delete', 'your entry. Please try again later'].join(' '))

            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                alert(['Error:','Timeout',':\nFailed to ', 'delete', 'your entry. Please try again later'].join(' '))
            } else {
                // Something happened in setting up the request that triggered an Error
                alert(['Error:', error.message, ':\nFailed to ','delete', 'your entry. Please try again later'].join(' '))
            }
            return;
        });
        if (result !== undefined) {
            alert(['Successfully deleted your entry.'].join(' '))
            navigate(["/DailyView/", FormatDate(selectedDate)].join('')) // go to daily view after deleting entry
        }
    };

    useEffect(() => {
        fetchProjectData();
        fetchDisplayedEntryData(); // request all properties of the displayed entry
    }, []); // empty dependency array: only perform useEffect once


    function handleCancel() {
        navigate(-1) // move back to previous view
        
    }

    function handleBack()
    {
        navigate(["/DailyView/", FormatDate(selectedDate)].join('')) // simply move back to daily view
    }

    function handleDelete() { // delete the entry
        deleteEntry();
    }

    function handleTryDelete() { // ask to delete entry (when in details view)
        navigate(["/DeleteEntry", FormatDate(selectedDate), id].join('/')) // move to delete entry screen (basically this but configured to delete)
    }

    function handleTryEdit() { // ask to edit entry (when in details view)
        navigate(["/EditEntry", FormatDate(selectedDate), id].join('/')) // move to delete entry screen (basically this but configured to delete)
    }
    
    return (
        <div className="text-center">
            <h1> {(props.mode === "details") ? "Entry details" : "Delete entry confirmation"} </h1>
            <div>
                <Container>
                    <Card>
                        <Form>
                            <Form.Group className="mb-3 col-sm-10 mx-auto"> {/* choose bottom margin, be a column and be horizontally centered */}
                                <Form.Label>Project</Form.Label>
                                <Form.Select type="Text" disabled value={entry.ProjectCode}>
                                    <option key="" value=""> Select the project</option>
                                    {projectList.map(item =>
                                        <option key={item.ProjectCode} value={item.ProjectCode}>
                                            {item.ProjectName}
                                        </option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3 col-sm-10 mx-auto">
                                <Form.Label> Date </Form.Label>
                                <Form.Control type="Date" readOnly required value={FormatDate(selectedDate)} />
                            </Form.Group>
                            <Form.Group className="mb-3 col-sm-10 mx-auto">
                                <Form.Label> Duration [minutes]</Form.Label>
                                <Form.Control type="Number" readOnly value={entry.Duration} />
                            </Form.Group>
                            <Form.Group className="mb-3 col-sm-10 mx-auto">
                                <Form.Label> Description </Form.Label>
                                <Form.Control as="textarea" readOnly value={entry.Description} />
                            </Form.Group>
                            <Form.Group className="mb-3 col-sm-10 mx-auto">
                                <p>{(props.mode === "details") ? "" : "Are you sure you want to delete this entry?"}</p>
                                <Stack direction="horizontal" className="justify-content-center" gap={3}>
                                    
                                    <Button variant="danger" onClick={(props.mode === "details") ? handleTryDelete : handleDelete}> {(props.mode === "details") ? "Delete" : "Confirm Delete"}</Button>
                                    {(props.mode === "details") ? <Button variant="info" onClick={ handleTryEdit }> Edit </Button> : ""}
                                    
                                    <Button variant="warning" onClick={(props.mode === "details") ? handleBack : handleCancel}> {(props.mode === "details") ? "Back to daily view" : "Cancel"} </Button>
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