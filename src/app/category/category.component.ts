import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { category } from  '../Models/category.model';
import { CateguryService } from '../services/categury.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  constructor(private categoryService: CateguryService) {}

  categoryName: string = '';
  categories: Array<category> = [];
  isAddOrEdit: boolean = true;
  categoryId: string = '';

  ngOnInit() {
    this.categoryService.feachCategory().subscribe((categories) => {
      this.categories = categories;
    });
  }

  onSubmit(form: NgForm) {
    const newCategoryName = form.value.categoryName;
    if (this.isAddOrEdit) {
      this.categoryService.createCategory(newCategoryName);
    } else {
      this.categoryService.editCategory(this.categoryId,newCategoryName);
      this.isAddOrEdit=true
      
    }
    form.reset();
  }

  onDragStart(event: DragEvent, categoryId: any,categoryName:any) {
    event.dataTransfer?.setData('text/plain', categoryName);
   this.categoryId= categoryId
  }

  onDrop(event: DragEvent) {
    let  categoryName = event.dataTransfer?.getData('text/plain');
    const category = this.categories.filter((category) => {
      return category.category === categoryName && category.id===this.categoryId;
       
    });
   
    this.categoryName = category[0].category;
    this.isAddOrEdit = false;
    console.log(this.categoryId);
    
  }
  onDragOver(event: Event) {
    event.preventDefault();
  }

  ondeleteCategory(catId:string){
    this.categoryService.deleteCategory(catId)
  }
}
