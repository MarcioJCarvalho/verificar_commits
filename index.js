const form = document.querySelector("form");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const repositorio = document.querySelector("#repositorio").value;
  const dataInicial = document.querySelector("#dataInicial").value;
  const dataFinal = document.querySelector("#dataFinal").value;
  buscarCommits(repositorio, dataInicial, dataFinal);
});

function buscarCommits(repositorio, dataInicial, dataFinal) {
  const array = repositorio.split("/");
  let url = "";
  if (array.length > 2) {
    url = `https://api.github.com/repos/${array[3] + "/" + array[4]
      }/commits?since=${dataInicial}&until=${dataFinal}`;
  } else {
    url = `https://api.github.com/repos/${array[0] + "/" + array[1]
      }/commits?since=${dataInicial}&until=${dataFinal}`;
  }
  fetch(url)
    .then((response) => response.json())
    .then((commits) => {
      contarCommits(commits);
    })
    .catch((error) => {
      console.log(error);
    });
}

function contarCommits(commits) {
  const commitsPorDia = {};
  commits.forEach((element) => {
    const dataCommit = element.commit.author.date.substring(0, 10);
    const mensagemCommit = element.commit.message;
    if (commitsPorDia[dataCommit]) {
      commitsPorDia[dataCommit].quantidade++;
      commitsPorDia[dataCommit].mensagem.push(mensagemCommit);
    } else {
      commitsPorDia[dataCommit] = { quantidade: 1, data: dataCommit, mensagem: [mensagemCommit]};
    }
  });

  const commitsPorDiaArray = Object.keys(commitsPorDia).map((dataCommits) => {
    return {
      data: dataCommits,
      quantidade: commitsPorDia[dataCommits].quantidade,
      mensagem: commitsPorDia[dataCommits].mensagem,
    };
  });
  mostrarTela(commitsPorDiaArray);
}

function mostrarTela(commits) {
  const dados = document.querySelector("#dados");
  const table = document.createElement("table");
  const thTable = document.createElement("th");
  const thData = document.createElement("th");
  const thCommit = document.createElement("th");
  const thMensagem = document.createElement("th");
  const trTable = document.createElement("tr");
  const trHeader = document.createElement("tr");
  const tbody = document.createElement("tbody");

  thTable.innerHTML = "Tabela Commits";
  thTable.colSpan = 3;
  trTable.appendChild(thTable);
  table.appendChild(trTable);
  thData.innerHTML = 'Data';
  table.appendChild(trHeader);
  thCommit.innerHTML = 'Commits';
  thMensagem.innerHTML = 'Mensagem';
  trHeader.appendChild(thData);
  trHeader.appendChild(thCommit);
  trHeader.appendChild(thMensagem);

  commits.forEach((element) => {
    const data = new Date(element.data).toLocaleDateString('pt-BR', {
      timeZone: 'UTC'
    });

    let trow = tbody.insertRow(tbody);

    const tData = trow.insertCell();
    tData.innerText = data;

    const tCommit = trow.insertCell();
    tCommit.innerText = element.quantidade;

    const tMensagem = trow.insertCell();
    element.mensagem.forEach(mensagens =>{
      const msg = document.createTextNode(mensagens);
      const li = document.createElement('li');
      li.appendChild(msg);
      tMensagem.appendChild(li);
    });
  });
  table.appendChild(tbody);
  dados.appendChild(table);
}
