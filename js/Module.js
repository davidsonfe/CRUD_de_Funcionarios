const employeesdb = (dbname, table) => {
    const db = new Dexie(dbname);
    db.version(1).stores(table);
    db.open();
  
    return db;
    
        
  };
  
  const bulkcreate = (dbtable, data) => {
    let flag = empty(data);
    if (flag) {
      dbtable.bulkAdd([data]);
      console.log("data inserted successfully...!");
    } else {
      console.log("Please provide data...!");
    }
    return flag;
  };
  
  // criar elementos dinâmicos
  const createEle = (tagname, appendTo, fn) => {
    const element = document.createElement(tagname);
    if (appendTo) appendTo.appendChild(element);
    if (fn) fn(element);
  };
  
  // verificar a validação da caixa de texto
  const empty = object => {
    let flag = false;
    for (const value in object) {
      if (object[value] != "" && object.hasOwnProperty(value)) {
        flag = true;
      } else {
        flag = false;
      }
    }
    return flag;
  };
  
  // getData do banco de dados
  const getData = (dbname, fn) => {
    let index = 0;
    let obj = {};
    dbname.count(count => {
      // 
      if (count) {
        dbname.each(table => {
           // retorna os dados do objeto da tabela
          // para organizar a ordem, vamos criar para em loop
          obj = SortObj(table);
          fn(obj, index++); // chamar função com argumento de dados
        });
      } else {
        fn(0);
      }
    });
  };
  
  const SortObj = (sortobj) => {
    let obj = {};
    obj = {
      id: sortobj.id,
      name: sortobj.name,
      seller: sortobj.birth,
      price: sortobj.wage
    };
    return obj;
  }
  
  
  export default employeesdb;
  export {
    bulkcreate,
    createEle,
    getData,
    SortObj
  };