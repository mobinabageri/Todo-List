import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore'
import { map, Observable } from 'rxjs';
import { category } from '../Models/category.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CateguryService {

  constructor(private fireService:AngularFirestore,private toastr:ToastrService) { }

  createCategory(categoryName:string){
   const newCategory:category={
    category:categoryName,
    categoryColor:this.colorCategory(),
    todoCount:0
   }
 
    this.fireService.collection('Category').add(newCategory).then(()=>{
this.toastr.success("دسته بندی با موفقیت اضافه شد")
    })
    
  }

  feachCategory() : Observable<category[]>{
   return this.fireService.collection('Category').snapshotChanges().pipe(
    map((actions)=>{
    return actions.map((action)=>{
      const data:any =action.payload.doc.data();
      const id =action.payload.doc.id;
      const categories:category={
        id:id,
        category:data.category,
        categoryColor:data.categoryColor,
        todoCount:data.todoCount
      }
      return categories
    })
    })
   )
  }


  deleteCategory(categoryId:string){
this.fireService.collection('Category').doc(categoryId).delete().then(()=>{
  this.toastr.error("دسته بندی با موفقیت حذف شد")

})
  }

  editCategory(categoryId: string, categoryName: string) {
    this.fireService
      .doc('Category/' + categoryId)
      .update({ category: categoryName }).then(()=>{
        this.toastr.info("دسته بندی با موفقیت ویرایش شد")
      
      });
  }


 private colorCategory(){
    const colors=[
      '#FFB38E',
      '#D1E9F6',
      '#B3A492',
      '#C7E9B0',
      '#FFD63A',
      '#6DE1D2'
    ]

    const randomindex=Math.floor(Math.random() *colors.length);

    return colors[randomindex]
  }

}
