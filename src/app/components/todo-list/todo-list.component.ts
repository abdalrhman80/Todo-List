import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Todo, newTodo } from '../../interface/todo';
import { TodoService } from './../../services/todo.service';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  apiKey: string = ''
  TodoList: Todo[] = []
  completedTodoS: Todo[] = []
  activeTodos: Todo[] = []
  completedTodoSID: string[] = []
  TodoIdToUpdate: string = ''
  newTodo: newTodo = { title: '', apiKey: '' }
  TodosNum: number = 0
  isLoading: boolean = false
  allFlag: boolean = true
  activeFlag: boolean = false
  completedFlag: boolean = false
  @ViewChild('customModal') customModal!: ElementRef

  TodoForm: FormGroup = new FormGroup({
    title: new FormControl(null, [Validators.required, Validators.minLength(1)])
  })

  UpdateTodoForm: FormGroup = new FormGroup({
    title: new FormControl(null, [Validators.required, Validators.minLength(1)])
  })

  constructor(private _TodoService: TodoService) { }

  ngOnInit(): void {
    localStorage.getItem('apiKey') == null ? this.getApiKey() : this.apiKey = (localStorage.getItem('apiKey')) || ''
    this.getAllTodoS()
  }

  getApiKey() {
    this._TodoService.getApiKey().subscribe({
      next: response => {
        localStorage.setItem('apiKey', response.apiKey)
        this.apiKey = response.apiKey
      },
      error: () => this.isLoading = false
    })
  }

  getAllTodoS() {
    this.isLoading = true
    this._TodoService.getAllTodoS(this.apiKey).subscribe({
      next: response => {
        this.isLoading = false
        this.TodoList = response.todos
        this.completedTodoS = this.TodoList.filter((todo: any) => todo.completed == true)
        this.completedTodoSID = this.completedTodoS.map((todo: any) => todo._id)
        // this.TodoList.filter((todo: any) => todo.completed == false).map((todo: any) => this.activeTodos.push(todo))
        this.TodosNum = this.TodoList.length - this.completedTodoSID.length
        this.activeTodos = this.TodoList.filter((todo: any) => !this.completedTodoSID.includes(todo._id))
      },
      error: () => this.isLoading = false
    })
  }

  addTodo(dataForm: FormGroup) {
    this.newTodo = {
      title: dataForm.get('title')?.value,
      apiKey: this.apiKey
    }
    if (dataForm.status == 'VALID') {
      this._TodoService.addTodo(this.newTodo).subscribe({
        next: () => {
          this.getAllTodoS()
          dataForm.reset()
        },
        error: () => this.isLoading = false
      })
    }
  }

  deleteTodo(todoId: string) {
    this._TodoService.deleteTodo(todoId).subscribe({
      next: () => this.getAllTodoS(),
      error: () => this.isLoading = false
    })
  }

  clearCompleted() {
    for (const id of this.completedTodoSID) {
      this.deleteTodo(id)
    }
  }

  updateTodo(dataForm: FormGroup) {
    if (dataForm.status == 'VALID') {
      this.addTodo(dataForm)
      this.deleteTodo(this.TodoIdToUpdate)
      this.customModal.nativeElement.classList.replace('d-flex', 'd-none')
      document.body.style.overflow = 'auto'
    }
  }

  markCompletedTodo(todoId: string) {
    this._TodoService.completedTodo({ todoId: todoId }).subscribe({
      next: () => this.getAllTodoS(),
      error: () => this.isLoading = false
    })
  }

  showAll() {
    this.allFlag = true
    this.activeFlag = false
    this.completedFlag = false
  }

  showActive() {
    this.allFlag = false
    this.activeFlag = true
    this.completedFlag = false
  }

  showCompleted() {
    this.allFlag = false
    this.activeFlag = false
    this.completedFlag = true
  }

  showModel(todoId: string) {
    document.body.style.overflow = 'hidden'
    this.TodoIdToUpdate = todoId
    this.customModal.nativeElement.classList.replace('d-none', 'd-flex')
  }

  closeModel() {
    document.body.style.overflow = 'auto'
    this.customModal.nativeElement.classList.replace('d-flex', 'd-none')
    this.UpdateTodoForm.reset()
  }

  changeTheme(e: any) {
    e.target.classList.contains('fa-sun') ? e.target.classList.replace('fa-sun', 'fa-moon') : e.target.classList.replace('fa-moon', 'fa-sun');
    document.body.classList.toggle('dark-mode');
  }
}
