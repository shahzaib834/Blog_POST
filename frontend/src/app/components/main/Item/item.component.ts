import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { BlogsDataModel } from 'src/app/models/Blog.model';

@Component({
  selector: 'app-main-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {
  // @ts-ignore
  blog: BlogsDataModel;

  constructor(private router: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService
      .getData(`blogs/${this.router.snapshot.paramMap.get('id')}`)
      .subscribe(
        (res: BlogsDataModel[]) => {
          this.blog = res[0];
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
