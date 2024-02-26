var projectAPI = 'http://localhost:8080/';

function start(){
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('projectId');
    getProject(renderProject);
    getProjectData(renderProjectData);
    // getProjectModel(renderProjectModel);
    // getProjectModel(renderProjectModel2);
    handleFormProject();
}
start();

function getProject(callback){
    const token = localStorage.getItem('userToken');
    fetch(projectAPI + 'Project/all_ProjectInfo',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    })
    .then(function(response){
        return response.json();
    })
    .then(callback);
}

// function getProjectData(callback){
//     const token = localStorage.getItem('userToken');
//     fetch(projectAPI + ' /UploadFile/get/', {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + token
//         },
//     })
//     .then(function(response){
//         return response.json();
//     })
//     .then(callback);
// }

// function getProjectModel(callback){
//     fetch(projectAPI + 'Model')
//     .then(function(response){
//         return response.json();
//     })
//     .then(callback);
// }

// function handleDeleteProject(id){
//     const token = localStorage.getItem('userToken');
//     fetch(projectAPI + 'Project/DeleteProjectBy' + id, {
//         method: 'DELETE',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + token
//         },
//     })
//     .then(function(response){
//         if (!response.ok) {
//             throw new Error('Failed to delete project');
//         }
//         return response.json();
//     })
//     .then(function(){
//         var projectItem = document.querySelector('.project-item-' + id);
//         if (projectItem){
//             projectItem.remove();
//         }
//         window.location.reload();
//     })
//     .catch(function(error){
//         console.error('Error:', error);
//     });
// }

function getProjectData(callback){
    const token = localStorage.getItem('userToken');
    fetch(projectAPI + '/UploadFile/all', { // Notice how the ID is appended to the URL
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    })
    .then(function(response){
        return response.json();
    })
    .then(callback);
}

function handleDeleteProject(id){
    const token = localStorage.getItem('userToken');
    fetch(projectAPI + 'Project/DeleteProjectBy' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    })
    .then(function(response){
        if (!response.ok) {
            throw new Error('Failed to delete project');
        }
        // Check if response has content before parsing as JSON
        if (response.status !== 204) {
            return response.json();
        } else {
            return null;  // No content in response
        }
    })
    .then(function(){
        // Check if the project item exists and then remove it
        var projectItem = document.querySelector('.project-item-' + id);
        if (projectItem){
            projectItem.remove();
        }
        // Reload the page
        window.location.reload();
    })
    .catch(function(error){
        console.error('Error:', error);
    });
}


function handleDeleteData(id){
    const token = localStorage.getItem('userToken');
    fetch(projectAPI + 'UploadFile/deleteDataBy' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
    })
    .then(function(response){
        return response.json();
    })
    .then(function(){
        var projectItem = document.querySelector('.data-item-' + id);
        if (projectItem){
            projectItem.remove();
            location.href = "Project_detail.html";
        }
         
    });
}

// function handleDeleteModel(id){
//     fetch(projectAPI + 'Project/DeleteProjectBy' + id, {
//         method: 'DELETE',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//     })
//     .then(function(response){
//         return response.json();
//     })
//     .then(function(){
//         var projectItem = document.querySelector('.Model-' + id);
//         if (projectItem){
//             projectItem.remove();
//         }
//     });
// }

function createProject(data) {
    const token = localStorage.getItem('userToken');
    console.log(data);
    fetch(projectAPI + 'Project/Add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
    })
    .then(function(response) {
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

function handleFormData(){
    var createBtn = document.querySelector('#submit1');
    // Other code...
    createBtn.onclick = function(){
        var name = document.querySelector('input[name="dataName"]').value;
        var fileName = document.querySelector('input[name="fileName"]').value;
        var fileInput = document.querySelector('input[name="fileData"]');
        var fileData = fileInput.files[0]; // This is the actual File object

        if (!fileData) {
            alert('Please select a file to upload.');
            return;
        }

        var formData = {
            dataName: name,
            fileName: fileName,
            fileData: fileData, // Pass the File object, not a path
        };
        console.log(formData);
        createData(formData);
    }   
}

function createData(data) {
    const token = localStorage.getItem('userToken');
    const formData = new FormData();
    formData.append('fileName', data.fileName);
    formData.append('DataName', data.dataName);
    formData.append('file', data.fileData); 

    console.log(`Uploading file: ${data.fileName}, size: ${data.fileData.size}`);

    fetch(projectAPI + 'UploadFile/add', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
            // Content-Type is not set; the browser will set it with the correct boundary
        },
        body: formData
    })
    .then(function(response) {
        console.log(`Response Status: ${response.status}, Status Text: ${response.statusText}`);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        return response.json();
    })
    .then(function(result) {
        console.log('Data processed', result);
        // window.location.href = 'Project_detail.html';
    })
    .catch(function(error) {
        console.error('Fetch error:', error);
    });
}



function renderProject(Project){
    var ProjectDataBl = document.querySelector('#project_data');
    var htmls = Project.map(function(Projects){
        console.log(Projects);
        return `
        <tr class="project-item-${Projects.projId}">
            <input type="hidden" id="projectIdField" value="${Projects.projId}">
            <td>${Projects.projname}</td>
            <td>${Projects.description}</td>
            <td class ="button">
                <button class="btn btn-info" type="button" onclick="handleDetail(${Projects.projId})">Detail</button>
                <button class="btn btn-primary" type="button" onclick="handleUpdateDetail(${Projects.projId})">Update</button>
                <button class="btn btn-danger" type="button" onclick="handleDeleteProject(${Projects.projId})">Delete</button>
            </td>
        </tr>
        `;
    }); 
    ProjectDataBl.innerHTML =  htmls.join('');   
}

// function renderProjectModel(Model){
//     var ProjectModelBl = document.querySelector('#Select');
//     var htmls = Model.map(function(Models){
//         return `
//         <option class="Model-${Models.id}" value="${Models.id}">${Models.name}</option>
//         `;
//     }); 
//     ProjectModelBl.innerHTML =  htmls.join(''); 
// }

// function renderProjectModel2(Model){
//     var ProjectModel = document.querySelector('#project_model');
//     var html2 = Model.map(function(Models){
//         return `
//         <tr class="Model-${Models.id}">
//             <td>${Models.id}</td>
//             <td>${Models.name}</td>
//             <td>${Models.description}</td>
//             <td class="button">
//                 <button class="btn btn-danger" type="button" onclick="handleDeleteModel(${Models.id})">Delete</button>
//             </td>
//         </tr>
//         `;
//     });
//     ProjectModel.innerHTML =  html2.join('');
// }

function renderProjectData(Data) {
    // const urlParams = new URLSearchParams(window.location.search);
    // const projectId = parseInt(urlParams.get('projectId'));  // Convert projectId to a number
    const ProjectDataDetailBl = document.querySelector('#project_data_detail');
    
    // console.log('projectId:', projectId); // Check if projectId is correct
    // console.log('Data:', Data);

    // Filter the data to include only matching projectId
    // const filteredData = Data.filter(dataItem => dataItem.projectId === projectId);
    
    console.log('filteredData:', Data);

    // Map the filtered data to HTML strings
    const html1 = Data.map(function(Datas) {
      return `
        <tr class="data-item-${Datas.dataId}">
        <td>${Datas.dataId}</td>
        <td>${Datas.dataName}</td> <!-- Modified this line -->
        <td>${Datas.fileName}</td>
        <td class="button">
            <a class="btn btn-success" href="D:\\FolderForNewUser\\Pao3\\png\\01_output.png">ShowImage</a>
            <button class="btn btn-primary" type="button" onclick="handlePredict('${Datas.fileName}')">Predict</button>
            <button class="btn btn-danger" type="button" onclick="handleDeleteData(${Datas.dataId})">Delete</button>
        </td>
    </tr>
      `;
    });

    // Set the HTML content of the container
    ProjectDataDetailBl.innerHTML = html1.join('');
}
// function openIMG(){
//     window.location.href('D:\\FolderForNewUser\\Pao3\\png\\01_output.png');
// }
function handlePredict(data){
    const token = localStorage.getItem('userToken');
    console.log("data: ", data);
    fetch(projectAPI + 'UploadFile/predict/' + data, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({fileName: data})
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        return response.json();
    })
    .then(function(data) {
        console.log('Data processed', data);
        window.location.href = 'Project_detail.html';
    })
    .catch(function(error) {
        console.error('Fetch error:', error);
    });
}


function handleDetail(projectId){
    window.location.href = 'Project_detail.html?projectId=' + projectId;

}
function handleUpdateDetail(projectId){
    window.location.href = 'Update_project.html?projectId=' + projectId;
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
            projname: name,
            description: description,
            
        }
        createProject(formData);
    }   
}

function handleFormData(){
    var createBtn = document.querySelector('#submit1');
    var returnBtn = document.querySelector('#close1');
    returnBtn.onclick = function(){
        location.href = "Project_detail.html";
    }
    createBtn.onclick = function(){
        var name = document.querySelector('input[name="dataName"]').value;
        var fileName = document.querySelector('input[name="fileName"]').value;
        var fileData = document.querySelector('input[name="fileData"]').value;
        var formData = {
            dataName: name,
            fileName: fileName,
            fileData: fileData,
        }
        console.log(formData);
        createData(formData);
    }   
}

function updateProject() {
    const projectId = document.getElementById('projectIdField').value;
    const updatedData = {
        projname: document.querySelector('input[name="ProjectName"]').value,
        description: document.querySelector('input[name="Description"]').value
        // Add other fields as necessary
    };

    console.log("Sending PUT request for project ID:", projectId); // Debugging log
    const token = localStorage.getItem('userToken');
    fetch(projectAPI + '/Project/UpdateProjectBy' + projectId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
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
    table = document.getElementById("project_model");
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
function logoutUser() {
    // Remove the user token from localStorage
    localStorage.removeItem('userToken');

    // Redirect the user to the login page (or any other desired page)
    window.location.href = 'login.html'; // Replace with the appropriate URL
}
