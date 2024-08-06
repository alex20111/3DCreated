import { CommonModule } from '@angular/common';
import { Component, ElementRef, TemplateRef, ViewChild, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleQuestion, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { NgbDatepickerModule, NgbModal, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { StlModelViewerModule } from 'angular-stl-model-viewer';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { DisableControlDirective } from '../../directives/disable-control.directive';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { QuoteService } from '../../services/quote.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-quote',
  standalone: true,
  imports: [StlModelViewerModule, CommonModule, FontAwesomeModule, NgbDatepickerModule, ReactiveFormsModule,
    DisableControlDirective, NgbProgressbarModule,
    RouterModule],
  templateUrl: './quote.component.html',
  styleUrl: './quote.component.css'
})
export class QuoteComponent {

  private modalService = inject(NgbModal);
  modalMessage: ModalMessage = {} as ModalMessage;
  faQuestion = faQuestion;

  submitted: boolean = false;

  maxFileSize: number = 36700160; //35meg
  // maxFileSize: number = 10000; //35meg
  message: string = "";
  messageSub: string = ""; //when quote is submitted
  stlDimensions: any;
  stlLongFileName: string = '';

  quoteForm: FormGroup = this.formBuilder.group({
    material: ['',
      [Validators.required],
    ],
    color: ['',
      [Validators.required],
    ],
    infil: ['20',
      [Validators.required, Validators.pattern('^[0-9]*$')],
    ],
    layerHeight: ['0.20', [Validators.required]],
    wallCount: ['2', [Validators.required, Validators.pattern('^[0-9]*$')]],
    // estPrice: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    email: [
      '',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255),
        Validators.email
      ]
    ],
    additionalInfo: ''
  });

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private quotesService: QuoteService) { }

  get f(): { [key: string]: AbstractControl } {
    return this.quoteForm.controls;
  }
  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef | undefined;

  file: any;
  newStl: any;

  /**
   * on file drop handler
   */
  onFileDropped($event: any) {
    if ($event.target.files)
      this.prepareFilesList($event); 
  }
  /**
   * handle file from browsing
   */
  fileBrowseHandler(event: any) {
    // console.log("fileBrowseHandler event.target.files: ", event.target.files)
    if (event.target.files)
      this.prepareFilesList(event);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(event: any) {

    console.log("files: ", event.target.files);
    const initFile = event.target.files[0];
    const fileName = initFile.name.toString();
    // console.log("initFile: ", initFile);

    const fileExt = fileName.substring(fileName.indexOf(".") + 1, fileName.length);
    // console.log("Name ext: ", fileExt);

    if (fileExt !== 'stl') {
      this.message = "File needs to be a STL file";
      return;
    }

    if (initFile.size > this.maxFileSize) {
      this.message = "File size cannot exceed 35 mb."
      return;
    }
    this.file = initFile;
    this.file.progress = 0;

    if (this.fileDropEl) {
      this.fileDropEl.nativeElement.value = "";
    }

    this.uplFile();

  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: any, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  readSTLFile() {
    console.log("read stl event: ")
    // = '' as unknown as ArrayBuffer;
    if (this.file) {
      const reader = new FileReader();

      reader.onload = (e) => {

        if (e.target)
          this.newStl = e.target.result;
      }
      reader.readAsDataURL(this.file);
    }
  }
  open(content: TemplateRef<any>, idx: number) {
    if (idx === 1) {
      this.modalMessage.title = "Material";
      this.modalMessage.body = "Description of the material";
    } else if (idx === 2) {
      this.modalMessage.title = "Color";
      this.modalMessage.body = "Description of the color";
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  submit() {
    // console.log(this.quoteForm.value);
    // console.log(this.quoteForm.invalid);
    // console.log(this.file.name);

    if (this.quoteForm.invalid || !this.file) {
      return;
    }

    const formData = new FormData();

    formData.append('material', this.quoteForm.get('material')!.value);
    formData.append('color', this.quoteForm.get('color')!.value);
    formData.append('infil', this.quoteForm.get('infil')!.value);
    formData.append('layerHeight', this.quoteForm.get('layerHeight')!.value);
    formData.append('wallCount', this.quoteForm.get('wallCount')!.value);
    formData.append('email', this.quoteForm.get('email')!.value);
    formData.append('additionalInfo', this.quoteForm.get('additionalInfo')!.value);
    formData.append('stlFileName', this.file.name);
    formData.append('stlLongFileName', this.stlLongFileName);

    this.submitted = true;

    this.quotesService.sendQuote(formData).subscribe({
      next: (result) => {
        this.messageSub = `Quote submitted to ${this.quoteForm.get('email')!.value}. You will receive an response within 24 to 48 hours. Thank you`;
        this.submitted = false;
      },
      error: (err) => {
        this.messageSub = "Error: " + err.error.message;
        this.submitted = false;
      }
    });
    
  }

  uplFile() {
    console.log(this.quoteForm.value);

    const formData = new FormData();
    formData.append('stlFile', this.file);

    this.quotesService.uploadStlFile(formData).subscribe({
      next: (event: any) => {
        // console.log("Next: " , event);
        if (event.type === HttpEventType.UploadProgress) {
          // this.progress = Math.round((100 * event.loaded) / event.total);

          // console.log("Progress: ", Math.round((100 * event.loaded) / event.total));
          this.file.progress = Math.round((100 * event.loaded) / event.total);
        } else if (event instanceof HttpResponse) {
          // console.log("HttpResponse: ", event);
          this.stlDimensions = event.body.dimensions;
          this.stlLongFileName = event.body.fileName;
          // this.message = event.body.message;
          // this.fileInfos = this.uploadService.getFiles();
        }
      },
      error: (err: any) => {
        console.log(err);

        if (err.error && err.error.message) {
          this.message = err.error.message;
        } else {
          this.message = 'Could not upload the file!';
        }

        // this.currentFile = undefined;
        // this.progress = 0;
        this.file.progress = 0;
      },
      complete: () => {
        // this.currentFile = undefined;
        // console.log("completed");
        setTimeout(() => {
          this.readSTLFile()
        }, 500);
      }
    });


  }
  clearOrRestart(){
    this.newStl = undefined; 
    this.file = undefined;
    // form.reset({ first: 'name', last: 'last name' });
    this.quoteForm.reset({material: '', color:'', infil: '20', layerHeight: '0.20', wallCount: '2', email: '', additionalInfo: ''});
    this.message = "";
    this.messageSub = ""; //when quote is submitted
    this.stlDimensions = undefined;
    this.stlLongFileName = '';
  }
}


export interface ModalMessage {
  title: string,
  body: string
}