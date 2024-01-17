var projectAPI = 'http://localhost:3000/Project';
var projectDataAPI = 'http://localhost:3000/Data';

function start(){
    getProject(renderProject);
    getProjectData(renderProjectData);
    handleFormProject();
}
start();

function getProject(callback){
    fetch(projectAPI)
    .then(function(response){
        return response.json();
    })
    .then(callback);
}

function getProjectData(callback){
    fetch(projectDataAPI)
    .then(function(response){
        return response.json();
    })
    .then(callback);
}

function handleDeleteProject(id){
    fetch(projectAPI + '/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(function(response){
        return response.json();
    })
    .then(function(){
        var projectItem = document.querySelector('.project-item-' + id);
        if (projectItem){
            projectItem.remove();
        }
    });
}

// function createProject(data){
//     fetch(projectAPI, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//     .then(function(response){
//         return response.json();
//     })
//     .then(function(){
//         location.href = 'Project2.html';
//     });
// }

function createProject(data) {
    fetch(projectAPI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(function(response) {
        console.log('Response received');
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        return response.json();
    })
    .then(function(data) {
        console.log('Data processed', data);
        window.location.href = 'Project2.html';
    })
    .catch(function(error) {
        console.error('Fetch error:', error);
    });
}



function renderProject(Project){
    var ProjectDataBl = document.querySelector('#project_data');
    var htmls = Project.map(function(Projects){
        return `
        <tr class="project-item-${Projects.id}">
            <td>${Projects.name}</td>
            <td>${Projects.description}</td>
            <td class ="btn">
                <button class="btn btn-primary" type="button" onclick="handleDetail(${Projects.id})">Detail</button>
                <button class="btn btn-primary" type="button" onclick="handleUpdateDetail(${Projects.id})">Update</button>
                <button class="btn btn-primary" type="button" onclick="handleDeleteProject(${Projects.id})">Delete</button>
            </td>
        </tr>
        `;
    }); 
    ProjectDataBl.innerHTML =  htmls.join('');   
}

function handleDetail(projectId){
    window.location.href = 'Project_detail.html?projectId=' + projectId;
}
function handleUpdateDetail(projectId){
    window.location.href = 'Update_project.html?projectId=' + projectId;
}

function renderProjectData(Data){
    var ProjectDataDetailBl = document.querySelector('#project_data_detail');
    var html1 = Data.map(function(Datas){
        return `
        <tr class="project-item-${Datas.id}">
            <td>${Datas.id}</td>
            <td>${Datas.data}</td>
            <td>${Datas.predicted}</td>
            <td class="btn">
                <button class="btn btn-primary" type="button" onclick="">Update</button>
                <button class="btn btn-primary" type="button" onclick="handleDeleteProject(${Datas.id})">Delete</button>
            </td>
        </tr>
        `
    });
    ProjectDataDetailBl.innerHTML = html1.join('');  
}

function handleFormProject(){
    var createBtn = document.querySelector('#submit');
    
    var returnBtn = document.querySelector('#undo');
    returnBtn.onclick = function(){
        location.href = "Project2.html";
    }
    createBtn.onclick = function(){
        var name = document.querySelector('input[name="ProjectName"]').value;
        var description = document.querySelector('input[name="Description"]').value;
        var formData = {
            name: name,
            description: description,
            
        }
        createProject(formData);
    }   
}

function updateProject() {
    const projectId = document.getElementById('projectIdField').value;
    const updatedData = {
        name: document.querySelector('input[name="ProjectName"]').value,
        description: document.querySelector('input[name="Description"]').value
        // Add other fields as necessary
    };

    console.log("Sending PUT request for project ID:", projectId); // Debugging log

    fetch(projectAPI + '/' + projectId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => {
        console.log("Received response:", response); // Debugging log
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        return response.json();
    })
    .then(data => {
        console.log('Update successful:', data);
        window.location.href = 'Project2.html';
        // Redirect or perform other actions upon successful update
    })
    .catch(error => {
        console.error('Update failed:', error);
        // Handle errors here
    });
}

document.getElementById('fileUploadForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const fileInput = document.getElementById('fileInput');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    fetch('your-file-upload-endpoint', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        return response.json();
    })
    .then(data => {
        console.log('File upload successful:', data);
        // Handle success - maybe update UI or redirect
    })
    .catch(error => {
        console.error('File upload failed:', error);
        // Handle errors here
    });
});

function searchProjects() {
    // Variables to hold your HTML elements
    var input, filter, table, tr, tdProject, tdModel, i;
    
    // Get the search input value
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    
    // Get the table and its rows
    table = document.getElementById("project_data");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those that don't match the search query
    for (i = 0; i < tr.length; i++) {
        tdProject = tr[i].getElementsByTagName("td")[0]; // The Project Name column
        tdModel = tr[i].getElementsByTagName("td")[1]; // The Model Name column
        
        // If the row contains a Project or Model Name
        if (tdProject || tdModel) {
            if (tdProject.innerHTML.toUpperCase().indexOf(filter) > -1 || tdModel.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = ""; // This row matches the search, so show it
            } else {
                tr[i].style.display = "none"; // This row doesn't match the search, so hide it
            }
        }       
    }
}

function searchModels() {
    // Variables to hold your HTML elements
    var input, filter, table, tr, tdProject, tdModel, i;
    
    // Get the search input value
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    
    // Get the table and its rows
    table = document.getElementById("project_data");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those that don't match the search query
    for (i = 0; i < tr.length; i++) {
        tdProject = tr[i].getElementsByTagName("td")[0]; // The Project Name column
        tdModel = tr[i].getElementsByTagName("td")[1]; // The Model Name column
        
        // If the row contains a Project or Model Name
        if (tdProject || tdModel) {
            if (tdProject.innerHTML.toUpperCase().indexOf(filter) > -1 || tdModel.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = ""; // This row matches the search, so show it
            } else {
                tr[i].style.display = "none"; // This row doesn't match the search, so hide it
            }
        }       
    }
}