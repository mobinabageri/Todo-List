import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { TodoModel } from '../Models/Todo.Model';
import firebase from 'firebase/compat/app';
import {increment} from '@angular/fire/firestore'
import { Title } from '@angular/platform-browser';
@Injectable({
  providedIn: 'root'
})
export class TodoService {

constructor(private fireService:AngularFirestore) { }

  createTodo(todoName:string,categoryId:string){
    const id = this.fireService.createId();

    const newTodo:TodoModel={
      id:id,
      title:todoName,
      isCompleted:false
    }    

    this.fireService.collection('Category').doc(categoryId).collection('todos').add(newTodo).then(
      res=>{
        // this.fireService.collection('Category').doc(categoryId).update({todoCount:firebase.firestore.FieldValue.increment(1)})
          this.fireService.collection('Category').doc(categoryId).update({todoCount:increment(1)})
      }
    )

  }

  fetchTodos(categoryId: string) {
    return this.fireService
      .collection('Category')
      .doc(categoryId)
      .collection('todos')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((action) => {
            const data: any = action.payload.doc.data();
            const id = action.payload.doc.id;
            const todo: TodoModel = {
              id: id,
              title: data.title,
              isCompleted: data.isCompleted,
            };
            
            return todo;
          });
        })
      );
  }

deleteTodo(todoId :string,categoryId:string){
this.fireService.collection('Category').doc(categoryId).collection('todos').doc(todoId).delete().then(
  res=>{
     this.fireService.collection('Category').doc(categoryId).update({todoCount:increment(-1)})

  }
)
}

editTodo(categoryId:string,todoId:string,todoName:string){
  this.fireService.collection('Category').doc(categoryId).collection('todos').doc(todoId).update({title:todoName})
}
  

unComplited(todoId:string,categoryId:string){
this.fireService.collection('Category').doc(categoryId).collection('todos').doc(todoId).update({isCompleted:false})
}
Complited(todoId:string,categoryId:string){
  this.fireService.collection('Category').doc(categoryId).collection('todos').doc(todoId).update({isCompleted:true})

}
 }
