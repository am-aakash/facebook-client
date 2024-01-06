import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FacebookService } from 'src/app/shared_service/facebook.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  postForm!: FormGroup;

  constructor(private fb: FormBuilder, private facebookService: FacebookService, private router: Router,) {

  }

  ngOnInit(): void {
    this.postForm = this.fb.group({
      content: [''],
      mediaType: ['Image'],
      mediaUrl: ['']
    });
  }

  onSubmit() {
    const formData = this.postForm?.value;
    if (!(this.postForm.controls['content'].value === ''))
      this.facebookService.createPost(formData)
        .subscribe((success) => {
          this.router.navigate(['/feed']);
        });
  }
}
