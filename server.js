/* run this file in production (requires up to date /build folder) */
const express = require('express');
const path = require('path')
const fs = require('fs');
const app = express();

const fileType = ".json"
const emptyMonthEntries = { entries: [] }
const projectsFile = "projects.json"

app.use(express.static(path.join(__dirname, 'build')))
app.get('/ping', (req, res) => {
    return res.send('pong')
})
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.get('/daily', (req, res) => {
    //?WriteFile("firstHit.json") // if you run this you will notice that files are saved/read from src, not sure how it works in build though, but both actions should run in the same directory specific to the build (i guess)
    fileName = GetEntryFileName(req)// get filename
    ReadFile(fileName, SendDailyEntries, undefined, res); // read file with this path and respond when successfull
})

app.get('/projects', (req, res) => {
    ReadFile(projectsFile, SendProjects, undefined, res); // read file with this path and respond when successfull
    // assuming project files are never touched (so no checks)
    // projects.json is an array so we can just send it
})

app.get('/getEntry', (req, res) => {
    fileName = GetEntryFileName(req)
    entry = req.query['entry'];
    procParams = {
        id: req.query['id'],
        fileName: fileName
    }
    ReadFile(fileName, SendSingleEntry, procParams, res); // read file that should contain this entry and send back the edited entry if successfull
})


app.post('/entry', (req, res) => {
    fileName = GetEntryFileName(req)
    entry = req.query['entry'];
    procParams = {
        entry: entry,
        fileName: fileName
    }
    ReadFile(fileName, EditEntry, procParams, res); // read file that should contain this entry and send back the edited entry if successfull
})

app.post('/deleteEntry', (req, res) => {
    fileName = GetEntryFileName(req)
    procParams = {
        fileName: fileName,
        idToDelete: Number(req.query['id']),
    }
    ReadFile(fileName, DeleteEntry, procParams, res); // read file that should contain this entry and delete the entry
})

app.listen(5000)

function GetEntryFileName(req) {
    username = String(req.query["username"]); // query for the "fileName" param (does not use 'req.params.fileName', because this is a diffrernt thing from axios's config.params)
    date = req.query["date"];
    dayDate = String(date);
    monthDate = dayDate.substring(0, 7);
    fileName = [username, monthDate + fileType].join('-');
    return (fileName);
}

function SendDailyEntries(procParams) {
    result = procParams.content.entries;
    if (result !== emptyMonthEntries) {// send back data only relevant to the requsted day
        finalResult = { entries: [] };
        id = 0;
        for (const entry of result) {
            if (FormatDate(entry.Date) === FormatDate(dayDate)) {
                entry.Id = id; // add id of this entry
                finalResult.entries.push(entry);
            }
            ++id;
        }
        result = finalResult;
    }
    procParams.res.json(result);
}

function SendProjects(procParams) {
    procParams.res.json(procParams.content);
}

function SendSingleEntry(procParams) {
    result = procParams.content.entries;
    if (result !== emptyMonthEntries) {// send back data only relevant to the requsted day
        if (result.length > procParams.id) {
            let entry = result[procParams.id];
            entry.Id = Number(procParams.id);
            procParams.res.json(entry);
            return;
        }
    }
    Promise.reject('404 - Entry does not exist');
}


function EditEntry(procParams) {
    var loadedEntries = procParams.content;
    var entry = procParams.entry;
    entry = JSON.parse(entry);
    const fileEntry = ToFileEntry(entry);
    var entryId = Number(entry.Id);
    if (entryId < 0) { // request is to add a new entry
        loadedEntries.entries.push(fileEntry);
        entry.Id = loadedEntries.entries.length - 1; // give new id to the entry
        ModifyProjectBudget(undefined, fileEntry.ProjectCode, undefined, -fileEntry.Duration);
    }
    else if (loadedEntries.entries.length > entryId) { // modify existing entry
        ModifyProjectBudget(loadedEntries.entries[entryId].ProjectCode, fileEntry.ProjectCode,loadedEntries.entries[entryId].Duration , -fileEntry.Duration); // refund budget spent on entry's old project and charge the new project's budget with duration
        loadedEntries.entries[entryId] = fileEntry;
    }
    else { // an unexisting entry was edited (do nothing)
        entry.Id = -10;
    }
    WriteFile(procParams.fileName, loadedEntries)
    procParams.res.json(entry);
}

function DeleteEntry(procParams) {
    var loadedEntries = procParams.content;
    var idToDelete = procParams.idToDelete;

    if (idToDelete > -1 && idToDelete < loadedEntries.entries.length) { // delete the entry
        ModifyProjectBudget(undefined, loadedEntries.entries[idToDelete].ProjectCode, undefined, loadedEntries.entries[idToDelete].Duration);
        loadedEntries.entries.splice(idToDelete, 1);
    }
    else { // an nonexistent entry was supposed to be deleted : do nothing
        procParams.res.sendStatus(404)
        return
    }
    WriteFile(procParams.fileName, loadedEntries)
    procParams.res.sendStatus(200)
}

function ReadFile(path, processContents, processParameters, res) { // read file from given path and send the contents in 
    fs.readFile(path, (err, out2) => {
        if (err)// if error, send back empty entries
        {
            console.log('Error:', err)
            procParams = { ...processParameters, content: emptyMonthEntries, res: res };
            processContents(procParams)
            return;
        }
        content = JSON.parse(out2); // otherwise parse the binary output into JSON
        procParams = { ...processParameters, content: content, res: res };
        processContents(procParams)
        return;
    });
}

function WriteFile(name, content) {
    let data = JSON.stringify(content) // change the data structure into a JSON string
    fs.writeFile(name, data, function (err, result) {
        if (err)// if error : log it
        {
            console.log('Error:', err)
            return;
        }
    })
}

function ToFileEntry(appEntry) // convert the entry with id into a file-existing entry
{
    const entry = {
        ProjectCode: appEntry['ProjectCode'],
        Date: FormatDate(appEntry['Date']),
        Duration: Number(appEntry.Duration),
        Description: appEntry['Description']
    }
    return (entry);
}

function ModifyProjectBudget(oldProjectCode, projectCode, oldDelta, delta) {
    procParams = {
        oldProjectCode: oldProjectCode,
        projectCode: projectCode,
        oldDelta: oldDelta,
        delta: delta
    }
    ReadFile(projectsFile, ModifyBudget, procParams, undefined)
}

function ModifyBudget(procParams) {
    if (procParams.oldDelta !== undefined && procParams.oldProjectCode !== undefined) {
        const oldIndex = procParams.content.findIndex(project => project.ProjectCode === procParams.oldProjectCode)
        if (oldIndex > 0) {
            procParams.content[oldIndex].Budget += procParams.oldDelta
        }
    }

    const index = procParams.content.findIndex(project => project.ProjectCode === procParams.projectCode)
    if (index > 0) {
        procParams.content[index].Budget += procParams.delta
    }
    WriteFile(projectsFile, procParams.content);
}

function FormatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}