import React, { useState, useEffect, useContext } from 'react';

import { Button, Form, Stack, Card } from 'react-bootstrap';
import axios from 'axios';
import { Link, useParams, useNavigate } from "react-router-dom";

import FormatDate from '../FormatDate'
import ScriptedDatePicker from '../ScriptedDatePicker';
import "react-datepicker/dist/react-datepicker.css";

import DateContext from '../DateContext';
import UserContext from '../UserContext';

function DailyView(props) {
    let navigate = useNavigate();
    const [loadedEntries, setEntries] = useState([]);
    const { username } = useContext(UserContext);
    const { selectedDate, setDate } = useContext(DateContext);
    const [projectList, setProjects] = useState([]);
    const [pickedDate, setPickedDate] = useState(selectedDate);

    async function fetchEntryData() {    
        let config =  // axios's configuration
        {
            method: 'get', // not needed since 'get' is the default one
            url: '/daily', // nice way to tell apart what kind of action we want from the server
            params: {
                username: username, // example of how to ask for a specific file (of course this probably should be some identifier in a real case)
                date: pickedDate
                //fileName: "firstHit.json"
            }
        }
        const result = await axios(config);
        setEntries(result.data.entries);
    };

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

    useEffect(() => {
        fetchProjectData();
        fetchEntryData();
    }, []);

    function handleSelect() {
        setDate(pickedDate); // make the selected date the effective date
        navigate(["/DailyView/", FormatDate(pickedDate)].join(''))
        fetchEntryData();
    }

    function handleAddEntry() {
        navigate(["/AddEntry/", FormatDate(selectedDate)].join(''))
    }

    function handleDetailsEntry(id) {
        navigate(["/DetailsEntry", FormatDate(selectedDate), id].join('/'))
    }

    function handleEditEntry(id) {
        navigate(["/EditEntry", FormatDate(selectedDate), id].join('/'))
    }

    function handleTryDeleteEntry(id) {
        navigate(["/DeleteEntry", FormatDate(selectedDate), id].join('/'))
    }

    function handlePickChange(value) {
        setPickedDate(value);
    }


    return (
        <div className="text-center">
            <h2>Daily View</h2>
            <hr></hr>
            <Form>
                <Stack direction="horizontal" className="m-3" gap={3}>
                    <div>
                        <Form.Label> Displayed date </Form.Label>
                    </div>
                    <div>
                        <ScriptedDatePicker callback={handlePickChange} />
                    </div>
                    <div>
                        <Button variant="primary" onClick={handleSelect}> Select
                        </Button>
                    </div>
                    <div>
                        <Form.Control hidden isInvalid={(selectedDate !== pickedDate)} ></Form.Control>
                        <Form.Control.Feedback type='invalid'> Press Select to update </Form.Control.Feedback>
                    </div>
                    <div className="ms-auto">
                        <TimeTotalDisplay entries={loadedEntries} />
                    </div>
                </Stack>

            </Form>
            <table className="table">
                <thead>
                    <tr>
                        <th>
                            Project
                        </th>
                        <th>
                            Duration [minutes]
                        </th>
                        <th>
                            Description
                        </th>
                        <th>
                            <Stack gap={3}>
                                <Button variant="success" onClick={handleAddEntry}> Add Entry
                                </Button>
                            </Stack>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {(projectList.length > 0) ? loadedEntries.map(item => (
                        <tr key={item.Id}>
                            <td>
                                {projectList.find(project => project.ProjectCode === item.ProjectCode).ProjectName}
                            </td>
                            <td>
                                {item.Duration}
                            </td>
                            <td>
                                <textarea className="form-control text-left" id="description" value={item.Description} readOnly>
                                </textarea>
                            </td>

                            <td>
                                <Stack gap={3}>
                                    <Button variant="info" onClick={() => handleDetailsEntry(item.Id)}> Details </Button>
                                    <Button variant="warning" onClick={() => handleEditEntry(item.Id)}> Edit </Button>
                                    <Button variant="danger" onClick={() => handleTryDeleteEntry(item.Id)}> Delete </Button>
                                </Stack>
                            </td>
                        </tr>

                    )) : <tr><td>Projects failed to load! (refresh the page)</td></tr>}
                </tbody>
            </table>
            {(loadedEntries.length < 1) ? <p>No entries to show!</p> : <p></p>}
        </div >
    );

}

function TimeTotalDisplay(props) {
    let timeSum = 0
    for (const entry of props.entries) {
        timeSum += entry.Duration;
    }
    return (
        <Card>
            Total Time: {timeSum} minutes
        </Card>
    )
}

export default DailyView;