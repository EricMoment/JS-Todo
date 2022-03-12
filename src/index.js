import { format } from 'date-fns'
class Todos {
  constructor(title, description, dueDate, p_id) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.p_id = p_id;
  };
};

class Projects {
  constructor(title) {
    this.title = title;
    this.id = Projects.index;
  };
  static get index() {
    Projects.id = (Projects.id || 0) + 1;
    return Projects.id;
  }
};

const example = new Projects('Example');
const examle = new Todos('Example', 'Example', '03-10-2022', 1)
let project_list = JSON.parse(localStorage.getItem('project')) || [new Projects('Example')];
let todo_list = JSON.parse(localStorage.getItem('todo')) || [new Todos('Review Genki', 'Review Genki to handle speaking test', '2022-03-10', 1)];

function add_project_to_list(title) {
  const newpro = new Projects(title);
  project_list.push(newpro);
  localStorage.setItem('project', JSON.stringify(project_list));
};

function add_todo_to_list(title, description, dueDate, p_id) {
  const newtodo = new Todos(title, description, dueDate, p_id);
  todo_list.push(newtodo);
  localStorage.setItem('todo', JSON.stringify(todo_list));
}

function show_projects() {
  const projects_ol = document.querySelector('.projects_ol');
  projects_ol.textContent = '';
  for (let i = 0; i < project_list.length; i++) {
    const newli = document.createElement('li');
    newli.className = 'p_li'
    newli.id = i + 1;
    newli.textContent = project_list.at(i).title;
    projects_ol.appendChild(newli);
  }
};

show_projects();
const new_project = document.querySelector('.new_project')
new_project.addEventListener('click', () => { //click single project
  let title;
  do
    title = prompt('Projekt Name?');
  while (title === '' || title === null);
  add_project_to_list(title);
  show_projects();
  options();
  click_project();
});
///////////////////////////////////////////
function options() {  // invoke everytime you create project
  const selectbox = document.querySelector('#p_id');
  selectbox.textContent = '';
  project_list.forEach(project => {
    var option = document.createElement('option');
    option.textContent = `${project.id}.${project.title}`;
    option.value = project.id;
    selectbox.appendChild(option);
  });
};
options();

const new_todo = document.querySelector('.new_todo')
new_todo.addEventListener('click', (e) => {
  e.preventDefault();
  let param = {};
  var data = new FormData(form);
  for (const [name,value] of data) {param[name] = value};
  param.p_id = Number(param.p_id);
  if (param.title === '' || param.dueDate === '' || param.p_id === '') return;
  //console.log(param);
  param.dueDate = format(new Date(param.dueDate), 'MM-dd-yyyy')
  add_todo_to_list(param.title, param.description, param.dueDate, param.p_id)
  let filtered_list = todo_list.filter(todo => todo.p_id === param.p_id); 
  show_todos(filtered_list)
  click_todo(filtered_list)
  click_project()
});

function show_todos(list) {
  const lists_ol = document.querySelector('.lists_ol');
  lists_ol.textContent = '';
  for (let i = 0; i < list.length; i++) {
    const todoli = document.createElement('li');
    todoli.className = 't_li';
    todoli.id = i + 1;
    todoli.textContent = list.at(i).title;
    lists_ol.appendChild(todoli);
  };
};
function click_project() {
  const projects_li = document.querySelectorAll('.p_li');
  projects_li.forEach(project => {
    project.addEventListener('click', () => {
      //console.log(todo_list)
      const div_delete = document.querySelector('.div_delete');
      div_delete.textContent = '';
      let filtered_list = todo_list.filter(todo => todo.p_id === Number(project.id));
      //console.log(filtered_list)
      show_todos(filtered_list);
      click_todo(filtered_list);
    });
  });
};
click_project()

//////////////////////////

function click_todo(list) {
  const description = document.querySelector('.description');
  const dueDate = document.querySelector('.dueDate');
  description.textContent = '';
  dueDate.textContent = '';
  const div_delete = document.querySelector('.div_delete');
  div_delete.textContent = '';
  const todos_li = document.querySelectorAll('.t_li');
  todos_li.forEach(todo => {
    todo.addEventListener('click', () => {
      const div_delete = document.querySelector('.div_delete');
      div_delete.textContent = '';
      const found = list.at(Number(todo.id) - 1);
      const t_btn = document.createElement('button');
      t_btn.className = 'b_delete';
      t_btn.id = todo.id;
      t_btn.textContent = 'Delete This Todo';
      //console.log(found);
      description.textContent = found.description;
      dueDate.textContent = found.dueDate;
      div_delete.appendChild(t_btn);
      delete_todo(list.at(0).p_id)
    });
  });
};
function delete_todo(id) {
  const delete_btn = document.querySelector('.b_delete');
  delete_btn.addEventListener('click', () => {
    const description = document.querySelector('.description');
    const dueDate = document.querySelector('.dueDate');
    const div_delete = document.querySelector('.div_delete');
    let index = Number(delete_btn.id - 1);
    description.textContent = '';
    dueDate.textContent = '';
    div_delete.textContent = '';
    let filtered_list = todo_list.filter(todo => todo.p_id === id);
    let result = (filtered_list.splice(index, 1)).at(0);
    todo_list.splice(todo_list.indexOf(result), 1);
    localStorage.setItem('todo', JSON.stringify(todo_list));
    show_todos(filtered_list);
    click_todo(filtered_list);
    //console.log(todo_list)
    click_project()
  });
};