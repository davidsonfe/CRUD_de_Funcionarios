import prodb, {
    bulkcreate,
    createEle,
    getData,
    SortObj
  } from "./module.js";
  
  
  let db = prodb("EmployeesDB", {
    registers: `++id, name, birth, wage`
  });
  
  // tags de entrada
  const userid = document.getElementById("userid");
  const name = document.getElementById("name");
  const birth = document.getElementById("birth");
  const wage = document.getElementById("wage");
  
  // botão criar
  const btncreate = document.getElementById("btn-create");
  const btnread = document.getElementById("btn-read");
  const btnupdate = document.getElementById("btn-update");
  const btndelete = document.getElementById("btn-delete");
  
  // dados do usuário
  
  // eventos para o botão criar
  btncreate.onclick = event => {
    // inserir valores

    // Lógica da data para validar idade minima de 18 anos.
  const [birthDay, birthMonth, birthYear] = birth.value.split('/');

  const birthDateInMs = new Date(birthYear, birthMonth - 1, birthDay);
  const todayInMs = new Date().getTime();

  const age = Math.floor(
    (todayInMs - birthDateInMs) / 1000 / 60 / 60 / 24 / 365
  );

  let flag;
    // Validações de nome, idade e sálario.
  if (name.value.length >= 4 && age >= 18 && wage.value > 1212) {
    console.log(name.length);
    flag = bulkcreate(db.registers, {
      name: name.value,
      birth: birth.value,
      wage: wage.value,
    });
  }else{
      window.alert('Name, date or wage fields were filled incorrectly. Name has to be equal or greater than 4, wage must be equal or greater than a minimum wage(1212) and the age must be equal or greater than 18.');
  }

  // redefinir valores da caixa de texto
  
  name.value = birth.value = wage.value = '';

  // definir o valor da caixa de texto do id
  getData(db.registers, (data) => {
    userid.value = data.id + 1 || 1;
  });
  table();

  let insertmsg = document.querySelector('.insertmsg');
  getMsg(flag, insertmsg);
    
  };
  
  // ouvinte de eventos para o botão criar
  btnread.onclick = table;
  
  // button update
  btnupdate.onclick = () => {
    const id = parseInt(userid.value || 0);
    if (id) {
      // chamar o método de atualização dexie
      db.registers.update(id, {
        name: name.value,
        birth: birth.value,
        wage: wage.value
      }).then((updated) => {
        // let get = updated ? `data updated` : `couldn't update data`;
        let get = updated ? true : false;
  
        // exibir mensagem
        let updatemsg = document.querySelector(".updatemsg");
        getMsg(get, updatemsg);
  
        name.value = birth.value = wage.value = "";
        //console.log(get);
      })
    } else {
      console.log(`Please Select id: ${id}`);
    }
  }
  
  // delete button
  btndelete.onclick = () => {
    db.delete();
    db = prodb("EmployeesDB", {
      registers: `++id, name, birth, wage`
    });
    db.open();
    table();
    textID(userid);
    // exibir mensagem
    let deletemsg = document.querySelector(".deletemsg");
    getMsg(true, deletemsg);
  }
  
  window.onload = event => {
    // set id textbox value
    textID(userid);
  };
  
  
  
  
  // create tabela dinamica
  function table() {
    const tbody = document.getElementById("tbody");
    const notfound = document.getElementById("notfound");
    notfound.textContent = "";
    // remova todos os filhos do dom primeiro
    while (tbody.hasChildNodes()) {
      tbody.removeChild(tbody.firstChild);
    }
  
  
    getData(db.registers, (data, index) => {
      if (data) {
        createEle("tr", tbody, tr => {
          for (const value in data) {
            createEle("td", tr, td => {
              td.textContent = data.wage === data[value] ? `$ ${data[value]}` : data[value];
            });
          }
          createEle("td", tr, td => {
            createEle("i", td, i => {
              i.className += "fas fa-edit btnedit";
              i.setAttribute(`data-id`, data.id);
              // armazena o número de botões de edição
              i.onclick = editbtn;
            });
          })
          createEle("td", tr, td => {
            createEle("i", td, i => {
              i.className += "fas fa-trash-alt btndelete";
              i.setAttribute(`data-id`, data.id);
              //armazena o número de botões de edição
              i.onclick = deletebtn;
            });
          })
        });
      } else {
        notfound.textContent = "No Employees found in the database...!";
      }
      
  
    });
  }
  
  const editbtn = (event) => {
    let id = parseInt(event.target.dataset.id);
    db.registers.get(id, function (data) {
      let newdata = SortObj(data);
      userid.value = newdata.id || 0;
      name.value = newdata.name || "";
      birth.value = newdata.birth || "";
      wage.value = newdata.wage || "";
    });
  }
  
  // delete icone remover element 
  const deletebtn = event => {
    let id = parseInt(event.target.dataset.id);
    db.registers.delete(id);
    table();
  }
  
  // textbox id
  function textID(textboxid) {
    getData(db.registers, data => {
      textboxid.value = data.id + 1 || 1;
    });
  }
  
  // function msg
  function getMsg(flag, element) {
    if (flag) {
      // call msg 
      element.className += " movedown";
  
      setTimeout(() => {
        element.classList.forEach(classname => {
          classname == "movedown" ? undefined : element.classList.remove('movedown');
        })
      }, 4000);
    }
  }


  window.onload = () => {notfound.textContent = "No Employees found in the database...!";}
