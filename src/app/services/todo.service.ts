import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  baseUrl: string = 'https://todos.routemisr.com/api/v1/'
  constructor(private _HttpClient: HttpClient) { }

  getApiKey(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}getApiKey`)
  }

  getAllTodoS(apiKey: string): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}todos/${apiKey}`)
  }

  addTodo(todoData: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}todos`, todoData)
  }

  deleteTodo(todoId: any): Observable<any> {
    return this._HttpClient.delete(`${this.baseUrl}todos/`,
      { body: { todoId: todoId } })
  }

  completedTodo(todoId: any): Observable<any> {
    return this._HttpClient.put(`${this.baseUrl}todos`, todoId)
  }
}
