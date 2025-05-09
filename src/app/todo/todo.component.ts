import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TodoService } from '../services/todo.service';
import { TodoModel } from '../Models/Todo.Model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit{
  isAddOrEdit: boolean = true;
  todoName: string = '';
  categoryId:string='';
  todos:TodoModel[]=[];
  todoId:string='';

  constructor(private activaedrout:ActivatedRoute,private todoService:TodoService){}
  ngOnInit() {
    this.categoryId = this.activaedrout.snapshot.paramMap.get('id')!;
    this.todoService.fetchTodos(this.categoryId).subscribe((todos) => {
      this.todos = todos;
     
    });
  }

  onSubmit(form:NgForm){
    const newTodoName = form.value.todoName;
    if (this.isAddOrEdit) {
      this.todoService.createTodo(newTodoName,this.categoryId);
    } else {
      this.todoService.editTodo(this.categoryId,this.todoId,this.todoName);
      this.isAddOrEdit=true
      
    }
    form.reset();
  }
  DeleteTodo(todoId:string){
    this.todoService.deleteTodo(todoId,this.categoryId)
  }
  onDragStart(event:DragEvent,todoName:string,todoId:string){
    event.dataTransfer?.setData('text/plain', todoName);
    this.todoId= todoId
  }
  onDrop(event: DragEvent) {
    let  todoName = event.dataTransfer?.getData('text/plain');
    const todoes = this.todos.filter((todo) => {
      return todo.title === todoName && todo.id===this.todoId;
       
    });
   
    this.todoName = todoes[0].title;
    this.isAddOrEdit = false;
    
  }
  onDragOver(event: Event) {
    event.preventDefault();
  }

  onEdite(todoId:string , todotitle:string){
    this.isAddOrEdit=false;
  this.todoId=todoId;
  this.todoName=todotitle

}
toggleIsComplited(todiId:string,isCompleted:boolean){
  if(isCompleted){
    this.todoService.unComplited(todiId,this.categoryId)
  }
  else{
    this.todoService.Complited(todiId,this.categoryId)
  }
}
}
