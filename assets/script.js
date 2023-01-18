var repoList = document.querySelector('#projects');

function getApi() {

  var requestUrl = 'https://api.github.com/users/unnamedmistress/repos?sort=updated';

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        console.log(data);
      for (var i = 0; i < 5; i++) {
        var listItem = document.createElement('h2');
        var details = document.createElement('li');
        let repoName = data[i].name;
        let repoUrl = data[i].html_url;
        let git = data[i].git_url;
        let description = data[i].description;

    
        details.innerHTML = `<strong>Site:</strong> <a href ="${repoUrl}"> ${repoName}</a> <strong>About:</strong> ${description} <br> <strong>Repo: </strong><a href ='${git}'> Here</a>`;
        repoList.appendChild(listItem);
        repoList.appendChild(details);
      }
    });
}

getApi();
