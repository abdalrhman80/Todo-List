import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  baseUrl: string = 'https://todos.routemisr.com/api/v1/todos'
  constructor(private _HttpClient: HttpClient) { }

  getApiKey(): Observable<any> {
    return this._HttpClient.get('${baseUrl}getApiKey',)
  }

  getAllTodoS(apiKey: string): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/${apiKey}`)
  }

  addTodo(todoData: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}`, todoData)
  }

  deleteTodo(todoId: any): Observable<any> {
    return this._HttpClient.delete(`${this.baseUrl}`,
      { body: { todoId: todoId } })
  }

  completedTodo(todoId: any): Observable<any> {
    return this._HttpClient.put(`${this.baseUrl}`, todoId)
  }
}
