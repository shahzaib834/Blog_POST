import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { BlogsDataModel } from 'src/app/models/Blog.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  public blogs: BlogsDataModel[] = [];

  public modalOpened: boolean = false;
  public selectedModalType: string = '';

  // @ts-ignore
  myForm: FormGroup;

  constructor(
    private router: Router,
    private api: ApiService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      image: [''],
    });

    this.fetchData();
  }

  fetchData() {
    this.api.getData('blogs/allBlogs').subscribe(
      (res) => {
        this.blogs = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  openModal(type: string) {
    this.selectedModalType = type;
    this.modalOpened = true;
  }

  closeModal() {
    this.modalOpened = false;
  }

  onSelect(blog: BlogsDataModel) {
    this.router.navigate(['/item', blog.id]);
  }

  create() {
    const title = this.myForm.controls['title'].value;
    const description = this.myForm.controls['description'].value;
    const category = this.myForm.controls['category'].value;
    const image = this.myForm.controls['image'].value;
    const body = {
      title,
      description,
      category,
      image,
    };
    this.api.postDataWithHeaders('blogs/add', body).subscribe(
      (res) => {
        // close Modal
        this.closeModal();
        // Refetch Data
        this.fetchData();
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
