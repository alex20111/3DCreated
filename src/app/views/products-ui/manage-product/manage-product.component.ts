import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { ActivatedRoute, Router, RouterModule, } from '@angular/router';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DisableControlDirective } from '../../../directives/disable-control.directive';
import { EditorConfig, NgxSimpleTextEditorModule, ST_BUTTONS } from 'ngx-simple-text-editor';
import { map } from 'rxjs';

@Component({
  selector: 'app-manage-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FontAwesomeModule,
    DisableControlDirective,
    RouterModule,
    NgxSimpleTextEditorModule

  ],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.css',
})
export class ManageProductComponent implements OnInit, OnDestroy {

  SERVER_HOST: string = 'http://localhost:3000/';

  faTrash = faTrash;

  config: EditorConfig = {
    placeholder: 'Item description',
    buttons: ST_BUTTONS,
  };

  toManyFiles: boolean = false;
  noCoverFile: boolean = true;

  previewImgList: PreviewImage[] = [];
  categories: any;

  file: fileToUpload[] = [];
  coverFile: File | undefined;  //cover image file
  coverPreviewImg: string = ''; //cover image that goes on main page

  editProductId: number | undefined;
  delImageIds: number[] = [];

  @ViewChild('productImage', { static: false })
  InputVar: ElementRef | undefined;

  submitted: boolean = false;

  form: FormGroup = this.formBuilder.group({
    title: [
      '' ,
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200),
      ],
    ],
    price: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200),
      ]
    ],
    quantity: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    category: ['', Validators.required]
  });
  
  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    // this.editor.destroy();
  }

  ngOnInit(): void {
    this.route.data.subscribe(({catgList}) => {
     this.categories = catgList.categories;
    });

    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.editProductId = +paramId;
    } else {
      this.editProductId = undefined;
    }
    console.log('editProductId: ', this.editProductId);

    if (this.editProductId) {
      this.adminService.getProduct(this.editProductId).subscribe({
        next: (result) => {
          console.log(result);
          this.noCoverFile = false;
          const product = result.product;
          this.coverPreviewImg = this.SERVER_HOST + product.coverImageUrl;

          product.productImages.forEach((i: any) => {
            this.previewImgList.push({
              id: i.id,
              preview: this.SERVER_HOST + i.imageUrl,
              fileId: 0
            })
          })
          //set the form values based on the retrieve product
          this.form.setValue({
            title: product.title,
            price: product.price,
            description: product.description,
            quantity: product.quantity,
            category: 1
          });
        },
        error: (err) => {
          console.error(" error  getProduct: ", err);
        },
      });
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid || this.noCoverFile) {
      return;
    }

    const formData = new FormData();

    formData.append('title', this.form.get('title')!.value);
    formData.append('price', this.form.get('price')!.value);
    formData.append('description', this.form.get('description')!.value);
    formData.append('quantity', this.form.get('quantity')!.value);
    formData.append('categoryId', this.form.get('category')!.value);

    [...this.file].forEach((imgFile) => {
      formData.append('image', imgFile.file);
    });

    if (this.coverFile) {
      formData.append('coverImage', this.coverFile);
    }

    // console.log(formData);
    // console.log(JSON.stringify(this.form.value, null, 2));

    if (this.editProductId) {
      formData.append('id', this.editProductId.toString());
      if (this.delImageIds.length > 0) {
        this.delImageIds.forEach(id => {
          formData.append('imgToDel', id.toString());
        })

      }
      this.adminService.editProduct(formData).subscribe({
        next: (result) => {
          console.log(result);
          this.router.navigate(['/viewProduct', result.productId]);
        },
        error: (err) => {
          console.error("editProduct: ", err);
        }
      });

    } else {
      this.adminService.addProduct(formData).subscribe({
        next: (postResult) => {
          console.log('Success: ', postResult);
          this.submitted = false;
          this.router.navigate(['/viewProduct', postResult.productId]);
        },
        error: (err) => {
          console.error("addProduct Error: ", err);
        },
      });
    }
  }

  fileChangeHandler(event: any) {
    const prevLength = this.previewImgList.length;

    if (event.target.files) {
      const filesNbr = event.target.files.length;

      if (prevLength + filesNbr > 5) {
        console.log('to many files');
        this.toManyFiles = true;
      } else {
        this.toManyFiles = false;
        [...event.target.files].forEach((f: any) => {
          const fileId = Math.floor(Math.random() * 100000);
          this.generatePreview(f, fileId);
          this.file.push({
            id: fileId,
            file: f
          });
        });

        if (this.InputVar) {
          this.InputVar.nativeElement.value = '';
        }
      }
    }
  }
  //handle the file for the cover image
  coverFileChangeHandler(event: any) {
    this.coverPreviewImg = '';

    if (event.target.files) {
      this.coverFile = event.target.files[0];
      if (this.coverFile) {
        this.noCoverFile = false;
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.coverPreviewImg = e.target.result;
        };
        reader.readAsDataURL(this.coverFile);
      }
    }
  }

  removeImageFile(idx: number, fileId: number) {
    this.toManyFiles = false;


    if (this.editProductId) {
      const delItem: PreviewImage[] = this.previewImgList.splice(idx, 1);
      // console.log("delItem[0]: ", delItem[0]);
      if (delItem[0].id && delItem[0].id > 0) {
        this.delImageIds.push(delItem[0].id);
      } else {
        // console.log("Start: ", this.file, "  index: " , fileId);
        const indexToDel = this.file.findIndex(i => {
          // console.log("i: ", i);
          return i.id === fileId
        });
        // console.log("indexToDel: " , indexToDel);
        this.file.splice(indexToDel, 1);
      }
    } else {
      this.previewImgList.splice(idx, 1);;
      this.file.splice(idx, 1);
    }
  }

  private generatePreview(file: File, id: number) {
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const preview = {
          id: -1,
          preview: e.target.result,
          fileId: id
        }
        this.previewImgList.push(preview);
      };
      reader.readAsDataURL(file);
    }
  }
}

export interface PreviewImage {
  id: number,
  preview: string,
  fileId: number
}

export interface fileToUpload {
  id: number,
  file: File
}
